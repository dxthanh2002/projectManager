import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Text, Avatar, Chip, IconButton, useTheme } from 'react-native-paper';
import { TeamMember } from '../hooks/use-team-members';

interface MemberItemProps {
    member: TeamMember;
    isManager: boolean;
    onRemove?: (member: TeamMember) => void;
    currentUserId?: string;
}

export function MemberItem({ member, isManager, onRemove, currentUserId }: MemberItemProps) {
    const theme = useTheme();
    const isCurrentUser = member.id === currentUserId;

    // Get initials for avatar
    const getInitials = () => {
        const name = member.name || member.email || 'U';
        return name.charAt(0).toUpperCase();
    };

    const handleRemove = () => {
        Alert.alert(
            'Xóa thành viên',
            `Bạn có chắc muốn xóa ${member.name || member.email} khỏi nhóm?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: () => onRemove?.(member)
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Avatar.Text
                size={48}
                label={getInitials()}
                style={{ backgroundColor: member.role === 'manager' ? theme.colors.primary : theme.colors.secondaryContainer }}
                labelStyle={{ color: member.role === 'manager' ? '#fff' : theme.colors.onSecondaryContainer }}
            />
            <View style={styles.content}>
                <View style={styles.nameRow}>
                    <Text variant="titleMedium" style={styles.name} numberOfLines={1}>
                        {member.name || member.email}
                        {isCurrentUser && ' (Bạn)'}
                    </Text>
                    {member.role === 'manager' && (
                        <View style={[styles.roleChip, { backgroundColor: theme.colors.primaryContainer }]}>
                            <Text style={{ color: theme.colors.onPrimaryContainer, fontSize: 11, fontWeight: '600' }}>
                                Manager
                            </Text>
                        </View>
                    )}
                </View>
                <Text variant="bodySmall" style={styles.email} numberOfLines={1}>
                    {member.email}
                </Text>
            </View>

            {/* Remove button (only for managers removing non-managers, not self) */}
            {isManager && member.role !== 'manager' && !isCurrentUser && onRemove && (
                <IconButton
                    icon="close"
                    size={20}
                    onPress={handleRemove}
                    iconColor={theme.colors.error}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.08)',
    },
    content: {
        flex: 1,
        gap: 2,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    name: {
        fontWeight: '600',
        flexShrink: 1,
    },
    roleChip: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    email: {
        opacity: 0.6,
    },
});
