import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { useAppStore } from '@/stores/use-app-store';

export default function TasksScreen() {
    const theme = useTheme();
    const { currentTeamId } = useAppStore();
    const [refreshing, setRefreshing] = React.useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        // TODO: Implement task refresh
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRefreshing(false);
    };

    // No team selected
    if (!currentTeamId) {
        return (
            <View style={styles.emptyState}>
                <Text variant="titleMedium">Select a workspace first</Text>
                <Text variant="bodyMedium" style={styles.emptyText}>
                    Open the menu to choose a workspace
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
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={[theme.colors.primary]}
                />
            }
        >
            {/* Placeholder - Will be implemented in Story 7-2 */}
            <Card style={styles.card}>
                <Card.Title title="My Tasks" subtitle="Coming in Story 7-2" />
                <Card.Content>
                    <Text variant="bodyMedium" style={styles.placeholderText}>
                        Task list with filtering will be implemented here.
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
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        gap: 8,
    },
    emptyText: {
        opacity: 0.7,
        textAlign: 'center',
    },
    card: {
        marginBottom: 8,
    },
    placeholderText: {
        opacity: 0.6,
        fontStyle: 'italic',
    },
});
