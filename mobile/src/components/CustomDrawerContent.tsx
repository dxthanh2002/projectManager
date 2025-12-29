import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import {
    Text,
    Avatar,
    Divider,
    ActivityIndicator,
    Button,
    useTheme,
    IconButton,
    List,
    Modal,
    Portal,
    TextInput
} from 'react-native-paper';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useTeams } from '../hooks/use-teams';
import { useAppStore } from '../stores/use-app-store';
import { useSession, signOut } from '../lib/auth-client';
import { useInviteMember, useLeaveTeam } from '../hooks/use-member-actions';
import { Team } from '../types/api';
import Toast from 'react-native-toast-message';

export function CustomDrawerContent(props: DrawerContentComponentProps) {
    const theme = useTheme();
    const router = useRouter();
    const { data: session } = useSession();
    const { data: teams, isLoading, error, refetch } = useTeams();
    const { currentTeamId, setCurrentTeamId, reset } = useAppStore();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Workspace action menu state
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [actionMenuVisible, setActionMenuVisible] = useState(false);
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');

    const inviteMutation = useInviteMember();
    const leaveTeamMutation = useLeaveTeam();

    const handleTeamPress = (team: Team) => {
        setCurrentTeamId(team.id);
        props.navigation.closeDrawer();
    };

    const handleMorePress = (team: Team) => {
        setSelectedTeam(team);
        setActionMenuVisible(true);
    };

    const handleInviteMember = () => {
        setActionMenuVisible(false);
        setInviteModalVisible(true);
    };

    const handleLeaveTeam = () => {
        setActionMenuVisible(false);
        if (!selectedTeam) return;

        const isManager = selectedTeam.role === 'manager';
        const title = isManager ? 'Delete Workspace?' : 'Leave Workspace';
        const message = isManager
            ? `You are a manager. Leaving "${selectedTeam.name}" will DELETE the workspace and all data. This cannot be undone.`
            : `Are you sure you want to leave "${selectedTeam.name}"?`;
        const actionText = isManager ? 'Delete Workspace' : 'Leave';

        Alert.alert(
            title,
            message,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: actionText,
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await leaveTeamMutation.mutateAsync(selectedTeam.id);

                            // If leaving current team, reset/redirect
                            if (selectedTeam.id === currentTeamId) {
                                // Find another team to switch to
                                const otherTeams = teams?.filter(t => t.id !== selectedTeam.id) || [];
                                if (otherTeams.length > 0) {
                                    setCurrentTeamId(otherTeams[0].id);
                                } else {
                                    // No teams left, reset to null state
                                    setCurrentTeamId(null);
                                }
                            }
                        } catch (error) {
                            // Error handled by mutation hook
                            console.error('Failed to leave team:', error);
                        }
                    }
                }
            ]
        );
    };

    const handleSendInvite = async () => {
        if (!inviteEmail.trim() || !selectedTeam) return;

        try {
            await inviteMutation.mutateAsync({
                teamId: selectedTeam.id,
                email: inviteEmail.trim()
            });
            setInviteModalVisible(false);
            setInviteEmail('');
        } catch (error) {
            // Error handled by mutation
        }
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

    const getUserInitials = () => {
        const name = session?.user?.name || session?.user?.email || 'U';
        return name.charAt(0).toUpperCase();
    };

    const getTeamInitials = (team: Team) => {
        const words = team.name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toLowerCase();
        }
        return team.name.substring(0, 2).toLowerCase();
    };

    const renderTeamItem = (team: Team) => {
        const isSelected = team.id === currentTeamId;

        return (
            <Pressable
                key={team.id}
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
                    onPress={() => handleMorePress(team)}
                    style={styles.moreButton}
                />
            </Pressable>
        );
    };

    return (
        <>
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
                    <View>
                        {teams.map(renderTeamItem)}
                    </View>
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

            {/* Workspace Action Menu */}
            <Portal>
                <Modal
                    visible={actionMenuVisible}
                    onDismiss={() => setActionMenuVisible(false)}
                    contentContainerStyle={[
                        styles.actionMenuContainer,
                        { backgroundColor: theme.colors.surface }
                    ]}
                >
                    {/* Selected Team Header */}
                    <View style={styles.actionMenuHeader}>
                        <View style={styles.teamAvatar}>
                            <Text style={styles.teamInitials}>
                                {selectedTeam ? getTeamInitials(selectedTeam) : ''}
                            </Text>
                        </View>
                        <Text variant="titleMedium" style={styles.actionMenuTitle}>
                            {selectedTeam?.name}
                        </Text>
                    </View>

                    <Divider style={styles.divider} />

                    {/* Invite Members */}
                    <List.Item
                        title="Invite members"
                        left={() => <List.Icon icon="account-plus-outline" />}
                        onPress={handleInviteMember}
                        style={styles.actionMenuItem}
                    />

                    {/* Sign Out (Leave) */}
                    <List.Item
                        title="Sign out"
                        titleStyle={{ color: theme.colors.error }}
                        left={() => <List.Icon icon="logout" color={theme.colors.error} />}
                        onPress={handleLeaveTeam}
                        style={styles.actionMenuItem}
                    />
                </Modal>

                {/* Invite Modal */}
                <Modal
                    visible={inviteModalVisible}
                    onDismiss={() => setInviteModalVisible(false)}
                    contentContainerStyle={[
                        styles.inviteModalContainer,
                        { backgroundColor: theme.colors.surface }
                    ]}
                >
                    <Text variant="headlineSmall" style={styles.modalTitle}>
                        Add by Email
                    </Text>

                    <TextInput
                        label="Email"
                        value={inviteEmail}
                        onChangeText={setInviteEmail}
                        mode="outlined"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.emailInput}
                    />

                    <View style={styles.modalButtons}>
                        <Button
                            mode="text"
                            onPress={() => setInviteModalVisible(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleSendInvite}
                            loading={inviteMutation.isPending}
                            disabled={!inviteEmail.trim() || inviteMutation.isPending}
                        >
                            Send Invite
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </>
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
    // Action Menu Styles
    actionMenuContainer: {
        margin: 24,
        borderRadius: 16,
        paddingBottom: 8,
        elevation: 4,
    },
    actionMenuHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    actionMenuTitle: {
        fontWeight: '600',
    },
    actionMenuItem: {
        paddingHorizontal: 8,
    },
    // Invite Modal Styles
    inviteModalContainer: {
        margin: 20,
        borderRadius: 16,
        padding: 20,
    },
    modalTitle: {
        fontWeight: '600',
        marginBottom: 16,
    },
    emailInput: {
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
});
