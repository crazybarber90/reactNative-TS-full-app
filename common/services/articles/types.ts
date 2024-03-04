export interface Article {
  author_avatar: string;
  author_id: number;
  author_name: string;
  author_username: string;
  category_id: number;
  category_name: string;
  comments_allowed: string;
  content_text: string;
  content_type: string;
  content_type_comments_allowed: string;
  content_type_id: number;
  created_at: number;
  date: string;
  date_format: string;
  datetime: string;
  description: string;
  gallery_position: number;
  hits: number;
  id: number;
  image: string;
  image_gallery?: {
    id: number;
    image: string;
  }[];
  mod_category_id?: number;
  mod_category_name?: string;
  mod_content_text?: string;
  mod_image?: string;
  mod_image_gallery?: {
    id: number;
    image: string;
  }[];
  mod_title: string;
  mod_video_gallery?: {
    id: number;
    video_url: string;
    video_url_preview: string;
  }[];
  name: string;
  order: null;
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
