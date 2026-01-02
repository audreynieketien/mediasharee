import { useEffect, useState } from 'react';
import type { Post } from '../types';
import { PostCard } from './PostCard';
import { api } from '../services/api';
import type { FeedFilters } from '../services/api';
import { Skeleton } from './ui/skeleton';

import { INITIAL_POSTS } from '../data/posts';

const FALLBACK_POSTS = INITIAL_POSTS;


interface FeedProps {
  posts?: Post[];
  filters?: FeedFilters;
}

export function Feed({ posts, filters }: FeedProps) {
  const [displayPosts, setDisplayPosts] = useState<Post[]>(posts || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if posts not passed as prop
    if (!posts) {
      const fetchPosts = async () => {
        setIsLoading(true);
        try {
          const response = await api.getFeed(1, filters);
          setDisplayPosts(response.posts || []);
        } catch (err) {
          console.error('Failed to fetch feed:', err);
          setError('Failed to load feed');
          // Fallback to mock data
          setDisplayPosts(FALLBACK_POSTS);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPosts();
    } else {
      setDisplayPosts(posts);
    }
  }, [posts, filters]);

  if (isLoading) {
    return (
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4">
            <Skeleton className="w-full h-64 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error && displayPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  // Empty state
  if (displayPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="p-4 rounded-full bg-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">No content yet</h3>
          <p className="text-muted-foreground max-w-md">
            {posts ? 
              "You haven't uploaded any content yet. Create your first post to see it here!" : 
              "No content has been uploaded yet. Check back later!"}
          </p>
        </div>
      </div>
    );
  }

  // Masonry layout using CSS columns
  // break-inside-avoid is applied on PostCard to prevent splitting
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
      {displayPosts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

