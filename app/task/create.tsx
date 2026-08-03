import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/contexts';
import { Loader2, Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCreateTask, useTaskByTitleExists } from '@/hooks';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { router } from 'expo-router';

const schema = yup
  .object({
    title: yup.string().required(),
    description: yup.string(),
  })
  .required();

export default function Screen() {
  const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const {
    loading: checkTaskByTitleExistsLoading,
    taskByTitleExists: checkTaskByTitleExists,
    error: checkTaskByTitleExistsError,
  } = useTaskByTitleExists();

  const { showToast } = useToast();

  const {
    loading: createTaskLoading,
    create: createTask,
    error: createTaskError,
  } = useCreateTask();

  async function handleCheckTitleExists(data: yup.InferType<typeof schema>): Promise<void> {
    const taskByTitleExists: boolean | undefined = await checkTaskByTitleExists(data.title);

    if (taskByTitleExists) {
      setAlertDialogOpen(true);
      return;
    }

    if (checkTaskByTitleExistsError !== null) {
      showToast({
        title: 'Task unsuccessfully created.',
        message:
          'There was an error while checking if allready exists a task with the supplied title on the database. Try again later.',
        duration: 5000,
      });
      return;
    }

    await handleCreate(data);
  }

  async function handleCreate(data: yup.InferType<typeof schema>): Promise<void> {
    await createTask({ title: data.title, description: data.description ?? null });

    if (createTaskError !== null) {
      showToast({
        title: 'Task unsuccessfully created.',
        message: 'There was an error while creating the task. Try again later.',
        duration: null,
      });
      return;
    }

    showToast({
      title: 'Task successfully created.',
      message: null,
      duration: null,
    });

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView className="flex-1 gap-2 p-2" edges={['bottom']}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Text>Title</Text>
            <Input
              editable={!createTaskLoading || !checkTaskByTitleExistsLoading}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          </>
        )}
        name="title"
      />
      {errors.title && <Text>Required</Text>}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Text>Description</Text>
            <Textarea
              className="h-48"
              editable={!createTaskLoading || !checkTaskByTitleExistsLoading}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          </>
        )}
        name="description"
      />

      <Button
        className="mt-auto"
        disabled={createTaskLoading || checkTaskByTitleExistsLoading}
        onPress={handleSubmit(handleCheckTitleExists)}>
        <Icon as={createTaskLoading || checkTaskByTitleExistsLoading ? Loader2 : Plus} />
        <Text>Create</Text>
      </Button>

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              There's allready a task registered with this title. Do you want to proceed and create
              another task with the same title?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={() => handleCreate(getValues())}>
              <Text>Continue</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  );
}
