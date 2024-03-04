import { SingleAttribute } from "../models";
export interface Catalog {
  active_bidding: boolean;
  author_avatar: string;
  author_id: number;
  author_name: string;
  author_username: string;
  category_id: number;
  category_name: string;
  created_at: number;
  date: string;
  date_format: string;
  description: string;
  description_short: string;
  id: number;
  image: string;
  is_catalog: boolean;
  mod_category_id?: number;
  mod_category_name?: string;
  mod_description?: string;
  mod_image?: string;
  mod_name?: string;
  name: string;
  remark_approve?: string;
  remark_disapprove?: string;
  remark_request_for_edit: string;
  slug: string;
  status: string;
  unique_identifier: string;
}

export interface Product {
  active_bidding: boolean;
  attributes?: SingleAttribute[];
  author_avatar: string;
  author_email: string;
  author_id: number;
  author_location: {
    address: string;
    city: string;
    country: string;
    id: number;
    lat: number;
    lng: number;
    location_no: number;
  }[];
  author_name: string;
  author_phone: string;
  author_username: string;
  catalogs: null;
  category_id: number;
  category_name: string;
  comments_allowed: string;
  content_locations: {
    content_id: number;
    id: number;
    status: string;
    user_location_id: number;
  }[];
  content_text: string;
  content_type: string;
  content_type_comments_allowed: string;
  content_type_id: number;
  created_at: number;
  currency: string;
  currency_id: number;
  date: string;
  date_format: string;
  datetime: string;
  description: string;
  discount: number;
  discount_type: number;
  hits: number;
  id: number;
  image: string;
  image_gallery: {
    id: number;
    image: string;
  }[];
  mod_category_id?: number;
  mod_category_name?: string;
  mod_content_text?: string;
  mod_currency_id?: number;
  mod_description?: string;
  mod_image?: string;
  mod_image_gallery: {
    id: number;
    image: string;
  }[];
  mod_price?: string;
  mod_title?: string;
  mod_video_gallery?: {
    id: number;
    video_url: string;
    video_url_preview: string;
  }[];
  name: string;
  order?: number;
  price: string;
  remark_approve?: string;
  remark_disapprove?: string;
  remark_request_for_edit?: string;
  slug: string;
  status: string;
  tags: {
    frequency: number;
    id: number;
    name: string;
  }[];
  title: string;
  video_gallery?: {
    id: number;
    video_url: string;
    video_url_preview: string;
  }[];
}
