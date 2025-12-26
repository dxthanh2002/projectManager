import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { useComments } from '../hooks/use-comments';
import { CommentItem } from './CommentItem';

interface CommentsFeedProps {
    taskId: string;
}

export function CommentsFeed({ taskId }: CommentsFeedProps) {
    const theme = useTheme();
    const { data: comments, isLoading, error } = useComments(taskId);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating size="small" />
                <Text variant="bodySmall" style={styles.loadingText}>
                    Đang tải bình luận...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text variant="bodyMedium" style={{ color: theme.colors.error }}>
                    Không thể tải bình luận
                </Text>
            </View>
        );
    }

    if (!comments || comments.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text variant="bodyMedium" style={styles.emptyText}>
                    💬 Chưa có bình luận nào
                </Text>
                <Text variant="bodySmall" style={styles.emptySubtext}>
                    Hãy là người đầu tiên bình luận!
                </Text>
            </View>
        );
    }

    // Use View with map instead of FlatList to avoid nesting VirtualizedList
    return (
        <View style={styles.listContent}>
            {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
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
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
        gap: 4,
    },
    emptyText: {
        opacity: 0.8,
    },
    emptySubtext: {
        opacity: 0.6,
    },
    listContent: {
        paddingVertical: 8,
    },
});
