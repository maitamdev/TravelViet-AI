import { useState } from 'react';
import { useCreateReport } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Flag } from 'lucide-react';

interface ReportDialogProps {
  targetType: 'user' | 'itinerary' | 'comment';
  targetId: string;
}

export function ReportDialog({ targetType, targetId }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const createReport = useCreateReport();

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    await createReport.mutateAsync({ targetType, targetId, reason: reason.trim() });
    setReason('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm' className='text-muted-foreground'>
          <Flag className='h-3 w-3 mr-1' /> Bao cao
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bao cao noi dung</DialogTitle>
          <DialogDescription>Cho chung toi biet ly do bao cao</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label>Ly do</Label>
            <Input value={reason} onChange={e => setReason(e.target.value)} placeholder='Mo ta ly do...' />
          </div>
          <div className='flex gap-2 justify-end'>
            <Button variant='outline' onClick={() => setOpen(false)}>Huy</Button>
            <Button onClick={handleSubmit} disabled={!reason.trim() || createReport.isPending}>Gui</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
