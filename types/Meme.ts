export interface MemeType {
  id: number;
  title: string;
  tags?: TagType[];
  image: string;
  description?: string;
  comments: CommentType[];
  created: Date;
}

export interface ServerDataType {
  uploadedBy: string;
  file: string;
}

export interface CommentType {
  id: number;
  content: string;
  createdAt: Date;
  userId: string;
  memeId: number;
}

export interface TagType {
  id: number;
  name: string;
  default?: boolean;
}
