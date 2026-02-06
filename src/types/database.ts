// TravelViet Database Types
// These match the Supabase schema exactly

export type TripMode = 'solo' | 'couple' | 'family' | 'friends';
export type TripStatus = 'draft' | 'planned' | 'ongoing' | 'completed';
export type ItemType = 'move' | 'eat' | 'visit' | 'rest' | 'other';
export type SourceConfidence = 'verified' | 'estimated' | 'check';
export type CostCategory = 'transport' | 'stay' | 'food' | 'tickets' | 'other';
export type ChatRole = 'user' | 'assistant' | 'system';
export type PlanReason = 'initial' | 'replan' | 'what_if';
export type MemberRole = 'leader' | 'member';
export type VoteTargetType = 'item' | 'day' | 'destination';
export type TaskStatus = 'todo' | 'doing' | 'done';
export type ReportTargetType = 'user' | 'itinerary' | 'comment';
export type ReportStatus = 'open' | 'reviewed' | 'resolved' | 'rejected';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  home_city: string | null;
  travel_styles: string[];
  budget_min_vnd: number;
  budget_max_vnd: number;
  crowd_tolerance: number;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  owner_id: string;
  title: string;
  destination_provinces: string[];
  start_date: string | null;
  end_date: string | null;
  travelers_count: number;
  mode: TripMode;
  total_budget_vnd: number;
  status: TripStatus;
  share_slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface TripDay {
  id: string;
  trip_id: string;
  day_index: number;
  date: string | null;
  summary: string | null;
  created_at: string;
}

export interface TripItem {
  id: string;
  trip_day_id: string;
  item_type: ItemType;
  title: string;
  description: string | null;
  location_name: string | null;
  lat: number | null;
  lng: number | null;
  start_time: string | null;
  end_time: string | null;
  estimated_cost_vnd: number;
  crowd_level_pred: number | null;
  is_hidden_gem: boolean;
  source_confidence: SourceConfidence;
  sort_order: number;
  created_at: string;
}

export interface TripCost {
  id: string;
  trip_id: string;
  category: CostCategory;
  amount_vnd: number;
  note: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  trip_id: string | null;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: ChatRole;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AIPlanVersion {
  id: string;
  trip_id: string;
  version_no: number;
  reason: PlanReason;
  plan_json: AIPlanData;
  created_at: string;
}

export interface TripMember {
  id: string;
  trip_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
}

export interface TripVote {
  id: string;
  trip_id: string;
  target_type: VoteTargetType;
  target_id: string;
  user_id: string;
  vote_value: number;
  created_at: string;
}

export interface TripComment {
  id: string;
  trip_id: string;
  day_id: string | null;
  item_id: string | null;
  user_id: string;
  content: string;
  created_at: string;
}

export interface TripTask {
  id: string;
  trip_id: string;
  assignee_id: string | null;
  title: string;
  status: TaskStatus;
  due_at: string | null;
  created_at: string;
}

export interface PublicItinerary {
  id: string;
  trip_id: string;
  owner_id: string;
  title: string;
  summary: string | null;
  tags: string[];
  likes_count: number;
  saves_count: number;
  published_at: string;
}

export interface ItineraryReview {
  id: string;
  public_itinerary_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ItineraryBookmark {
  id: string;
  public_itinerary_id: string;
  user_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason: string;
  status: ReportStatus;
  created_at: string;
  resolved_at: string | null;
}

// AI Plan JSON structure
export interface AIPlanData {
  overview: string;
  days: AIPlanDay[];
  estimated_total_cost_vnd: number;
  cost_breakdown: {
    transport: number;
    stay: number;
    food: number;
    tickets: number;
    other: number;
  };
  tips: string[];
  warnings: string[];
  hidden_gems: string[];
}

export interface AIPlanDay {
  date: string;
  summary: string;
  items: AIPlanItem[];
}

export interface AIPlanItem {
  item_type: ItemType;
  title: string;
  description: string;
  location_name: string;
  lat?: number;
  lng?: number;
  start_time: string;
  end_time: string;
  estimated_cost_vnd: number;
  crowd_level_pred?: number;
  is_hidden_gem?: boolean;
  source_confidence: SourceConfidence;
}

// With relations
export interface TripWithDetails extends Trip {
  owner?: Profile;
  days?: TripDayWithItems[];
  members?: TripMemberWithProfile[];
}

export interface TripDayWithItems extends TripDay {
  items?: TripItem[];
}

export interface TripMemberWithProfile extends TripMember {
  profile?: Profile;
}

export interface PublicItineraryWithDetails extends PublicItinerary {
  owner?: Profile;
  trip?: TripWithDetails;
  reviews?: ItineraryReviewWithProfile[];
}

export interface ItineraryReviewWithProfile extends ItineraryReview {
  user?: Profile;
}

// Form types
export interface CreateTripInput {
  title: string;
  destination_provinces: string[];
  start_date?: string;
  end_date?: string;
  travelers_count: number;
  mode: TripMode;
  total_budget_vnd: number;
}

export interface UpdateTripInput extends Partial<CreateTripInput> {
  status?: TripStatus;
}

export interface CreateTripDayInput {
  trip_id: string;
  day_index: number;
  date?: string;
  summary?: string;
}

export interface CreateTripItemInput {
  trip_day_id: string;
  item_type: ItemType;
  title: string;
  description?: string;
  location_name?: string;
  lat?: number;
  lng?: number;
  start_time?: string;
  end_time?: string;
  estimated_cost_vnd?: number;
  crowd_level_pred?: number;
  is_hidden_gem?: boolean;
  source_confidence?: SourceConfidence;
  sort_order?: number;
}
