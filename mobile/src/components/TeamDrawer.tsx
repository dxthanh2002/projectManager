import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
    Drawer,
    Text,
    List,
    Divider,
    ActivityIndicator,
    Button,
    useTheme,
    Chip
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTeams } from '../hooks/use-teams';
import { useAppStore } from '../stores/use-app-store';
import { Team } from '../types/api';

interface TeamDrawerProps {
    onClose?: () => void;
}

export function TeamDrawer({ onClose }: TeamDrawerProps) {
    const theme = useTheme();
    const router = useRouter();
    const { data: teams, isLoading, error } = useTeams();
    const { currentTeamId, setCurrentTeamId } = useAppStore();

    const handleTeamPress = (team: Team) => {
        setCurrentTeamId(team.id);
        onClose?.();
    };

    const handleCreateTeam = () => {
        router.push('/modal'); // TODO: Navigate to create team modal
        onClose?.();
    };

    const renderTeamItem = ({ item: team }: { item: Team }) => {
        const isSelected = team.id === currentTeamId;
        const isManager = team.createdById === 'current-user'; // TODO: Get actual user ID

        return (
            <List.Item
                key={team.id}
                title={team.name}
                description={team.description || 'No description'}
                onPress={() => handleTeamPress(team)}
                style={[
                    styles.teamItem,
                    isSelected && { backgroundColor: theme.colors.primaryContainer }
                ]}
                left={(props) => (
                    <List.Icon
                        {...props}
                        icon={isSelected ? 'checkbox-marked-circle' : 'account-group'}
                        color={isSelected ? theme.colors.primary : undefined}
                    />
                )}
                right={() => isManager ? (
                    <Chip compact mode="flat" style={styles.roleChip}>
                        Manager
                    </Chip>
                ) : null}
            />
        );
    };

    // Empty State
    if (!isLoading && (!teams || teams.length === 0)) {
        return (
            <View style={styles.container}>
                <Drawer.Section title="Your Workspaces">
                    <View style={styles.emptyState}>
                        <List.Icon icon="briefcase-plus-outline" color={theme.colors.outline} />
                        <Text variant="bodyMedium" style={styles.emptyText}>
                            You don't have any workspaces yet!
                        </Text>
                        <Button
                            mode="contained"
                            onPress={handleCreateTeam}
                            style={styles.createButton}
                            icon="plus"
                        >
                            Create Your First Workspace
                        </Button>
                    </View>
                </Drawer.Section>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Drawer.Section title="Your Workspaces" showDivider={false}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator animating size="small" />
                        <Text variant="bodySmall" style={styles.loadingText}>
                            Loading teams...
                        </Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.error }}>
                            Failed to load teams
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={teams}
                        renderItem={renderTeamItem}
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={() => <Divider />}
                    />
                )}
            </Drawer.Section>

            <Divider style={styles.divider} />

            <Drawer.Section>
                <List.Item
                    title="Create New Workspace"
                    left={(props) => <List.Icon {...props} icon="plus-circle-outline" />}
                    onPress={handleCreateTeam}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
    },
    teamItem: {
        paddingLeft: 8,
    },
    roleChip: {
        alignSelf: 'center',
        marginRight: 8,
    },
    emptyState: {
        padding: 24,
        alignItems: 'center',
        gap: 12,
    },
    emptyText: {
        textAlign: 'center',
        opacity: 0.7,
    },
    createButton: {
        marginTop: 8,
    },
    loadingContainer: {
        padding: 24,
        alignItems: 'center',
        gap: 8,
    },
    loadingText: {
        opacity: 0.7,
    },
    errorContainer: {
        padding: 24,
        alignItems: 'center',
    },
    divider: {
        marginVertical: 8,
    },
});
