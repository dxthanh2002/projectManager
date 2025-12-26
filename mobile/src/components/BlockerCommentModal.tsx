import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Modal, Portal, Text, Button, TextInput, useTheme } from 'react-native-paper';

interface BlockerCommentModalProps {
    visible: boolean;
    onSubmit: (comment: string) => void;
    onCancel: () => void;
}

const MIN_COMMENT_LENGTH = 10;

export function BlockerCommentModal({
    visible,
    onSubmit,
    onCancel,
}: BlockerCommentModalProps) {
    const theme = useTheme();
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isValid = comment.trim().length >= MIN_COMMENT_LENGTH;
    const remainingChars = MIN_COMMENT_LENGTH - comment.trim().length;

    const handleSubmit = async () => {
        if (!isValid) return;

        setIsSubmitting(true);
        try {
            await onSubmit(comment.trim());
            setComment('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setComment('');
        onCancel();
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={handleCancel}
                contentContainerStyle={[
                    styles.container,
                    { backgroundColor: theme.colors.surface }
                ]}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.header}>
                        <Text variant="headlineSmall" style={styles.emoji}>
                            🆘
                        </Text>
                        <Text variant="titleMedium" style={styles.title}>
                            Request Help
                        </Text>
                        <Text variant="bodyMedium" style={styles.subtitle}>
                            What do you need help with?
                        </Text>
                    </View>

                    <TextInput
                        mode="outlined"
                        placeholder="Describe what's blocking you..."
                        value={comment}
                        onChangeText={setComment}
                        multiline
                        numberOfLines={4}
                        style={styles.input}
                        autoFocus
                    />

                    {!isValid && comment.length > 0 && (
                        <Text variant="labelSmall" style={styles.hint}>
                            {remainingChars} more characters needed
                        </Text>
                    )}

                    <View style={styles.buttons}>
                        <Button
                            mode="text"
                            onPress={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            disabled={!isValid || isSubmitting}
                            loading={isSubmitting}
                        >
                            Send Help Request
                        </Button>
                    </View>
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
    },
    header: {
        alignItems: 'center',
        marginBottom: 16,
    },
    emoji: {
        fontSize: 32,
        marginBottom: 8,
    },
    title: {
        fontWeight: '600',
        textAlign: 'center',
    },
    subtitle: {
        opacity: 0.7,
        textAlign: 'center',
        marginTop: 4,
    },
    input: {
        marginBottom: 8,
    },
    hint: {
        opacity: 0.6,
        textAlign: 'right',
        marginBottom: 8,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 8,
    },
});
