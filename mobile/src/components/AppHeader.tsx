import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { useTeam } from '../hooks/use-teams';
import { useAppStore } from '../stores/use-app-store';

interface AppHeaderProps {
    title?: string;
    onMenuPress?: () => void;
    showMenu?: boolean;
}

export function AppHeader({ title, onMenuPress, showMenu = true }: AppHeaderProps) {
    const theme = useTheme();
    const { currentTeamId } = useAppStore();
    const { data: currentTeam } = useTeam(currentTeamId);

    // Use provided title or current team name
    const displayTitle = title || currentTeam?.name || 'Select Workspace';

    return (
        <Appbar.Header style={styles.header}>
            {showMenu && (
                <Appbar.Action
                    icon="menu"
                    onPress={onMenuPress}
                    accessibilityLabel="Open navigation menu"
                />
            )}
            <Appbar.Content
                title={displayTitle}
                titleStyle={styles.title}
            />
        </Appbar.Header>
    );
}

const styles = StyleSheet.create({
    header: {
        elevation: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
});
