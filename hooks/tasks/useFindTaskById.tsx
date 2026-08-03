import { useState } from 'react';

interface UseFindTaskByIdProps {
  id: number;
}

export function useFindTaskById({ id }: UseFindTaskByIdProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [task, setTask] = useState<null>(null);
  const [error, setError] = useState<Error | null>(null);

  return { loading, task, error };
}
