import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { api } from '@/lib/api';
import { useAppStore } from '@/stores/use-app-store';

export default function CreateWorkspaceScreen() {
  const theme = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setCurrentTeamId } = useAppStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      return api.teams.create(data);
    },
    onSuccess: (team) => {
      Toast.show({
        type: 'success',
        text1: 'Workspace đã được tạo! 🎉',
        text2: team.name,
        visibilityTime: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setCurrentTeamId(team.id);
      router.back();
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Không thể tạo workspace',
        text2: error instanceof Error ? error.message : 'Vui lòng thử lại',
        visibilityTime: 3000,
      });
    },
  });

  const handleCreate = () => {
    if (!name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Vui lòng nhập tên workspace',
        visibilityTime: 2000,
      });
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
    });
  };

  const isValid = name.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Illustration */}
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
          <MaterialCommunityIcons
            name="briefcase-plus"
            size={56}
            color={theme.colors.primary}
          />
        </View>

        <Text variant="headlineMedium" style={styles.title}>
          Tạo Workspace mới
        </Text>

        <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Workspace giúp bạn tổ chức công việc theo nhóm hoặc dự án.
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            mode="outlined"
            label="Tên Workspace *"
            placeholder="Ví dụ: Team Marketing, Dự án X..."
            value={name}
            onChangeText={setName}
            style={styles.input}
            maxLength={50}
            autoFocus
          />

          <TextInput
            mode="outlined"
            label="Mô tả (tùy chọn)"
            placeholder="Mô tả ngắn về workspace..."
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            multiline
            numberOfLines={3}
            maxLength={200}
          />

          <Text variant="bodySmall" style={[styles.hint, { color: theme.colors.onSurfaceVariant }]}>
            * Bạn sẽ là Manager của workspace này và có thể mời thêm thành viên sau.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleCreate}
            loading={createMutation.isPending}
            disabled={!isValid || createMutation.isPending}
            style={styles.createButton}
            contentStyle={styles.createButtonContent}
            icon="check"
          >
            Tạo Workspace
          </Button>

          <Button
            mode="text"
            onPress={() => router.back()}
            disabled={createMutation.isPending}
            style={styles.cancelButton}
          >
            Hủy
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  form: {
    width: '100%',
    gap: 16,
  },
  input: {
    width: '100%',
  },
  hint: {
    marginTop: 8,
    lineHeight: 18,
  },
  actions: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  createButton: {
    borderRadius: 12,
  },
  createButtonContent: {
    paddingVertical: 8,
  },
  cancelButton: {
    borderRadius: 12,
  },
});
