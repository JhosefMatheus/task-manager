import { database } from '@/db/client';
import * as schema from '@/db/schema';
import { InferSelectModel, like } from 'drizzle-orm';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export function useFilterTasks() {
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<InferSelectModel<typeof schema.tasks>[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const init = useCallback(async (search: string = '') => {
    try {
      setLoading(true);

      const tasks = await database
        .select()
        .from(schema.tasks)
        .where(like(schema.tasks.title, `%${search}`))
        .limit(20)
        .offset(page);

      setTasks(tasks);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      init();
    }, [init])
  );

  return { loading, tasks, page, hasMore, refresh: init };
}
