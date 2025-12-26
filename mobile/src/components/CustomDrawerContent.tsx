import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import {
    Text,
    Avatar,
    Divider,
    ActivityIndicator,
    Button,
    useTheme,
    IconButton,
    List
} from 'react-native-paper';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useTeams } from '../hooks/use-teams';
import { useAppStore } from '../stores/use-app-store';
import { useSession, signOut } from '../lib/auth-client';
import { Team } from '../types/api';

export function CustomDrawerContent(props: DrawerContentComponentProps) {
    const theme = useTheme();
    const router = useRouter();
    const { data: session } = useSession();
    const { data: teams, isLoading, error, refetch } = useTeams();
    const { currentTeamId, setCurrentTeamId, reset } = useAppStore();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleTeamPress = (team: Team) => {
        setCurrentTeamId(team.id);
        props.navigation.closeDrawer();
    };

    const handleCreateTeam = () => {
        router.push('/modal');
        props.navigation.closeDrawer();
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            reset();
            await signOut();
            props.navigation.closeDrawer();
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        const name = session?.user?.name || session?.user?.email || 'U';
        return name.charAt(0).toUpperCase();
    };

    const getTeamInitials = (team: Team) => {
        const words = team.name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return team.name.substring(0, 2).toLowerCase();
    };

    const renderTeamItem = ({ item: team }: { item: Team }) => {
        const isSelected = team.id === currentTeamId;
        const isManager = team.createdById === session?.user?.id;

        return (
            <Pressable
                onPress={() => handleTeamPress(team)}
                style={({ pressed }) => [
                    styles.teamItem,
                    isSelected && { backgroundColor: theme.colors.primaryContainer },
                    pressed && { opacity: 0.7 }
                ]}
            >
                {/* Team Avatar */}
                <View style={[
                    styles.teamAvatar,
                    { borderColor: isSelected ? theme.colors.primary : 'transparent' }
                ]}>
                    <Text style={styles.teamInitials}>
                        {getTeamInitials(team)}
                    </Text>
                </View>

                {/* Team Info */}
                <View style={styles.teamInfo}>
                    <Text
                        variant="titleMedium"
                        style={[styles.teamName, isSelected && { fontWeight: '700' }]}
                        numberOfLines={1}
                    >
                        {team.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.teamUrl} numberOfLines={1}>
                        {team.description || 'No description'}
                    </Text>
                </View>

                {/* More Options */}
                <IconButton
                    icon="dots-vertical"
                    size={20}
                    onPress={() => { }}
                    style={styles.moreButton}
                />
            </Pressable>
        );
    };

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text variant="titleLarge" style={styles.headerTitle}>
                    Workspaces
                </Text>
                <Text
                    variant="labelLarge"
                    style={[styles.editButton, { color: theme.colors.primary }]}
                >
                    Edit
                </Text>
            </View>

            {/* Team List */}
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
                    <Button mode="text" onPress={() => refetch()}>
                        Retry
                    </Button>
                </View>
            ) : teams && teams.length > 0 ? (
                <FlatList
                    data={teams}
                    renderItem={renderTeamItem}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text variant="bodyMedium" style={styles.emptyText}>
                        No workspaces yet
                    </Text>
                </View>
            )}

            {/* Footer Actions */}
            <View style={styles.footer}>
                <Divider style={styles.divider} />

                <List.Item
                    title="Add a workspace"
                    left={() => <List.Icon icon="plus" />}
                    onPress={handleCreateTeam}
                    style={styles.footerItem}
                />
                <List.Item
                    title="Preferences"
                    left={() => <List.Icon icon="cog-outline" />}
                    onPress={() => { }}
                    style={styles.footerItem}
                />
                <List.Item
                    title="Help"
                    left={() => <List.Icon icon="help-circle-outline" />}
                    onPress={() => { }}
                    style={styles.footerItem}
                />

                <Divider style={styles.divider} />

                {/* User Info */}
                <View style={styles.userInfo}>
                    <Avatar.Text
                        size={40}
                        label={getUserInitials()}
                        style={{ backgroundColor: theme.colors.primary }}
                    />
                    <View style={styles.userDetails}>
                        <Text variant="titleSmall" numberOfLines={1}>
                            {session?.user?.name || 'User'}
                        </Text>
                        <Text variant="bodySmall" style={styles.email} numberOfLines={1}>
                            {session?.user?.email}
                        </Text>
                    </View>
                </View>

                {/* Logout Button */}
                <Button
                    mode="outlined"
                    onPress={handleLogout}
                    loading={isLoggingOut}
                    disabled={isLoggingOut}
                    icon="logout"
                    style={styles.logoutButton}
                    textColor={theme.colors.error}
                >
                    Đăng xuất
                </Button>
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingTop: 8,
    },
    headerTitle: {
        fontWeight: '700',
    },
    editButton: {
        fontWeight: '600',
    },
    teamItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 12,
    },
    teamAvatar: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    teamInitials: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    teamInfo: {
        flex: 1,
        gap: 2,
    },
    teamName: {
        fontWeight: '600',
    },
    teamUrl: {
        opacity: 0.6,
    },
    moreButton: {
        margin: 0,
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
        gap: 8,
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        opacity: 0.7,
    },
    footer: {
        marginTop: 'auto',
    },
    divider: {
        marginVertical: 8,
    },
    footerItem: {
        paddingVertical: 4,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    userDetails: {
        flex: 1,
    },
    email: {
        opacity: 0.7,
    },
    logoutButton: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderColor: '#EF4444',
    },
});
