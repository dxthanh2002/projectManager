import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, List, useTheme } from 'react-native-paper';
import { TaskStatus } from '../types/api';
import { StatusColors, StatusLabels } from '../constants/theme';

interface StatusActionSheetProps {
    visible: boolean;
    currentStatus: TaskStatus;
    onSelect: (status: TaskStatus) => void;
    onDismiss: () => void;
}

const statusOptions: TaskStatus[] = ['todo', 'in_progress', 'done', 'blocked'];

export function StatusActionSheet({
    visible,
    currentStatus,
    onSelect,
    onDismiss,
}: StatusActionSheetProps) {
    const theme = useTheme();

    const handleSelect = (status: TaskStatus) => {
        onSelect(status);
        // Don't dismiss here - caller handles it (may need to show blocker modal)
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={[
                    styles.container,
                    { backgroundColor: theme.colors.surface }
                ]}
            >
                <Text variant="titleMedium" style={styles.title}>
                    Update Status
                </Text>

                <View style={styles.optionsList}>
                    {statusOptions.map((status) => {
                        const isSelected = status === currentStatus;
                        const color = StatusColors[status];
                        const label = StatusLabels[status];

                        return (
                            <List.Item
                                key={status}
                                title={label}
                                onPress={() => handleSelect(status)}
                                left={() => (
                                    <View style={[styles.statusDot, { backgroundColor: color }]} />
                                )}
                                right={() => isSelected ? (
                                    <List.Icon icon="check" color={theme.colors.primary} />
                                ) : null}
                                style={[
                                    styles.option,
                                    isSelected && { backgroundColor: `${color}10` }
                                ]}
                            />
                        );
                    })}
                </View>

                <Button
                    mode="text"
                    onPress={onDismiss}
                    style={styles.cancelButton}
                >
                    Cancel
                </Button>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
        borderRadius: 16,
        padding: 16,
    },
    title: {
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: '600',
    },
    optionsList: {
        gap: 4,
    },
    option: {
        borderRadius: 8,
        marginVertical: 2,
    },
    statusDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginLeft: 8,
        alignSelf: 'center',
    },
    cancelButton: {
        marginTop: 12,
    },
});
