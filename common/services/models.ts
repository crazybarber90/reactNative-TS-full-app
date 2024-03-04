export interface Credentials {
  email: string;
  password: string;
}

export interface Profile {
  auth_key: string;
  avatar: string;
  birthdate?: Date;
  description?: string;
  email: string;
  gender?: string;
  id: number;
  lications: string[];
  name: string;
  permisions: string[];
  phone?: string;
  public_email: string;
  role: string;
  session_start: number;
  surname?: string;
  username: string;
}

export interface Licence {
  description: string;
  google_play_store_link: {
    is_on_google_play_store: number;
    link: string;
  };
  icon: string;
  id: number;
  partner_sales: string | null;
  phone: string;
  register_msg: string;
  sign_in_msg: string;
  site_image: string;
  template_id: number;
  terms_and_conditions: string;
  title_of_app: string;
  title_of_app_unique: string;
}

export interface SingleContent {
  comments_allowed: string;
  content_type_id: number;
  content_type_order: number;
  content_type: {
    id: number;
    name: string;
    description: string;
  };
  content_type_categories: ContentCategorie[];
}

export interface ContentCategorie {
  category_order: number;
  child_categories: [];
  color?: string;
  content_slug?: string;
  content_type_id: number;
  description: string;
  id: number;
  image: string;
  name: string;
  parent_category: {
    id: number;
    name: string;
  };
  slug: string;
  status: string;
  attributes?: SingleAttribute[];
}

export interface SingleAttribute {
  id: number;
  name: string;
  status: string;
  description: string;
  attributeValues: {
    id: number;
    value: string;
    name: string;
  }[];
}

export interface Planner {
  calculate_price_public: string;
  created_at: number;
  description: string;
  id: number;
  is_public: number;
  licence_id: number;
  module_id: number;
  status: string;
  title: string;
  updated_at: number;
  user_id: number;
}
