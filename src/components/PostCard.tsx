import { useState } from 'react';
import type { Post, Comment } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { cn } from '../lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.stats.hasLiked);
  const [likeCount, setLikeCount] = useState(post.stats.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  const { user: currentUser } = useAuth();

  const handleLike = async () => {
    // Optimistic UI update
    const previousLikedState = isLiked;
    const previousLikeCount = likeCount;
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));
    
    try {
      await api.toggleLike(post._id);
    } catch (error) {
      console.error('Failed to toggle like', error);
      // Revert on failure
      setIsLiked(previousLikedState);
      setLikeCount(previousLikeCount);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim() || !currentUser) return;

    try {
      const response = await api.addComment(post._id, commentText.trim());
      // Assuming backend returns the full new comment object or at least enough to form it
      // If backend returns simplified object, we might need to construct full Comment type
      const newComment: Comment = response.comment || {
        id: Math.random().toString(36).substr(2, 9), // Fallback if API doesn't return ID
        user: currentUser.username,
        text: commentText.trim(),
        likes: 0,
        hasLiked: false,
        timestamp: new Date().toISOString(),
      };

      setComments([...comments, newComment]);
      setCommentText('');
    } catch (error) {
      console.error('Failed to post comment', error);
      setError('Failed to post comment. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          handlePostComment();
      }
  };

  return (
    <Card className="break-inside-avoid mb-4 overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src={post.creator.avatarUrl} alt={post.creator.username} />
          <AvatarFallback>{post.creator.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold cursor-pointer hover:underline">
            {post.creator.username}
          </span>
          {post.location && (
            <span className="text-xs text-muted-foreground">{post.location}</span>
          )}
        </div>
      </CardHeader>
      
      <div className="relative bg-muted/20">
        {post.mediaType === 'video' ? (
          <video 
            src={post.url} 
            controls 
            className="w-full h-auto object-cover max-h-[600px]"
          />
        ) : (
          <img 
            src={post.url} 
            alt={post.caption} 
            className="w-full h-auto object-cover max-h-[600px]"
            loading="lazy"
          />
        )}
      </div>

      <CardContent className="p-4 py-2">
        <div className="flex items-center gap-4 mb-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("hover:text-red-500 transition-colors", isLiked && "text-red-500")}
            onClick={handleLike}
          >
            <Heart className={cn("h-6 w-6", isLiked && "fill-current")} />
            <span className="sr-only">Like</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-6 w-6 transform -scale-x-100" />
            <span className="sr-only">Comment</span>
          </Button>
        </div>

        <div className="font-semibold text-sm mb-1">
          {likeCount} likes
        </div>

        <div className="text-sm">
          <span className="font-semibold mr-2 cursor-pointer">{post.creator.username}</span>
          {post.caption}
        </div>
        
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs text-blue-500 cursor-pointer hover:underline">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div 
          className="text-xs text-muted-foreground mt-1 cursor-pointer hover:text-foreground transition-colors"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? 'Hide comments' : `View all ${comments.length} comments`}
        </div>
      </CardContent>

      {showComments && (
        <CardFooter className="flex-col items-start p-4 pt-0">
          <ScrollArea className="h-full max-h-[200px] w-full pr-4 mb-3">
             <div className="space-y-3 pt-2">
                {comments.map(comment => (
                    <div key={comment.id} className="flex gap-2 text-sm group">
                         <span className="font-semibold text-xs whitespace-nowrap cursor-pointer">
                            {comment.user}
                         </span>
                         <span className="text-xs flex-1">{comment.text}</span>
                         <Heart className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
             </div>
          </ScrollArea>
           
         {currentUser ? (
              <div className="flex flex-col w-full gap-2">
                  <div className="flex w-full items-center gap-2">
                     <Input 
                         placeholder="Add a comment..." 
                         className="h-8 text-xs"
                         value={commentText}
                         onChange={(e) => {
                             setCommentText(e.target.value);
                             // Clear error when user types
                             if (error) setError('');
                         }}
                         onKeyDown={handleKeyDown}
                     />
                     <Button size="icon" className="h-8 w-8" onClick={handlePostComment} disabled={!commentText.trim()}>
                         <Send className="h-3 w-3" />
                     </Button>
                  </div>
                  {error && (
                      <span className="text-xs text-red-500">{error}</span>
                  )}
              </div>
          ) : (
               <p className="text-xs text-muted-foreground mt-2 w-full text-center">Log in to comment</p>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
