export interface MemeType {
  id: number;
  title: string;
  tags?: TagType[];
  source?: string | undefined | null;
  collections?: CollectionType[];
  image: string;
  description?: string;
  comments: CommentType[];
  created: Date;
  reactions?: ReactionType[];
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

export interface CollectionType {
  id: number;
  name: string;
  userId: string;
  public?: boolean | null;
  description?: string | null;
}

export interface ReportType {
  selectedOptions: string[];
  feedback?: string;
}

export interface ReactionType {
  emoji: string;
  userId: string;
}
