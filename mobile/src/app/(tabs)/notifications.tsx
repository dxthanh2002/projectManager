import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';

export default function NotificationsScreen() {
    const theme = useTheme();
    const [refreshing, setRefreshing] = React.useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        // TODO: Implement notifications refresh
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRefreshing(false);
    };

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
            {/* Celebratory Empty State */}
            <View style={styles.emptyState}>
                <Text variant="displaySmall">🎉</Text>
                <Text variant="titleMedium" style={styles.emptyTitle}>
                    All caught up!
                </Text>
                <Text variant="bodyMedium" style={styles.emptyText}>
                    You have no new notifications.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flex: 1,
        padding: 16,
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
        opacity: 0.7,
        textAlign: 'center',
    },
});
