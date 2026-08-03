import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
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
} from '@/components/ui/alert-dialog';
import { useLocalSearchParams } from 'expo-router';

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

  const { id } = useLocalSearchParams<{ id: string }>();

  console.log(id);

  return (
    <SafeAreaView className="flex-1 gap-2 p-2" edges={['bottom']}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Text>Title</Text>
            <Input
              // editable={!createTaskLoading || !checkTaskByTitleExistsLoading}
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
              // editable={!createTaskLoading || !checkTaskByTitleExistsLoading}
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
        // disabled={createTaskLoading || checkTaskByTitleExistsLoading}
        // onPress={handleSubmit(handleCheckTitleExists)}
      >
        {/* <Icon as={createTaskLoading || checkTaskByTitleExistsLoading ? Loader2 : Plus} /> */}
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
            <AlertDialogAction
            // onPress={() => handleCreate(getValues())}
            >
              <Text>Continue</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  );
}
