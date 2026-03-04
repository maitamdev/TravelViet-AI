import { useState } from 'react';
import { useTripTasks, useAddTripTask, useUpdateTripTask, useDeleteTripTask } from '@/hooks/useCollaboration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ListTodo, Plus, Trash2 } from 'lucide-react';

interface TripTasksSectionProps {
  tripId: string;
}

export function TripTasksSection({ tripId }: TripTasksSectionProps) {
  const [newTask, setNewTask] = useState('');
  const [showInput, setShowInput] = useState(false);
  const { data: tasks, isLoading } = useTripTasks(tripId);
  const addTask = useAddTripTask();
  const updateTask = useUpdateTripTask();
  const deleteTask = useDeleteTripTask();

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    await addTask.mutateAsync({ tripId, title: newTask.trim() });
    setNewTask('');
    setShowInput(false);
  };

  const toggleStatus = (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'done' ? 'todo' : currentStatus === 'todo' ? 'doing' : 'done';
    updateTask.mutate({ taskId, tripId, updates: { status: nextStatus } as any });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'todo': return <Badge variant='outline' className='text-xs'>Chua lam</Badge>;
      case 'doing': return <Badge variant='secondary' className='text-xs'>Dang lam</Badge>;
      case 'done': return <Badge className='text-xs bg-green-600'>Hoan thanh</Badge>;
      default: return null;
    }
  };

  const todoTasks = tasks?.filter(t => (t as any).status !== 'done') || [];
  const doneTasks = tasks?.filter(t => (t as any).status === 'done') || [];

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg flex items-center gap-2'>
            <ListTodo className='h-5 w-5' />
            Cong viec ({tasks?.length || 0})
          </CardTitle>
          <Button size='sm' variant='ghost' onClick={() => setShowInput(!showInput)}>
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        {showInput && (
          <div className='flex gap-2'>
            <Input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              placeholder='Them cong viec moi...'
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
            <Button size='sm' onClick={handleAdd} disabled={!newTask.trim()}>Them</Button>
          </div>
        )}

        {isLoading ? (
          <p className='text-sm text-muted-foreground'>Dang tai...</p>
        ) : (
          <>
            {todoTasks.map((task: any) => (
              <div key={task.id} className='flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 group'>
                <Checkbox
                  checked={task.status === 'done'}
                  onCheckedChange={() => toggleStatus(task.id, task.status)}
                />
                <div className='flex-1'>
                  <p className='text-sm'>{task.title}</p>
                </div>
                {getStatusBadge(task.status)}
                <Button
                  size='icon'
                  variant='ghost'
                  className='h-7 w-7 opacity-0 group-hover:opacity-100'
                  onClick={() => deleteTask.mutate({ taskId: task.id, tripId })}
                >
                  <Trash2 className='h-3 w-3 text-destructive' />
                </Button>
              </div>
            ))}
            {doneTasks.length > 0 && (
              <>
                <p className='text-xs text-muted-foreground pt-2'>Hoan thanh ({doneTasks.length})</p>
                {doneTasks.map((task: any) => (
                  <div key={task.id} className='flex items-center gap-3 p-2 rounded-lg opacity-60 group'>
                    <Checkbox checked onCheckedChange={() => toggleStatus(task.id, task.status)} />
                    <p className='text-sm line-through flex-1'>{task.title}</p>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='h-7 w-7 opacity-0 group-hover:opacity-100'
                      onClick={() => deleteTask.mutate({ taskId: task.id, tripId })}
                    >
                      <Trash2 className='h-3 w-3 text-destructive' />
                    </Button>
                  </div>
                ))}
              </>
            )}
            {(!tasks || tasks.length === 0) && !showInput && (
              <p className='text-sm text-muted-foreground text-center py-4'>Chua co cong viec nao</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

