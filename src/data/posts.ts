import type { Post } from '../types';

export const INITIAL_POSTS: Post[] = [
    {
        _id: '101',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
        title: 'City Sunset',
        caption: 'The way the light hits the buildings here is incredible.',
        tags: ['urban', 'architecture', 'goldenhour'],
        creator: { id: '2', username: 'alex_shots', email: 'alex@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=alex', role: 'consumer' },
        stats: { likes: 120, hasLiked: true },
        comments: [
            { id: 'c1', user: 'sarah_m', text: 'This lighting is perfect.', likes: 2, hasLiked: false, timestamp: '2025-12-19T10:00:00Z' },
            { id: 'c2', user: 'mike_cam', text: 'Where was this taken?', likes: 0, hasLiked: false, timestamp: '2025-12-19T10:05:00Z' }
        ],
        createdAt: '2025-12-19T09:00:00Z'
    },
    {
        _id: '102',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
        title: 'Alpine Adventure',
        caption: 'Finally made it to the summit. The view was worth the hike.',
        tags: ['hiking', 'outdoors', 'mountains'],
        creator: { id: '3', username: 'outdoor_life', email: 'outdoors@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=outdoors', role: 'creator' },
        stats: { likes: 350, hasLiked: false },
        comments: [],
        createdAt: '2025-12-19T08:00:00Z',
        location: 'Swiss Alps'
    },
     {
        _id: '103',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1540206395-688085723adb?q=80&w=1000&auto=format&fit=crop',
        title: 'Modern Lines',
        caption: 'Details matter in contemporary design.',
        tags: ['minimalism', 'structures'],
        creator: { id: '1', username: 'visual_s', email: 'v@example.com', avatarUrl: 'https://github.com/shadcn.png', role: 'creator' },
        stats: { likes: 45, hasLiked: false },
        comments: [],
        createdAt: '2025-12-18T20:00:00Z'
    },
    {
        _id: '104',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop',
        title: 'Forest Walk',
        caption: 'Spending some time off the grid.',
        tags: ['nature', 'peaceful'],
        creator: { id: '3', username: 'outdoor_life', email: 'outdoors@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=outdoors', role: 'creator' },
        stats: { likes: 89, hasLiked: false },
        comments: [{ id: 'c3', user: 'alex_shots', text: 'So calming.', likes: 1, hasLiked: true, timestamp: '2025-12-18T10:00:00Z' }],
        createdAt: '2025-12-18T19:00:00Z'
    },
     {
        _id: '105',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=1000&auto=format&fit=crop',
        title: 'Morning Ritual',
        caption: 'Starting the day right.',
        tags: ['cafe', 'morning'],
        creator: { id: '2', username: 'alex_shots', email: 'alex@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=alex', role: 'consumer' },
        stats: { likes: 23, hasLiked: false },
        comments: [],
        createdAt: '2025-12-19T09:30:00Z'
    }
];
