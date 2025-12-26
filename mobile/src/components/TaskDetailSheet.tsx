import React, { useCallback, useMemo, useState, forwardRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Chip, Divider, useTheme, IconButton } from 'react-native-paper';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Task, TaskStatus } from '../types/api';
import { StatusColors, StatusLabels, PriorityColors } from '../constants/theme';
import { StatusActionSheet } from './StatusActionSheet';
import { BlockerCommentModal } from './BlockerCommentModal';
import { CommentsFeed } from './CommentsFeed';
import { CommentInput } from './CommentInput';
import { useUpdateTaskStatus } from '../hooks/use-update-task';
import { useAddComment } from '../hooks/use-add-comment';
import { useAppStore } from '../stores/use-app-store';

interface TaskDetailSheetProps {
    task: Task | null;
    onClose: () => void;
}

export const TaskDetailSheet = forwardRef<BottomSheet, TaskDetailSheetProps>(
    ({ task, onClose }, ref) => {
        const theme = useTheme();
        const { currentTeamId } = useAppStore();
        const [statusSheetVisible, setStatusSheetVisible] = useState(false);
        const [blockerModalVisible, setBlockerModalVisible] = useState(false);
        const [pendingStatus, setPendingStatus] = useState<TaskStatus | null>(null);

        const updateStatusMutation = useUpdateTaskStatus();
        const addCommentMutation = useAddComment();

        const snapPoints = useMemo(() => ['50%', '90%'], []);

        const renderBackdrop = useCallback(
            (props: any) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    opacity={0.5}
                />
            ),
            []
        );

        const handleStatusSelect = (newStatus: TaskStatus) => {
            if (newStatus === 'blocked') {
                // Show blocker modal first
                setPendingStatus(newStatus);
                setStatusSheetVisible(false);
                setBlockerModalVisible(true);
            } else {
                // Direct status update
                if (task && currentTeamId) {
                    updateStatusMutation.mutate({
                        taskId: task.id,
                        status: newStatus,
                        teamId: currentTeamId,
                    });
                }
                setStatusSheetVisible(false);
            }
        };

        const handleBlockerSubmit = async (comment: string) => {
            if (!task || !currentTeamId || !pendingStatus) return;

            // Add comment first
            await addCommentMutation.mutateAsync({
                taskId: task.id,
                content: comment,
                teamId: currentTeamId,
            });

            // Then update status
            updateStatusMutation.mutate({
                taskId: task.id,
                status: pendingStatus,
                teamId: currentTeamId,
            });

            setBlockerModalVisible(false);
            setPendingStatus(null);
        };

        const handleBlockerCancel = () => {
            setBlockerModalVisible(false);
            setPendingStatus(null);
        };

        const formatDate = (dateStr: string | null) => {
            if (!dateStr) return 'No due date';
            return new Date(dateStr).toLocaleDateString('vi-VN', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            });
        };

        if (!task) return null;

        const statusColor = StatusColors[task.status];
        const statusLabel = StatusLabels[task.status];
        const priorityColor = PriorityColors[task.priority];

        return (
            <>
                <BottomSheet
                    ref={ref}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    backdropComponent={renderBackdrop}
                    onClose={onClose}
                    backgroundStyle={{ backgroundColor: theme.colors.surface }}
                    handleIndicatorStyle={{ backgroundColor: theme.colors.outline }}
                >
                    <BottomSheetView style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text variant="headlineSmall" style={styles.title}>
                                {task.title}
                            </Text>
                            <IconButton
                                icon="close"
                                onPress={onClose}
                                size={20}
                            />
                        </View>

                        {/* Status & Priority Row */}
                        <View style={styles.chipsRow}>
                            <Chip
                                mode="flat"
                                style={[styles.statusChip, { backgroundColor: statusColor }]}
                                textStyle={styles.statusText}
                                onPress={() => setStatusSheetVisible(true)}
                                icon="pencil"
                            >
                                {statusLabel}
                            </Chip>
                            <Chip
                                mode="outlined"
                                style={[styles.priorityChip, { borderColor: priorityColor }]}
                                textStyle={{ color: priorityColor }}
                            >
                                {task.priority.toUpperCase()}
                            </Chip>
                        </View>

                        <Divider style={styles.divider} />

                        {/* Scrollable Content */}
                        <BottomSheetScrollView style={styles.scrollContent}>
                            {/* Description */}
                            <Text variant="titleSmall" style={styles.sectionTitle}>
                                Mô tả
                            </Text>
                            <Text variant="bodyMedium" style={styles.description}>
                                {task.description || 'Chưa có mô tả.'}
                            </Text>

                            {/* Due Date */}
                            <View style={styles.infoRow}>
                                <Text variant="labelMedium" style={styles.label}>
                                    Hạn chót:
                                </Text>
                                <Text variant="bodyMedium">
                                    {formatDate(task.dueDate)}
                                </Text>
                            </View>

                            {/* Update Status Button */}
                            <Button
                                mode="contained"
                                onPress={() => setStatusSheetVisible(true)}
                                style={styles.updateButton}
                                icon="swap-horizontal"
                                loading={updateStatusMutation.isPending}
                            >
                                Cập nhật trạng thái
                            </Button>

                            <Divider style={styles.divider} />

                            {/* Comments Section */}
                            <Text variant="titleSmall" style={styles.sectionTitle}>
                                💬 Bình luận
                            </Text>
                            <CommentsFeed taskId={task.id} />
                        </BottomSheetScrollView>

                        {/* Comment Input at Bottom */}
                        {currentTeamId && (
                            <CommentInput taskId={task.id} teamId={currentTeamId} />
                        )}
                    </BottomSheetView>
                </BottomSheet>

                {/* Status Selection Sheet */}
                <StatusActionSheet
                    visible={statusSheetVisible}
                    currentStatus={task.status}
                    onSelect={handleStatusSelect}
                    onDismiss={() => setStatusSheetVisible(false)}
                />

                {/* Blocker Comment Modal */}
                <BlockerCommentModal
                    visible={blockerModalVisible}
                    onSubmit={handleBlockerSubmit}
                    onCancel={handleBlockerCancel}
                />
            </>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        flex: 1,
        fontWeight: '600',
        marginRight: 8,
    },
    chipsRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    statusChip: {
        height: 32,
    },
    statusText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    priorityChip: {
        height: 32,
    },
    divider: {
        marginVertical: 16,
    },
    scrollContent: {
        flex: 1,
    },
    sectionTitle: {
        fontWeight: '600',
        marginBottom: 8,
    },
    description: {
        opacity: 0.8,
        lineHeight: 22,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    label: {
        opacity: 0.7,
    },
    updateButton: {
        marginTop: 16,
    },
});
