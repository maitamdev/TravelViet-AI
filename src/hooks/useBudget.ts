import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { TripCost, CostCategory } from '@/types/database';

export interface CreateTripCostInput {
  trip_id: string;
  category: CostCategory;
  amount_vnd: number;
  note?: string;
}

