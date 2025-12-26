import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';
import { Comment } from '../hooks/use-comments';

interface CommentItemProps {
    comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
    const theme = useTheme();

    // Format relative time
    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    };

    // Get initials for avatar
    const getInitials = () => {
        const name = comment.author?.name || comment.author?.email || 'U';
        return name.charAt(0).toUpperCase();
    };

    return (
        <View style={styles.container}>
            <Avatar.Text
                size={36}
                label={getInitials()}
                style={{ backgroundColor: theme.colors.primaryContainer }}
                labelStyle={{ color: theme.colors.onPrimaryContainer }}
            />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text variant="labelMedium" style={styles.authorName}>
                        {comment.author?.name || comment.author?.email || 'Unknown'}
                    </Text>
                    <Text variant="labelSmall" style={styles.timestamp}>
                        {formatTimeAgo(comment.createdAt)}
                    </Text>
                </View>
                <Text variant="bodyMedium" style={styles.text}>
                    {comment.content}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 12,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    authorName: {
        fontWeight: '600',
    },
    timestamp: {
        opacity: 0.6,
    },
    text: {
        lineHeight: 20,
    },
});
