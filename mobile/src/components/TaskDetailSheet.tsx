import React, { useCallback, useMemo, useState, forwardRef, useEffect } from 'react';
import { View, StyleSheet, Platform, Keyboard } from 'react-native';
import { Text, Button, Chip, Divider, useTheme, IconButton, TextInput, SegmentedButtons, Portal } from 'react-native-paper';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Task, TaskStatus, TaskPriority } from '../types/api';
import { StatusColors, StatusLabels } from '../constants/theme';
import { StatusActionSheet } from './StatusActionSheet';
import { BlockerCommentModal } from './BlockerCommentModal';
import { CommentsFeed } from './CommentsFeed';
import { CommentInput } from './CommentInput';
import { useUpdateTaskStatus } from '../hooks/use-update-task';
import { useUpdateTask } from '../hooks/use-update-task-details';
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

        // Edit States
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [priority, setPriority] = useState<TaskPriority>('medium');
        const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
        const [showDatePicker, setShowDatePicker] = useState(false);

        const updateStatusMutation = useUpdateTaskStatus();
        const updateDetailsMutation = useUpdateTask();
        const addCommentMutation = useAddComment();

        // Initialize state when task opens
        useEffect(() => {
            if (task) {
                setTitle(task.title);
                setDescription(task.description || '');
                setPriority(task.priority);
                setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
            }
        }, [task]);

        const snapPoints = useMemo(() => ['60%', '90%'], []); // Adjusted snap points

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
                setPendingStatus(newStatus);
                setStatusSheetVisible(false);
                setBlockerModalVisible(true);
            } else {
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
            await addCommentMutation.mutateAsync({
                taskId: task.id,
                content: comment,
                teamId: currentTeamId,
            });
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

        const handleSaveDetails = async () => {
            if (task && currentTeamId) {
                // Determine if anything changed
                const hasChanges =
                    title !== task.title ||
                    description !== (task.description || '') ||
                    priority !== task.priority ||
                    dueDate?.toISOString() !== (task.dueDate ? new Date(task.dueDate).toISOString() : undefined);

                if (hasChanges) {
                    await updateDetailsMutation.mutateAsync({
                        taskId: task.id,
                        teamId: currentTeamId,
                        data: {
                            title,
                            description,
                            priority,
                            dueDate: dueDate?.toISOString(),
                        }
                    });
                }
                Keyboard.dismiss();
            }
        };

        if (!task) return null;

        const statusColor = StatusColors[task.status];
        const statusLabel = StatusLabels[task.status];

        return (
            <Portal>
                <BottomSheet
                    ref={ref}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    backdropComponent={renderBackdrop}
                    onClose={onClose}
                    backgroundStyle={{ backgroundColor: theme.colors.surface }}
                    handleIndicatorStyle={{ backgroundColor: theme.colors.outline }}
                    enableOverDrag={false}
                >
                    <BottomSheetView style={styles.container}>
                        {/* Header with Title Input and Close */}
                        <View style={styles.header}>
                            <BottomSheetTextInput
                                value={title}
                                onChangeText={setTitle}
                                style={[styles.titleInput, { color: theme.colors.onSurface }]}
                                placeholder="Tiêu đề task"
                                placeholderTextColor={theme.colors.onSurfaceDisabled}
                                multiline
                                onEndEditing={handleSaveDetails}
                            />
                            <IconButton
                                icon="close"
                                onPress={onClose}
                                size={20}
                                style={{ marginTop: -4 }}
                            />
                        </View>

                        {/* Status Chip (ActionSheet Trigger) */}
                        <View style={styles.statusRow}>
                            <Chip
                                mode="flat"
                                style={[styles.statusChip, { backgroundColor: statusColor }]}
                                textStyle={styles.statusText}
                                onPress={() => setStatusSheetVisible(true)}
                                icon="refresh"
                            >
                                {statusLabel}
                            </Chip>
                        </View>

                        <Divider style={styles.divider} />

                        <BottomSheetScrollView
                            style={styles.scrollContent}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Priority Segmented Button */}
                            <Text variant="labelLarge" style={styles.sectionLabel}>Độ ưu tiên</Text>
                            <SegmentedButtons
                                value={priority}
                                onValueChange={(val) => {
                                    setPriority(val as TaskPriority);
                                    // Auto save for priority
                                    if (task && currentTeamId) {
                                        updateDetailsMutation.mutate({
                                            taskId: task.id,
                                            teamId: currentTeamId,
                                            data: { priority: val as TaskPriority }
                                        });
                                    }
                                }}
                                buttons={[
                                    { value: 'low', label: 'Thấp' },
                                    { value: 'medium', label: 'TB' },
                                    { value: 'high', label: 'Cao' },
                                ]}
                                density="small"
                                style={styles.segmented}
                            />

                            {/* Due Date */}
                            <Text variant="labelLarge" style={styles.sectionLabel}>Hạn chót</Text>
                            <Button
                                mode="outlined"
                                onPress={() => setShowDatePicker(true)}
                                style={styles.dateButton}
                                icon="calendar"
                                contentStyle={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}
                                labelStyle={{ width: '100%' }}
                            >
                                {dueDate ? format(dueDate, 'dd/MM/yyyy') : 'Chọn ngày (Không bắt buộc)'}
                            </Button>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={dueDate || new Date()}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => {
                                        setShowDatePicker(Platform.OS === 'ios');
                                        if (date) {
                                            const newDate = date;
                                            setDueDate(newDate);
                                            // Auto save date
                                            if (task && currentTeamId) {
                                                updateDetailsMutation.mutate({
                                                    taskId: task.id,
                                                    teamId: currentTeamId,
                                                    data: { dueDate: newDate.toISOString() }
                                                });
                                            }
                                        }
                                        if (Platform.OS === 'android') {
                                            setShowDatePicker(false);
                                        }
                                    }}
                                    minimumDate={new Date()}
                                />
                            )}

                            {/* Description Input */}
                            <Text variant="labelLarge" style={styles.sectionLabel}>Mô tả</Text>
                            <BottomSheetTextInput
                                value={description}
                                onChangeText={setDescription}
                                style={[
                                    styles.descriptionInput,
                                    {
                                        color: theme.colors.onSurface,
                                        backgroundColor: theme.colors.surfaceVariant,
                                    }
                                ]}
                                placeholder="Thêm mô tả chi tiết..."
                                placeholderTextColor={theme.colors.onSurfaceDisabled}
                                multiline
                                textAlignVertical="top"
                                onEndEditing={handleSaveDetails}
                            />
                            {/* Save Button for Description/Title explicit save */}
                            {(title !== task.title || description !== (task.description || '')) && (
                                <Button
                                    mode="contained"
                                    onPress={handleSaveDetails}
                                    style={styles.saveButton}
                                    loading={updateDetailsMutation.isPending}
                                >
                                    Lưu thay đổi
                                </Button>
                            )}

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

                <StatusActionSheet
                    visible={statusSheetVisible}
                    currentStatus={task.status}
                    onSelect={handleStatusSelect}
                    onDismiss={() => setStatusSheetVisible(false)}
                />

                <BlockerCommentModal
                    visible={blockerModalVisible}
                    onSubmit={handleBlockerSubmit}
                    onCancel={handleBlockerCancel}
                />

            </Portal>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    titleInput: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 8,
        padding: 0,
    },
    statusRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    statusChip: {
        height: 32,
    },
    statusText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    divider: {
        marginVertical: 12,
    },
    scrollContent: {
        flex: 1,
    },
    sectionLabel: {
        marginBottom: 8,
        opacity: 0.7,
        fontSize: 12,
        textTransform: 'uppercase',
    },
    segmented: {
        marginBottom: 16,
    },
    dateButton: {
        marginBottom: 16,
    },
    descriptionInput: {
        minHeight: 100,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 15,
    },
    saveButton: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontWeight: '600',
        marginBottom: 8,
    },
});
