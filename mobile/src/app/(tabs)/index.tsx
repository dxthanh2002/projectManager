import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, Chip, ActivityIndicator, useTheme } from 'react-native-paper';
import { useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/stores/use-app-store';
import { useTeam } from '@/hooks/use-teams';

export default function DashboardScreen() {
  const theme = useTheme();
  const { currentTeamId } = useAppStore();
  const { data: team, isLoading, refetch, isRefetching } = useTeam(currentTeamId);
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    refetch();
  };

  // No team selected state
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
        <Card.Content>
          <Text variant="bodyMedium">
            Welcome to your workspace dashboard. Pull down to refresh.
          </Text>
        </Card.Content>
      </Card>

      {/* Quick Stats Card - Placeholder */}
      <Card style={styles.card}>
        <Card.Title title="Quick Stats" />
        <Card.Content>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="displaySmall" style={{ color: theme.colors.primary }}>
                0
              </Text>
              <Text variant="labelSmall">Total Tasks</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="displaySmall" style={{ color: theme.colors.tertiary }}>
                0
              </Text>
              <Text variant="labelSmall">In Progress</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="displaySmall" style={{ color: '#F59E0B' }}>
                0
              </Text>
              <Text variant="labelSmall">Help Needed</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Activity - Placeholder */}
      <Card style={styles.card}>
        <Card.Title title="Recent Activity" />
        <Card.Content>
          <Text variant="bodyMedium" style={styles.placeholderText}>
            No recent activity. Tasks and updates will appear here.
          </Text>
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
    gap: 16,
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
    marginBottom: 8,
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
  placeholderText: {
    opacity: 0.6,
    fontStyle: 'italic',
  },
});
