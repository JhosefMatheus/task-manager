import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Skeleton } from '@/components/ui/skeleton';
import { View } from 'react-native';
import { useFindTaskById } from '@/hooks/tasks/useFindTaskById';
import { useToast } from '@/contexts';
import { useDeleteTaskById, useTaskByTitleExists, useUpdateTaskById } from '@/hooks';
import { Loader2, Pencil, Trash } from 'lucide-react-native';

interface HandleDeleteProps {
  id: number;
}

const schema = yup
  .object({
    title: yup.string().required(),
    description: yup.string(),
  })
  .required();

export default function Screen() {
  const { showToast } = useToast();

  const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState<boolean>(false);

  const {
    loading: checkTaskByTitleExistsLoading,
    taskByTitleExists: checkTaskByTitleExists,
    error: checkTaskByTitleExistsError,
  } = useTaskByTitleExists();

  const { loading: deleteTaskLoading, error: deleteTaskError, deleteTask } = useDeleteTaskById();

  const { loading: updateTaskLoading, error: updateTaskError, update } = useUpdateTaskById();

  const { id } = useLocalSearchParams<{ id: string }>();

  const parsedId: number = Number(id);

  if (isNaN(parsedId)) {
    showToast({
      title: 'Erro ao procurar pela tarefa.',
      message: 'Erro ao passar o id da tarefa de string para número. Tente novamente mais tarde.',
      duration: null,
    });

    router.replace('/(tabs)');
  }

  const {
    loading: findTaskByIdLoading,
    task: findTaskByIdResult,
    error: findTaskByIdError,
  } = useFindTaskById({ id: parsedId });

  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useFocusEffect(
    useCallback(() => {
      if (findTaskByIdResult !== null) {
        reset({
          title: findTaskByIdResult.title,
          description: findTaskByIdResult.description ?? '',
        });
      }
    }, [findTaskByIdResult])
  );

  async function handleDelete({ id }: HandleDeleteProps): Promise<void> {
    await deleteTask({ id });

    if (deleteTaskError !== null) {
      showToast({
        title: 'Task unsucessfully deleted.',
        message: 'There was an error while deleting the task. Try again later.',
        duration: null,
      });

      return;
    }

    showToast({
      title: 'Task successfully deleted.',
      message: null,
      duration: null,
    });

    if (router.canGoBack()) {
      router.back();

      return;
    }

    router.replace('/(tabs)');
  }

  async function handleCheckTitleExists(data: yup.InferType<typeof schema>): Promise<void> {
    const taskByTitleExists: boolean | undefined = await checkTaskByTitleExists(data.title);

    if (taskByTitleExists) {
      setUpdateDialogOpen(true);
      return;
    }

    if (checkTaskByTitleExistsError !== null) {
      showToast({
        title: 'Task unsuccessfully updated.',
        message:
          'There was an error while checking if allready exists a task with the supplied title on the database. Try again later.',
        duration: 5000,
      });
      return;
    }

    await handleUpdate(data);
  }

  async function handleUpdate(data: yup.InferType<typeof schema>): Promise<void> {
    await update({
      id: parsedId,
      title: data.title,
      description:
        data.description !== undefined && data.description.length !== 0
          ? (data.description as string)
          : null,
    });

    if (updateTaskError !== null) {
      showToast({
        title: 'Task unsuccessfully updated.',
        message: 'There was an error while updating the task. Try again later.',
        duration: null,
      });

      return;
    }

    showToast({
      title: 'Task successfully updated.',
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
      {findTaskByIdLoading ? (
        <>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-32 w-full" />
          <View className="mt-auto flex-row items-center justify-center gap-2">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-12 w-1/2" />
          </View>
        </>
      ) : (
        <>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text>Title</Text>
                <Input
                  editable={
                    !updateTaskLoading || !deleteTaskLoading || !checkTaskByTitleExistsLoading
                  }
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
                  editable={
                    !updateTaskLoading || !deleteTaskLoading || !checkTaskByTitleExistsLoading
                  }
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </>
            )}
            name="description"
          />

          <View className="mt-auto flex-row items-center justify-center gap-2">
            <AlertDialog
              open={deleteTaskDialogOpen}
              onOpenChange={setDeleteTaskDialogOpen}
              className="w-1/2">
              <AlertDialogTrigger asChild>
                <Button disabled={deleteTaskLoading || checkTaskByTitleExistsLoading}>
                  <Icon as={deleteTaskLoading || checkTaskByTitleExistsLoading ? Loader2 : Trash} />
                  <Text>Delete</Text>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action has no return. If you delete a task the only way to have the same
                    task again is by creating it again. Do you want to proceed and delete this task?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    <Text>Cancel</Text>
                  </AlertDialogCancel>
                  <AlertDialogAction onPress={() => handleDelete({ id: parsedId })}>
                    <Text>Continue</Text>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              className="w-1/2"
              disabled={updateTaskLoading || checkTaskByTitleExistsLoading}
              onPress={handleSubmit(handleCheckTitleExists)}>
              <Icon as={updateTaskLoading || checkTaskByTitleExistsLoading ? Loader2 : Pencil} />
              <Text>Update</Text>
            </Button>
          </View>
        </>
      )}

      <AlertDialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              There's allready a task registered with this title. Do you want to proceed and update
              this task to have a duplicated title?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={() => handleUpdate(getValues())}>
              <Text>Continue</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  );
}
