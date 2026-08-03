import { TabsTasksHeader, TaskList } from '@/components/tasks';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView style={styles.safeAreaView} edges={['top']}>
      <TabsTasksHeader title="Today's Tasks" />
      <TaskList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    gap: 10,
  },
});
