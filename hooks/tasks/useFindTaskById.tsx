import { database } from '@/db/client';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import * as schema from '@/db/schema';
import { eq, InferSelectModel } from 'drizzle-orm';

interface UseFindTaskByIdProps {
  id: number;
}

export function useFindTaskById({ id }: UseFindTaskByIdProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [task, setTask] = useState<InferSelectModel<typeof schema.tasks> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const init = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      const result = database.select().from(schema.tasks).where(eq(schema.tasks.id, id)).get();

      setTask(result ?? null);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(init);

  return { loading, task, error };
}
