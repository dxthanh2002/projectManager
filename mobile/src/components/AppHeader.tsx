import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Text, Modal, Portal, Button, Divider, useTheme } from 'react-native-paper';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useTeam } from '../hooks/use-teams';
import { useAppStore } from '../stores/use-app-store';
import { useSession, signOut } from '../lib/auth-client';

interface AppHeaderProps {
    title?: string;
    showMenu?: boolean;
}

export function AppHeader({ title, showMenu = true }: AppHeaderProps) {
    const theme = useTheme();
    const navigation = useNavigation();
    const { data: session } = useSession();
    const { currentTeamId, reset } = useAppStore();
    const { data: currentTeam } = useTeam(currentTeamId);

    const [userMenuVisible, setUserMenuVisible] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Use provided title or current team name
    const displayTitle = title || currentTeam?.name || 'Select Workspace';

    // Get team initials for avatar
    const getTeamInitials = () => {
        if (!currentTeam?.name) return 'M';
        const words = currentTeam.name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toLowerCase();
        }
        return currentTeam.name.substring(0, 2).toLowerCase();
    };

    // Get user initials
    const getUserInitials = () => {
        const name = session?.user?.name || session?.user?.email || 'U';
        return name.charAt(0).toUpperCase();
    };

    const handleMenuPress = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            reset();
            await signOut();
            setUserMenuVisible(false);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            <View style={[styles.header, { backgroundColor: '#3F0E40' }]}>
                {/* Left: Menu + Team Icon + Team Name */}
                <Pressable
                    onPress={handleMenuPress}
                    style={styles.leftSection}
                >
                    {/* Team Avatar */}
                    <View style={styles.teamAvatar}>
                        <Text style={styles.teamInitials}>{getTeamInitials()}</Text>
                    </View>

                    {/* Team Name */}
                    <Text style={styles.teamName} numberOfLines={1}>
                        {displayTitle}
                    </Text>
                </Pressable>

                {/* Right: User Avatar (Square) */}
                <Pressable
                    style={styles.userAvatarContainer}
                    onPress={() => setUserMenuVisible(true)}
                >
                    {session?.user?.image ? (
                        <Image
                            source={{ uri: session.user.image }}
                            style={styles.userAvatar}
                        />
                    ) : (
                        <View style={[styles.userAvatar, styles.userAvatarFallback]}>
                            <Text style={styles.userInitials}>{getUserInitials()}</Text>
                        </View>
                    )}
                    {/* Online indicator */}
                    <View style={styles.onlineIndicator} />
                </Pressable>
            </View>

            {/* User Menu Modal */}
            <Portal>
                <Modal
                    visible={userMenuVisible}
                    onDismiss={() => setUserMenuVisible(false)}
                    contentContainerStyle={[
                        styles.modalContainer,
                        { backgroundColor: theme.colors.surface }
                    ]}
                >
                    {/* User Info */}
                    <View style={styles.userInfo}>
                        {session?.user?.image ? (
                            <Image
                                source={{ uri: session.user.image }}
                                style={styles.modalAvatar}
                            />
                        ) : (
                            <View style={[styles.modalAvatar, styles.userAvatarFallback]}>
                                <Text style={styles.modalInitials}>{getUserInitials()}</Text>
                            </View>
                        )}
                        <View style={styles.userDetails}>
                            <Text variant="titleMedium" style={styles.userName}>
                                {session?.user?.name || 'User'}
                            </Text>
                            <Text variant="bodySmall" style={styles.userEmail}>
                                {session?.user?.email}
                            </Text>
                        </View>
                    </View>

                    <Divider style={styles.divider} />

                    {/* Menu Options */}
                    <Pressable style={styles.menuItem}>
                        <Text>👤 View Profile</Text>
                    </Pressable>

                    <Pressable style={styles.menuItem}>
                        <Text>⚙️ Settings</Text>
                    </Pressable>

                    <Divider style={styles.divider} />

                    {/* Logout */}
                    <Button
                        mode="outlined"
                        onPress={handleLogout}
                        loading={isLoggingOut}
                        disabled={isLoggingOut}
                        icon="logout"
                        textColor={theme.colors.error}
                        style={styles.logoutButton}
                    >
                        Log Out
                    </Button>
                </Modal>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 10,
        paddingTop: 48, // Safe area
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 10,
    },
    teamAvatar: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    teamInitials: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    teamName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
    },
    userAvatarContainer: {
        position: 'relative',
    },
    userAvatar: {
        width: 36,
        height: 36,
        borderRadius: 6, // Square with small radius
    },
    userAvatarFallback: {
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInitials: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#fff',
    },
    modalContainer: {
        margin: 20,
        borderRadius: 16,
        padding: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    modalAvatar: {
        width: 56,
        height: 56,
        borderRadius: 8,
    },
    modalInitials: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontWeight: '600',
    },
    userEmail: {
        opacity: 0.7,
    },
    divider: {
        marginVertical: 12,
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    logoutButton: {
        marginTop: 8,
        borderColor: '#EF4444',
    },
});
