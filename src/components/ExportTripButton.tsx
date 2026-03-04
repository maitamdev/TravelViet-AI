import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { tripToCsv, downloadCsv } from '@/lib/export-utils';

interface ExportTripButtonProps {
  trip: any;
  days: any[];
  items: any[];
}

export function ExportTripButton({ trip, days, items }: ExportTripButtonProps) {
  const handleExport = () => {
    const csv = tripToCsv(trip, days, items);
    downloadCsv(csv, trip.title.replace(/\s+/g, '_') + '_itinerary.csv');
  };
  return (
    <Button variant='outline' size='sm' onClick={handleExport}>
      <Download className='h-4 w-4 mr-2' /> Xuat CSV
    </Button>
  );
}
