import { database } from '@/db/client';
import { useState } from 'react';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

interface DeleteTasksProps {
  id: number;
}

export function useDeleteTaskById() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  async function deleteTask({ id }: DeleteTasksProps): Promise<void> {
    try {
      setLoading(true);
      setError(null);

      await database.delete(schema.tasks).where(eq(schema.tasks.id, id));
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, deleteTask };
}
