import { FlatList, StyleSheet, useColorScheme, View } from 'react-native';
import { Input } from '../ui/input';
import { TaskCard } from './task-card';
import { Skeleton } from '../ui/skeleton';
import { useFilterTasks } from '@/hooks/tasks/useFilterTasks';
import { Text } from '../ui/text';
import { ClipboardList, Plus } from 'lucide-react-native';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { router } from 'expo-router';

export function TaskList() {
  const colorScheme = useColorScheme();

  const { loading, tasks } = useFilterTasks();

  function navigateToCreateTaskScreen(): void {
    router.push('/task/create');
  }

  return loading ? (
    <>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-36 w-full" />
    </>
  ) : (
    <FlatList
      data={tasks}
      renderItem={({ item }) => <TaskCard task={item} />}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={() => (
        <View className="bg-background pb-1">
          <Input placeholder="Search for your task" />
        </View>
      )}
      contentContainerStyle={styles.flatListContentContainer}
      ListEmptyComponent={() => (
        <View className="flex h-full flex-col items-center justify-center gap-2 py-4">
          <ClipboardList color={colorScheme === 'dark' ? 'white' : 'black'} size={48} />
          <Text>You don't have tasks yet.</Text>
          <Button onPress={navigateToCreateTaskScreen}>
            <Icon as={Plus} />
            <Text>Create task</Text>
          </Button>
        </View>
      )}
      stickyHeaderIndices={[0]}
    />
  );
}

const styles = StyleSheet.create({
  safeaAreaView: {
    flex: 1,
    padding: 10,
    gap: 10,
  },
  flatListContentContainer: {
    flexGrow: 1,
    gap: 5,
  },
});
