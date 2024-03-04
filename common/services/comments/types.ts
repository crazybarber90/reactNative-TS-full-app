export interface Comments {
  author_name: string;
  child_comments?: Comments[];
  comment_content: string;
  content_id: number;
  content_image: string;
  content_title: string;
  created_at: number;
  date: string;
  datetime: string;
  id: number;
  status: string;
  user_id: null | number;
}

export interface SuccessPostComment {
  code: number;
  message: string;
  name: string;
  status: number;
  type: string;
}
