import { database } from '@/db/client';
import { useCallback, useState } from 'react';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

export function useTaskByTitleExists() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const taskByTitleExists = useCallback(async (title: string) => {
    try {
      setLoading(true);
      setError(null);

      const task = database
        .select({ title: schema.tasks.title })
        .from(schema.tasks)
        .where(eq(schema.tasks.title, title))
        .get();

      const taskExists: boolean = task !== undefined;

      return taskExists;
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, taskByTitleExists };
}
