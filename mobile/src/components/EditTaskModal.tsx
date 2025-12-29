import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import {
    Modal,
    Portal,
    Text,
    TextInput,
    Button,
    SegmentedButtons,
    List,
    RadioButton,
    useTheme,
    Divider,
    ActivityIndicator
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateTask } from '../hooks/use-update-task-details';
import { useTeamMembers } from '../hooks/use-team-members';
import { TaskPriority, Task } from '../types/api';

// Validation schema (same as create)
const taskSchema = z.object({
    title: z.string().min(3, 'Tiêu đề phải có ít nhất 3 ký tự'),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high'] as const),
    assigneeId: z.string().optional(),
    dueDate: z.date().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface EditTaskModalProps {
    visible: boolean;
    task: Task;
    teamId: string;
    onClose: () => void;
}

export function EditTaskModal({ visible, task, teamId, onClose }: EditTaskModalProps) {
    const theme = useTheme();
    const updateTaskMutation = useUpdateTask();
    const { data: members, isLoading: membersLoading } = useTeamMembers(teamId);
    const [showAssigneeList, setShowAssigneeList] = useState(false);

    // Date Picker State
    const [showDatePicker, setShowDatePicker] = useState(false);

    const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: task.title,
            description: task.description || '',
            priority: task.priority,
            assigneeId: task.assigneeId || undefined,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        },
    });

    // Reset form when task changes
    useEffect(() => {
        if (visible && task) {
            reset({
                title: task.title,
                description: task.description || '',
                priority: task.priority,
                assigneeId: task.assigneeId || undefined,
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            });
        }
    }, [visible, task, reset]);

    const selectedAssigneeId = watch('assigneeId');
    const selectedAssignee = members?.find(m => m.id === selectedAssigneeId);
    const selectedDueDate = watch('dueDate');

    const onSubmit = async (data: TaskFormData) => {
        try {
            await updateTaskMutation.mutateAsync({
                taskId: task.id,
                teamId,
                data: {
                    title: data.title,
                    description: data.description,
                    priority: data.priority as TaskPriority,
                    assigneeId: data.assigneeId,
                    dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
                },
            });
            onClose();
        } catch (error) {
            // Error handled by mutation
        }
    };

    const handleClose = () => {
        setShowAssigneeList(false);
        setShowDatePicker(false);
        onClose();
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={handleClose}
                contentContainerStyle={[
                    styles.container,
                    { backgroundColor: theme.colors.surface }
                ]}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Header */}
                        <Text variant="headlineSmall" style={styles.title}>
                            ✏️ Chỉnh Sửa Task
                        </Text>

                        {/* Title Input */}
                        <Controller
                            control={control}
                            name="title"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Tiêu đề *"
                                    placeholder="Nhập tiêu đề task..."
                                    value={value}
                                    onChangeText={onChange}
                                    error={!!errors.title}
                                    style={styles.input}
                                />
                            )}
                        />
                        {errors.title && (
                            <Text style={[styles.errorText, { color: theme.colors.error }]}>
                                {errors.title.message}
                            </Text>
                        )}

                        {/* Description Input */}
                        <Controller
                            control={control}
                            name="description"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Mô tả"
                                    placeholder="Mô tả chi tiết..."
                                    value={value || ''}
                                    onChangeText={onChange}
                                    multiline
                                    numberOfLines={3}
                                    style={styles.input}
                                />
                            )}
                        />

                        {/* Priority Selector */}
                        <Text variant="labelLarge" style={styles.sectionLabel}>
                            Độ ưu tiên
                        </Text>
                        <Controller
                            control={control}
                            name="priority"
                            render={({ field: { onChange, value } }) => (
                                <SegmentedButtons
                                    value={value}
                                    onValueChange={onChange}
                                    buttons={[
                                        { value: 'low', label: 'Thấp' },
                                        { value: 'medium', label: 'Trung bình' },
                                        { value: 'high', label: 'Cao' },
                                    ]}
                                    style={styles.segmented}
                                />
                            )}
                        />

                        {/* Due Date */}
                        <Text variant="labelLarge" style={styles.sectionLabel}>
                            Hạn chót
                        </Text>
                        <Button
                            mode="outlined"
                            onPress={() => setShowDatePicker(true)}
                            style={styles.dateButton}
                            icon="calendar"
                            contentStyle={{ flexDirection: 'row-reverse' }}
                        >
                            {selectedDueDate ? format(selectedDueDate, 'dd/MM/yyyy') : 'Chọn ngày'}
                        </Button>
                        {showDatePicker && (
                            <DateTimePicker
                                value={selectedDueDate || new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, date) => {
                                    setShowDatePicker(Platform.OS === 'ios');
                                    if (date) {
                                        setValue('dueDate', date);
                                    }
                                    if (Platform.OS === 'android') {
                                        setShowDatePicker(false);
                                    }
                                }}
                                minimumDate={new Date()}
                            />
                        )}

                        {/* Assignee Selector */}
                        <Text variant="labelLarge" style={styles.sectionLabel}>
                            Giao cho
                        </Text>

                        <Button
                            mode="outlined"
                            onPress={() => setShowAssigneeList(!showAssigneeList)}
                            style={styles.assigneeButton}
                            icon={showAssigneeList ? 'chevron-up' : 'chevron-down'}
                            contentStyle={{ flexDirection: 'row-reverse' }}
                        >
                            {selectedAssignee
                                ? selectedAssignee.name || selectedAssignee.email
                                : 'Chọn người thực hiện (tùy chọn)'
                            }
                        </Button>

                        {showAssigneeList && (
                            <View style={styles.assigneeList}>
                                {membersLoading ? (
                                    <ActivityIndicator animating size="small" />
                                ) : (
                                    <>
                                        <List.Item
                                            title="Không giao"
                                            onPress={() => {
                                                setValue('assigneeId', undefined);
                                                setShowAssigneeList(false);
                                            }}
                                            left={() => (
                                                <RadioButton
                                                    value=""
                                                    status={!selectedAssigneeId ? 'checked' : 'unchecked'}
                                                    onPress={() => setValue('assigneeId', undefined)}
                                                />
                                            )}
                                        />
                                        <Divider />
                                        {members?.map((member) => (
                                            <List.Item
                                                key={member.id}
                                                title={member.name || member.email}
                                                description={member.role === 'manager' ? 'Manager' : 'Member'}
                                                onPress={() => {
                                                    setValue('assigneeId', member.id);
                                                    setShowAssigneeList(false);
                                                }}
                                                left={() => (
                                                    <RadioButton
                                                        value={member.id}
                                                        status={selectedAssigneeId === member.id ? 'checked' : 'unchecked'}
                                                        onPress={() => setValue('assigneeId', member.id)}
                                                    />
                                                )}
                                            />
                                        ))}
                                    </>
                                )}
                            </View>
                        )}

                        {/* Action Buttons */}
                        <View style={styles.buttons}>
                            <Button
                                mode="text"
                                onPress={handleClose}
                                disabled={updateTaskMutation.isPending}
                            >
                                Hủy
                            </Button>
                            <Button
                                mode="contained"
                                onPress={handleSubmit(onSubmit)}
                                loading={updateTaskMutation.isPending}
                                disabled={updateTaskMutation.isPending}
                            >
                                Lưu Thay Đổi
                            </Button>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
        borderRadius: 16,
        padding: 20,
        maxHeight: '80%',
    },
    title: {
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: '600',
    },
    input: {
        marginBottom: 8,
    },
    errorText: {
        fontSize: 12,
        marginBottom: 8,
        marginLeft: 8,
    },
    sectionLabel: {
        marginTop: 12,
        marginBottom: 8,
    },
    segmented: {
        marginBottom: 8,
    },
    assigneeButton: {
        marginBottom: 8,
    },
    assigneeList: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        borderRadius: 8,
        marginBottom: 16,
        maxHeight: 200,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 16,
    },
    dateButton: {
        marginBottom: 8,
    },
});
