import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Chip, ActivityIndicator, useTheme, Button } from 'react-native-paper';
import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@/stores/use-app-store';
import { useTeam, useTeams } from '@/hooks/use-teams';
import { useTaskStats } from '@/hooks/use-tasks';
import { StatusColors } from '@/constants/theme';

export default function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { currentTeamId } = useAppStore();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: team, isLoading: teamLoading, refetch: refetchTeam, isRefetching: teamRefetching } = useTeam(currentTeamId);
  const { stats, isLoading: statsLoading, refetch: refetchStats } = useTaskStats(currentTeamId);
  const queryClient = useQueryClient();

  // Refetch data when screen gains focus
  useFocusEffect(
    useCallback(() => {
      refetchTeam();
      refetchStats();
    }, [refetchTeam, refetchStats])
  );

  const handleRefresh = async () => {
    await Promise.all([
      refetchTeam(),
      queryClient.invalidateQueries({ queryKey: ['tasks', currentTeamId] }),
    ]);
  };

  const handleCreateWorkspace = () => {
    router.push('/modal');
  };

  const isLoading = teamLoading || statsLoading;
  const isRefetching = teamRefetching;

  // New user with no workspaces - show onboarding
  if (!teamsLoading && (!teams || teams.length === 0)) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.onboardingContainer}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons
              name="briefcase-plus-outline"
              size={64}
              color={theme.colors.primary}
            />
          </View>
          <Text variant="headlineMedium" style={styles.onboardingTitle}>
            Chào mừng đến ManagerCheck! 🎉
          </Text>
          <Text variant="bodyLarge" style={[styles.onboardingText, { color: theme.colors.onSurfaceVariant }]}>
            Bạn chưa có workspace nào. Hãy tạo workspace đầu tiên để bắt đầu quản lý công việc.
          </Text>
          <Button
            mode="contained"
            icon="plus"
            onPress={handleCreateWorkspace}
            style={styles.createButton}
            contentStyle={styles.createButtonContent}
          >
            Tạo Workspace
          </Button>
        </View>
      </View>
    );
  }

  // No team selected state (has workspaces but none selected)
  if (!currentTeamId) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text variant="headlineMedium" style={styles.emptyTitle}>
            Welcome to ManagerCheck! 👋
          </Text>
          <Text variant="bodyLarge" style={styles.emptyText}>
            Open the menu to select a workspace or create a new one.
          </Text>
        </View>
      </View>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating size="large" />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={handleRefresh}
          colors={[theme.colors.primary]}
        />
      }
    >
      {/* Team Info Card */}
      <Card style={styles.card}>
        <Card.Title
          title={team?.name || 'Workspace'}
          subtitle={team?.description || 'No description'}
          left={(props) => (
            <Chip mode="outlined" compact {...props}>
              Team
            </Chip>
          )}
        />
      </Card>

      {/* Quick Stats Card */}
      <Card style={styles.card}>
        <Card.Title title="Task Overview" />
        <Card.Content>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="displaySmall" style={{ color: theme.colors.primary }}>
                {stats.total}
              </Text>
              <Text variant="labelSmall">Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="displaySmall" style={{ color: StatusColors.in_progress }}>
                {stats.in_progress}
              </Text>
              <Text variant="labelSmall">In Progress</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="displaySmall" style={{ color: StatusColors.blocked }}>
                {stats.blocked}
              </Text>
              <Text variant="labelSmall">Blocked</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="displaySmall" style={{ color: StatusColors.done }}>
                {stats.done}
              </Text>
              <Text variant="labelSmall">Done</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Status Breakdown Card */}
      <Card style={styles.card}>
        <Card.Title title="Status Breakdown" />
        <Card.Content>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <View style={[styles.statusDot, { backgroundColor: StatusColors.todo }]} />
              <Text variant="bodyMedium">To Do</Text>
              <Text variant="labelMedium" style={styles.breakdownCount}>{stats.todo}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.statusDot, { backgroundColor: StatusColors.in_progress }]} />
              <Text variant="bodyMedium">In Progress</Text>
              <Text variant="labelMedium" style={styles.breakdownCount}>{stats.in_progress}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.statusDot, { backgroundColor: StatusColors.blocked }]} />
              <Text variant="bodyMedium">Blocked</Text>
              <Text variant="labelMedium" style={styles.breakdownCount}>{stats.blocked}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.statusDot, { backgroundColor: StatusColors.done }]} />
              <Text variant="bodyMedium">Done</Text>
              <Text variant="labelMedium" style={styles.breakdownCount}>{stats.done}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  card: {
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  breakdownRow: {
    gap: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  breakdownCount: {
    marginLeft: 'auto',
    opacity: 0.7,
  },
  onboardingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  onboardingTitle: {
    textAlign: 'center',
    fontWeight: '700',
  },
  onboardingText: {
    textAlign: 'center',
    lineHeight: 24,
  },
  createButton: {
    marginTop: 12,
    borderRadius: 12,
  },
  createButtonContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
