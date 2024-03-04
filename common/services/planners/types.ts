export interface PlannerItem {
  calculate_price: "yes" | "no"; // yes/no
  category_id: number;
  category_name: string;
  contact_email: string;
  contact_phone: string;
  content_currency?: {
    id: 1 | 2;
    name: string;
  };
  content_description: string | null;
  content_id: number | null;
  content_image?: string;
  content_locations:
    | {
        address: string;
        city: string;
        country: string;
        lat: number;
        lng: number;
        id: number;
      }[]
    | null;
  content_price: string | null;
  content_title?: string;
  content_user_locations:
    | {
        content_id: number;
        id: number;
        status: string;
        user_location_id: number;
      }[]
    | null;
  currency: {
    id: 1 | 2;
    name: string;
  };
  name: string;
  description?: string;
  file?: null;
  id: number;
  image: string;
  locations: {
    address: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
  }[];
  planner_id: number;
  planner_title: string;
  price: string;
  remark?: string;
  scheduled_date?: {
    datetime: string;
    timestamp: Date;
  };
  show_planer_item_public: string;
  show_price_public: string;
  title?: string;
}

export interface NewPlannerResponse {
  created_at: number;
  description: string;
  id: number;
  licence_id: number;
  module_id: number;
  title: string;
  updated_at: number;
  user_id: number;
}
