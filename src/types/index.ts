export interface User {
  id: string;
  username: string; // Explicit field
  email: string;
  avatarUrl: string;
  role: 'consumer' | 'creator';
}

export interface Comment {
  id: string;
  user: string; // Username
  text: string;
  likes: number;
  hasLiked: boolean; // Current user state
  timestamp: string;
}

export interface Post {
  _id: string; // MongoDB Style ID
  mediaType: 'image' | 'video';
  url: string;
  title?: string;
  caption: string;
  location?: string;
  people?: string[];
  tags: string[];
  creator: User;
  stats: {
    likes: number;
    hasLiked: boolean; // Current user state
  };
  comments: Comment[];
  createdAt: string;
}
