import { database } from '@/db/client';
import { useCallback, useState } from 'react';
import * as schema from '@/db/schema';

interface createTaskCallbackProps {
  title: string;
  description: string | null;
}

export function useCreateTask() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async ({ title, description }: createTaskCallbackProps) => {
    try {
      setLoading(true);

      const [task] = await database.insert(schema.tasks).values({ title, description }).returning();

      setError(null);

      return task;
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, create, error };
}
