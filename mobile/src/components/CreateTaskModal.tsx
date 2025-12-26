import React, { useState } from 'react';
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
import { useCreateTask, CreateTaskInput } from '../hooks/use-create-task';
import { useTeamMembers } from '../hooks/use-team-members';
import { TaskPriority } from '../types/api';

// Validation schema
const taskSchema = z.object({
    title: z.string().min(3, 'Tiêu đề phải có ít nhất 3 ký tự'),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high'] as const),
    assigneeId: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface CreateTaskModalProps {
    visible: boolean;
    teamId: string;
    onClose: () => void;
}

export function CreateTaskModal({ visible, teamId, onClose }: CreateTaskModalProps) {
    const theme = useTheme();
    const createTaskMutation = useCreateTask();
    const { data: members, isLoading: membersLoading } = useTeamMembers(teamId);
    const [showAssigneeList, setShowAssigneeList] = useState(false);

    const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
            assigneeId: undefined,
        },
    });

    const selectedAssigneeId = watch('assigneeId');
    const selectedAssignee = members?.find(m => m.id === selectedAssigneeId);

    const onSubmit = async (data: TaskFormData) => {
        try {
            await createTaskMutation.mutateAsync({
                teamId,
                data: {
                    title: data.title,
                    description: data.description,
                    priority: data.priority as TaskPriority,
                    assigneeId: data.assigneeId,
                },
            });
            reset();
            onClose();
        } catch (error) {
            // Error handled by mutation
        }
    };

    const handleClose = () => {
        reset();
        setShowAssigneeList(false);
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
                            ➕ Tạo Task Mới
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
                                    value={value}
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
                                disabled={createTaskMutation.isPending}
                            >
                                Hủy
                            </Button>
                            <Button
                                mode="contained"
                                onPress={handleSubmit(onSubmit)}
                                loading={createTaskMutation.isPending}
                                disabled={createTaskMutation.isPending}
                            >
                                Tạo Task
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
});
