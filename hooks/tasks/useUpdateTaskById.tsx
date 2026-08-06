import { database } from '@/db/client';
import { useState } from 'react';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

interface UpdateTaskByIdProps {
  id: number;
  title: string;
  description: string | null;
}

export function useUpdateTaskById() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  async function update({ id, title, description }: UpdateTaskByIdProps): Promise<void> {
    try {
      setLoading(true);
      setError(null);

      await database
        .update(schema.tasks)
        .set({ title, description })
        .where(eq(schema.tasks.id, id));
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, update };
}
