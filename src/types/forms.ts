// Form-related types

export interface TripFormData {
  title: string;
  mode: string;
  destination_provinces: string[];
  start_date?: string;
  end_date?: string;
  travelers_count: number;
  total_budget_vnd: number;
}

export interface CostFormData {
  category: string;
  amount_vnd: number;
  note?: string;
}

export interface ProfileFormData {
  full_name: string;
  avatar_url?: string;
  home_city?: string;
  travel_styles?: string[];
  budget_preference?: string;
  crowd_tolerance?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
