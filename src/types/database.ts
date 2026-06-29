export type UserType = "foreigner" | "korean";
export type ReservationDifficulty = "easy" | "moderate" | "hard";
export type ConnectionStatus = "pending" | "accepted" | "declined";
export type MeetupStatus = "open" | "full" | "cancelled" | "completed";
export type SavedItemType = "place" | "guide" | "meetup" | "restaurant" | "menu";

export interface Region {
  id: string;
  name_ko: string;
  name_en: string;
  slug: string;
  city: string | null;
  description_en: string | null;
  description_ko: string | null;
  created_at: string;
}

export interface Interest {
  id: string;
  name_ko: string;
  name_en: string;
  slug: string;
  icon: string | null;
  category: string | null;
}

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  user_type: UserType;
  nationality: string | null;
  languages: string[];
  language_goal: string | null;
  region_id: string | null;
  onboarding_done: boolean;
  created_at: string;
  updated_at: string;
  region?: Region;
  interests?: Interest[];
}

export interface Place {
  id: string;
  name_ko: string;
  name_en: string;
  slug: string;
  description_ko: string | null;
  description_en: string | null;
  category: string;
  region_id: string | null;
  address: string | null;
  address_ko?: string | null;
  lat: number | null;
  lng: number | null;
  image_url: string | null;
  english_support: boolean;
  card_payment: boolean;
  solo_friendly: boolean;
  reservation_difficulty: ReservationDifficulty | null;
  created_at: string;
  region?: Region;
  tags?: PlaceTag[];
}

export interface PlaceTag {
  id: string;
  place_id: string;
  tag_en: string;
  tag_ko: string | null;
}

export interface Guide {
  id: string;
  title_ko: string;
  title_en: string;
  slug: string;
  body_ko: string | null;
  body_en: string | null;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  image_url: string | null;
  tags: string[];
  created_at: string;
}

export interface Restaurant {
  id: string;
  name_ko: string;
  name_en: string;
  slug: string;
  description_en: string | null;
  description_ko: string | null;
  region_id: string | null;
  category: string | null;
  image_url: string | null;
  address: string | null;
  created_at: string;
  region?: Region;
  menus?: Menu[];
}

export interface Menu {
  id: string;
  restaurant_id: string;
  name_ko: string;
  name_en: string;
  slug: string;
  description_en: string | null;
  description_ko: string | null;
  spice_level: number | null;
  price_range: string | null;
  how_to_order_en: string | null;
  local_tip_en: string | null;
  image_url: string | null;
  vegetarian: boolean;
  created_at: string;
  restaurant?: Restaurant;
}

export interface Meetup {
  id: string;
  title: string;
  description: string | null;
  host_id: string | null;
  region_id: string | null;
  location_name: string | null;
  scheduled_at: string;
  max_participants: number;
  current_count: number;
  tags: string[];
  language_tags: string[];
  image_url: string | null;
  status: MeetupStatus;
  created_at: string;
  host?: Profile;
  region?: Region;
  participants?: MeetupParticipant[];
}

export interface MeetupParticipant {
  meetup_id: string;
  user_id: string;
  joined_at: string;
  status: "confirmed" | "cancelled";
  profile?: Profile;
}

export interface Connection {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: ConnectionStatus;
  created_at: string;
  requester?: Profile;
  recipient?: Profile;
}

export interface SavedItem {
  id: string;
  user_id: string;
  item_type: SavedItemType;
  item_id: string;
  created_at: string;
}

export interface UserInterest {
  user_id: string;
  interest_id: string;
  interest?: Interest;
}
