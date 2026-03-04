import { useState } from 'react';
import { useTripCosts, useAddTripCost, useDeleteTripCost, useBudgetSummary } from '@/hooks/useBudget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Trash2, Plus, DollarSign } from 'lucide-react';
import { formatVND, COST_CATEGORIES } from '@/lib/constants';
import type { CostCategory } from '@/types/database';

