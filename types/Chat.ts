export interface MessageType {
  id: string;
  message: string;
  memeId?: number;
  created: Date;
  from: string;
  chatId: string;
  replying?: ReplyType;
}

export interface ReplyType {
  id: string;
  message: string;
}
