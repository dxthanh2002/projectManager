import type { ReadingItem, ConversationItem } from '@/types/eapp';

export const readingItems: ReadingItem[] = [
  {
    id: 1,
    title: 'Friends: "Frozen Festivals" create profile',
    author: 'Movies, A-Z',
    progress: 60,
    comments: 5,
    days: 6,
    avatars: ['👤', '👤', '👤']
  },
  {
    id: 2,
    title: 'Digital Art Design Workshop',
    author: 'Sunday 05, Nov',
    progress: 75,
    comments: 12,
    days: 3,
    avatars: ['👤', '👤', '👤', '👤']
  }
];

export const conversations: ConversationItem[] = [
  { id: 1, items: 4, members: 210, avatars: ['👤', '👤', '👤'] },
  { id: 2, items: 6, members: 210, avatars: ['👤', '👤', '👤'] },
  { id: 3, items: 4, members: 210, avatars: ['👤', '👤', '👤'] }
];