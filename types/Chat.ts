export interface MessageType {
  id: string;
  message: string;
  memeId?: number;
  created: Date;
  from: string;
  chatId: string;
  replying?: ReplyType;
  reactions?: ReactionType[];
  edited?: boolean;
  deleted?: boolean;
}

export interface ReplyType {
  id: string;
  message: string;
}

export interface ReactionType {
  emoji: string;
  count: string[];
}
