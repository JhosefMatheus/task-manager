import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTask } from '@/hooks/tasks/useCreateTask';
import { router } from 'expo-router';
import { Loader2, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  const { loading, create, error } = useCreateTask();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  async function handleCreate(): Promise<void> {
    try {
      if (title.length === 0) {
        throw new Error('Title cannot be empty.');
      }

      await create({ title, description: description.length > 0 ? description : null });

      if (error !== null) {
        
      }

      router.back();
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView className="flex-1 gap-2 p-2" edges={['bottom']}>
      <Text>Title</Text>
      <Input editable={!loading} value={title} onChangeText={setTitle} />
      <Text>Description</Text>
      <Textarea
        className="h-48"
        editable={!loading}
        value={description}
        onChangeText={setDescription}
      />
      <Button className="mt-auto" disabled={loading} onPress={handleCreate}>
        <Icon as={loading ? Loader2 : Plus} />
        <Text>Create</Text>
      </Button>
    </SafeAreaView>
  );
}
