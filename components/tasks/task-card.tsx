import { View } from 'react-native';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { Info } from 'lucide-react-native';
import { useState } from 'react';
import { InferSelectModel } from 'drizzle-orm';
import * as schema from '@/db/schema';

interface TaskCardProps {
  task: InferSelectModel<typeof schema.tasks>;
}

export function TaskCard({ task }: TaskCardProps) {
  const [checked, setChecked] = useState<boolean>(false);

  function onCheckedChange(): void {
    setChecked((checked) => !checked);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start gap-3">
        <View className="flex-1">
          <CardTitle className="text-foreground">{task.title}</CardTitle>
          <CardDescription>{task.description}</CardDescription>
        </View>
        <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      </CardHeader>
      <CardFooter className="flex-row justify-end">
        <Button>
          <Icon as={Info} />
          <Text>Details</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
