// Định nghĩa và export các kiểu dữ liệu
export interface ReadingItem {
  id: number;
  title: string;
  author: string;
  progress: number;
  comments: number;
  days: number;
  avatars: string[];
}

export interface ConversationItem {
  id: number;
  items: number;
  members: number;
  avatars: string[];
}

// Props types cho các component
export interface ProgressCardProps {
  item: ReadingItem;
}

export interface ConversationCardProps {
  item: ConversationItem;
}

export interface SectionHeaderProps {
  title: string;
}