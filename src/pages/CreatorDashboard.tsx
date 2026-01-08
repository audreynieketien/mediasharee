import { useState } from 'react';
import type { Post } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Upload, MapPin, Users, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Feed } from '../components/Feed';

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [myUploads, setMyUploads] = useState<Post[]>([]);

  // Form States
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  if (!user || user.role !== 'creator') {
      return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                <Info className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Creator Access Only</h2>
            <p className="text-muted-foreground text-center max-w-md">
                This dashboard is restricted to creator accounts. You are currently logged in with a different role.
            </p>
            <div className="p-4 bg-muted rounded-lg border text-sm font-mono">
                Current Role: <span className="font-bold text-primary">{user?.role || 'Guest'}</span> (ID: {user?.id})
            </div>
            <Button 
                variant="destructive" 
                onClick={() => {
                    window.location.href = '/';
                }}
            >
                Back to Home
            </Button>
        </div>
      );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadError('');
    }
  };

  const handlePublish = async () => {
      if (!file) {
        setUploadError('Please select a file to upload');
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);
      setUploadError('');

      try {
        // Create FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title || '');
        formData.append('caption', caption || '');
        formData.append('location', location || '');
        formData.append('tags', tags || '');

        // Simulate progress (in real scenario, use axios onUploadProgress)
        // Simulate progress (in real scenario, use axios onUploadProgress)
        setUploadProgress(30);
        
        // Call API
        const response = await api.uploadMedia(formData);
        
        setUploadProgress(100);

        // Add to uploads list (assuming API returns the created post)
        if (response.post) {
          setMyUploads([response.post, ...myUploads]);
        }
        
        // Reset Form
        setFile(null);
        setTitle('');
        setCaption('');
        setLocation('');
        setTags('');
        setUploadProgress(0);
        
        // Switch to History
        setActiveTab('history');
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadError('Failed to upload media. Please try again.');
        setUploadProgress(0);
      } finally {
        setIsUploading(false);
      }
  };

  return (
    <div className="space-y-6 px-4 md:px-0">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Creator Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="upload">Upload New Content</TabsTrigger>
          <TabsTrigger value="history">Upload History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Post</CardTitle>
              <CardDescription>Share your photos or videos with the world.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {uploadError && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                  {uploadError}
                </div>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Media <span className="text-red-500">*</span></Label>
                <div 
                  className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer relative"
                >
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                    <Upload className="h-10 w-10 mb-2" />
                    <p>{file ? file.name : "Drag & drop or click to upload"}</p>
                    <p className="text-xs">Supports Image and Video</p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input 
                    id="title" 
                    placeholder="Summer Vibes" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isUploading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea 
                    id="caption" 
                    placeholder="Write a caption..." 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    disabled={isUploading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="location" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Location
                    </Label>
                    <Input 
                        id="location" 
                        placeholder="e.g. Bali, Indonesia" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        disabled={isUploading}
                    />
                 </div>
                 <div className="grid gap-2">
                    <Label htmlFor="people" className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> Tag People
                    </Label>
                    <Input 
                        id="people" 
                        placeholder="@username" 
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        disabled={isUploading}
                    />
                 </div>
              </div>



              <Button 
                className="w-full" 
                onClick={handlePublish}
                disabled={isUploading || !file || !title.trim()}
              >
                {isUploading ? 'Uploading...' : 'Publish Post'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Your Past Uploads</h3>
             <Feed posts={myUploads} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

