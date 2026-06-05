export interface MemeType {
  id: string;
  title: string;
  tags?: string[];
  image: string;
  description: string;
  created: Date;
}

export interface ServerDataType {
  uploadedBy: string;
  file: string;
}
