import { View } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';

interface TabsTaskHeaderProps {
  title: string;
}

export function TabsTasksHeader({ title }: TabsTaskHeaderProps) {
  function navigateToCreateTaskScreen(): void {
    router.push('/task/create');
  }

  return (
    <View className="flex-row items-center justify-between border-b border-border bg-background p-4">
      <Text>{title}</Text>
      <Button className="h-10 w-10 rounded-full" onPress={navigateToCreateTaskScreen}>
        <Icon as={Plus} />
      </Button>
    </View>
  );
}
