import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {
    Text,
    Button,
    ActivityIndicator,
    useTheme,
    FAB,
    Modal,
    Portal,
    TextInput
} from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import { useAppStore } from '@/stores/use-app-store';
import { useSession } from '@/lib/auth-client';
import { useTeamMembers } from '@/hooks/use-team-members';
import { useInviteMember, useRemoveMember } from '@/hooks/use-member-actions';
import { MemberItem } from '@/components/MemberItem';

export default function MembersScreen() {
    const theme = useTheme();
    const { data: session } = useSession();
    const { currentTeamId } = useAppStore();
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');

    const { data: members, isLoading, refetch, isRefetching, error } = useTeamMembers(currentTeamId);
    const inviteMutation = useInviteMember();
    const removeMutation = useRemoveMember();

    // Refetch data when screen gains focus
    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    // Check if current user is manager
    const currentUserMember = members?.find(m => m.id === session?.user?.id);
    const isManager = currentUserMember?.role === 'manager';

    // Sort members: managers first, then by joinedAt
    const sortedMembers = useMemo(() => {
        if (!members) return [];
        return [...members].sort((a, b) => {
            // Managers first
            if (a.role === 'manager' && b.role !== 'manager') return -1;
            if (a.role !== 'manager' && b.role === 'manager') return 1;
            // Then by join date
            return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
        });
    }, [members]);

    const handleInvite = async () => {
        if (!currentTeamId || !inviteEmail.trim()) return;

        try {
            await inviteMutation.mutateAsync({
                teamId: currentTeamId,
                email: inviteEmail.trim(),
            });
            setInviteEmail('');
            setInviteModalVisible(false);
        } catch (error) {
            // Error handled by mutation
        }
    };

    const handleRemoveMember = (member: { id: string }) => {
        if (!currentTeamId) return;
        removeMutation.mutate({
            teamId: currentTeamId,
            memberId: member.id,
        });
    };

    // No team selected
    if (!currentTeamId) {
        return (
            <View style={styles.centerContainer}>
                <Text variant="titleMedium">Chọn workspace trước</Text>
                <Text variant="bodyMedium" style={styles.subText}>
                    Mở menu để chọn workspace
                </Text>
            </View>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator animating size="large" />
                <Text variant="bodyMedium" style={styles.subText}>
                    Đang tải thành viên...
                </Text>
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text variant="titleMedium" style={{ color: theme.colors.error }}>
                    Không thể tải danh sách
                </Text>
                <Button mode="outlined" onPress={() => refetch()}>
                    Thử lại
                </Button>
            </View>
        );
    }

    // Empty state
    if (!members || members.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text variant="displaySmall">👥</Text>
                <Text variant="titleMedium">Chưa có thành viên</Text>
                {isManager && (
                    <Button
                        mode="contained"
                        onPress={() => setInviteModalVisible(true)}
                        icon="plus"
                    >
                        Mời thành viên
                    </Button>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header with count */}
            <View style={styles.header}>
                <Text variant="titleMedium">
                    {members.length} thành viên
                </Text>
            </View>

            {/* Members List */}
            <FlatList
                data={sortedMembers}
                renderItem={({ item }) => (
                    <MemberItem
                        member={item}
                        isManager={isManager}
                        onRemove={handleRemoveMember}
                        currentUserId={session?.user?.id}
                    />
                )}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={() => refetch()}
                        colors={[theme.colors.primary]}
                    />
                }
            />

            {/* Manager FAB for invite */}
            {isManager && (
                <FAB
                    icon="account-plus"
                    style={styles.fab}
                    onPress={() => setInviteModalVisible(true)}
                />
            )}

            {/* Invite Modal */}
            <Portal>
                <Modal
                    visible={inviteModalVisible}
                    onDismiss={() => setInviteModalVisible(false)}
                    contentContainerStyle={[
                        styles.modalContainer,
                        { backgroundColor: theme.colors.surface }
                    ]}
                >
                    <Text variant="headlineSmall" style={styles.modalTitle}>
                        Add by Email
                    </Text>

                    <TextInput
                        mode="outlined"
                        label="Email"
                        placeholder="nhập email..."
                        value={inviteEmail}
                        onChangeText={setInviteEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />

                    <View style={styles.modalButtons}>
                        <Button
                            mode="text"
                            onPress={() => setInviteModalVisible(false)}
                            disabled={inviteMutation.isPending}
                        >
                            Hủy
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleInvite}
                            loading={inviteMutation.isPending}
                            disabled={!inviteEmail.trim() || inviteMutation.isPending}
                        >
                            Gửi Lời Mời
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        gap: 12,
    },
    subText: {
        opacity: 0.7,
        textAlign: 'center',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.08)',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    modalContainer: {
        margin: 20,
        borderRadius: 16,
        padding: 20,
    },
    modalTitle: {
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: '600',
    },
    input: {
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
});
