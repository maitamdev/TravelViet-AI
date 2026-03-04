import { useState } from 'react';
import { useAddTripCost, useDeleteTripCost, useBudgetSummary } from '@/hooks/useBudget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Trash2, Plus, DollarSign } from 'lucide-react';
import { formatVND, COST_CATEGORIES } from '@/lib/constants';
import type { CostCategory } from '@/types/database';

interface BudgetSectionProps {
  tripId: string;
  totalBudget: number;
}

export function BudgetSection({ tripId, totalBudget }: BudgetSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<CostCategory>('food');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const { costs, summary } = useBudgetSummary(tripId);
  const addCost = useAddTripCost();
  const deleteCost = useDeleteTripCost();

  const spentPercentage = totalBudget > 0 ? Math.min((summary.total / totalBudget) * 100, 100) : 0;

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) return;
    await addCost.mutateAsync({
      trip_id: tripId,
      category,
      amount_vnd: Number(amount),
      note: note || undefined,
    });
    setAmount('');
    setNote('');
    setShowForm(false);
  };

  return (
    <div className='space-y-4'>
      {/* Budget Overview */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-lg flex items-center gap-2'>
            <DollarSign className='h-5 w-5' />
            Theo doi chi phi
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex justify-between text-sm'>
            <span>Da chi: {formatVND(summary.total)}</span>
            <span>Ngan sach: {formatVND(totalBudget)}</span>
          </div>
          <Progress value={spentPercentage} className='h-3' />
          <p className='text-xs text-muted-foreground text-right'>
            {spentPercentage.toFixed(1)}% ngan sach
          </p>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Phan bo chi phi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {COST_CATEGORIES.map(cat => {
              const catAmount = summary[cat.value as keyof typeof summary] || 0;
              const catPercentage = summary.total > 0 ? (catAmount / summary.total) * 100 : 0;
              return (
                <div key={cat.value} className='flex items-center gap-3'>
                  <span className='text-lg'>{cat.icon}</span>
                  <div className='flex-1'>
                    <div className='flex justify-between text-sm'>
                      <span>{cat.label}</span>
                      <span className='font-medium'>{formatVND(catAmount)}</span>
                    </div>
                    <Progress value={catPercentage} className='h-1.5 mt-1' />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Cost Form */}
      {showForm ? (
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base'>Them chi phi</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='space-y-2'>
              <Label>Danh muc</Label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CostCategory)}
                className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
              >
                {COST_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                ))}
              </select>
            </div>
            <div className='space-y-2'>
              <Label>So tien (VND)</Label>
              <Input type='number' value={amount} onChange={e => setAmount(e.target.value)} placeholder='0' />
            </div>
            <div className='space-y-2'>
              <Label>Ghi chu</Label>
              <Input value={note} onChange={e => setNote(e.target.value)} placeholder='Vi du: An trua...' />
            </div>
            <div className='flex gap-2'>
              <Button onClick={handleSubmit} disabled={addCost.isPending} className='flex-1'>Them</Button>
              <Button variant='outline' onClick={() => setShowForm(false)}>Huy</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} className='w-full' variant='outline'>
          <Plus className='h-4 w-4 mr-2' /> Them chi phi
        </Button>
      )}

      {/* Cost List */}
      {costs && costs.length > 0 && (
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base'>Lich su chi phi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {costs.map(cost => {
                const cat = COST_CATEGORIES.find(c => c.value === cost.category);
                return (
                  <div key={cost.id} className='flex items-center gap-3 p-2 rounded-lg bg-muted/50 group'>
                    <span>{cat?.icon || '💰'}</span>
                    <div className='flex-1'>
                      <div className='flex justify-between'>
                        <span className='text-sm font-medium'>{cat?.label}</span>
                        <span className='text-sm font-bold text-primary'>{formatVND(cost.amount_vnd)}</span>
                      </div>
                      {cost.note && <p className='text-xs text-muted-foreground'>{cost.note}</p>}
                    </div>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='opacity-0 group-hover:opacity-100 h-8 w-8'
                      onClick={() => deleteCost.mutate({ costId: cost.id, tripId })}
                    >
                      <Trash2 className='h-3 w-3 text-destructive' />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

