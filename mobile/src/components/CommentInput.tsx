import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, IconButton, useTheme } from 'react-native-paper';
import { useAddComment } from '../hooks/use-add-comment';

interface CommentInputProps {
    taskId: string;
    teamId: string;
}

export function CommentInput({ taskId, teamId }: CommentInputProps) {
    const theme = useTheme();
    const [comment, setComment] = useState('');
    const addCommentMutation = useAddComment();

    const handleSend = async () => {
        if (!comment.trim()) return;

        try {
            await addCommentMutation.mutateAsync({
                taskId,
                content: comment.trim(),
                teamId,
            });
            setComment('');
        } catch (error) {
            // Error handled by mutation
        }
    };

    const isDisabled = !comment.trim() || addCommentMutation.isPending;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            <View style={styles.container}>
                <TextInput
                    mode="outlined"
                    placeholder="Viết bình luận..."
                    value={comment}
                    onChangeText={setComment}
                    style={styles.input}
                    dense
                    multiline
                    maxLength={500}
                    disabled={addCommentMutation.isPending}
                    right={
                        <TextInput.Icon
                            icon="send"
                            onPress={handleSend}
                            disabled={isDisabled}
                            color={isDisabled ? theme.colors.outline : theme.colors.primary}
                        />
                    }
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    input: {
        maxHeight: 100,
    },
});
