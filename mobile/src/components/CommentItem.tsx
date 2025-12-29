import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Comment } from '../hooks/use-comments';

interface CommentItemProps {
    comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
    const theme = useTheme();

    // Format relative time

    // ...

    // Format relative time
    const formatTimeAgo = (dateStr: string) => {
        try {
            let date = new Date(dateStr);
            const now = new Date();

            // If date is in the future, it's likely a timezone issue (Local time treated as UTC)
            if (date > now) {
                // Try treating it as local time by stripping 'Z' if present
                if (dateStr.endsWith('Z')) {
                    const localDateStr = dateStr.slice(0, -1);
                    const localDate = new Date(localDateStr);
                    if (localDate <= now) {
                        date = localDate;
                    }
                }

                // If still future, clamp to now
                if (date > now) {
                    return 'Vừa xong';
                }
            }

            return formatDistanceToNow(date, { addSuffix: true, locale: vi });
        } catch (e) {
            return 'Vừa xong';
        }
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
