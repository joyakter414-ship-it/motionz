import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Search, Edit, Trash2, Eye, Video, Folders, Package, Star, Settings, Users, HelpCircle, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AdminHeader from '@/components/AdminHeader.jsx';
import VideoFormModal from '@/components/VideoFormModal.jsx';
import VideoPreviewModal from '@/components/VideoPreviewModal.jsx';
import DeleteVideoDialog from '@/components/DeleteVideoDialog.jsx';
import CategoryManagement from '@/components/CategoryManagement.jsx';
import PackageManagement from '@/components/PackageManagement.jsx';
import ReviewManagement from '@/components/ReviewManagement.jsx';
import SettingsTab from '@/components/SettingsTab.jsx';
import TeamMemberManagement from '@/components/TeamMemberManagement.jsx';
import FAQManagement from '@/components/FAQManagement.jsx';
import ClientMessagesManagement from '@/components/ClientMessagesManagement.jsx';
import AboutMediaManagement from '@/components/AboutMediaManagement.jsx';
import pb from '@/lib/pocketbaseClient.js';

function AdminDashboard() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const records = await pb.collection('portfolio_videos').getFullList({
        sort: '-created',
        expand: 'category_id',
        $autoCancel: false
      });
      setVideos(records);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddVideo = () => {
    setSelectedVideo(null);
    setIsFormOpen(true);
  };

  const handleEditVideo = (video) => {
    setSelectedVideo(video);
    setIsFormOpen(true);
  };

  const handlePreviewVideo = (video) => {
    setSelectedVideo(video);
    setIsPreviewOpen(true);
  };

  const handleDeleteVideo = (video) => {
    setSelectedVideo(video);
    setIsDeleteOpen(true);
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.expand?.category_id?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[hsl(var(--admin-bg))] text-[hsl(var(--admin-text))]">
      <Helmet>
        <title>Admin Dashboard | MotionZ</title>
      </Helmet>

      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] mb-8 flex-wrap h-auto py-2">
            <TabsTrigger value="videos" className="data-[state=active]:bg-[hsl(var(--admin-gold))] data-[state=active]:text-[hsl(var(--admin-bg))]">
              <Video className="w-4 h-4 mr-2" /> Videos
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-[hsl(var(--admin-gold))] data-[state=active]:text-[hsl(var(--admin-bg))]">
              <Folders className="w-4 h-4 mr-2" /> Categories
            </TabsTrigger>
            <TabsTrigger value="packages" className="data-[state=active]:bg-[hsl(var(--admin-gold))] data-[state=active]:text-[hsl(var(--admin-bg))]">
              <Package className="w-4 h-4 mr-2" /> Packages
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-[hsl(var(--admin-gold))] data-[state=active]:text-[hsl(var(--admin-bg))]">
              <Star className="w-4 h-4 mr-2" /> Reviews
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-[hsl(var(--admin-gold))] data-[state=active]:text-[hsl(var(--admin-bg))]">
              <Users className="w-4 h-4 mr-2" /> Team
            </TabsTrigger>
            <TabsTrigger value="faqs" className="data-[state=active]:bg-[hsl(var(--admin-gold))] data-[state=active]:text-[hsl(var(--admin-bg))]">
              <HelpCircle className="w-4 h-4 mr-2" /> FAQs
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-[hsl(var(--admin-gold))] data-[state=active]:text-[hsl(var(--admin-bg))]">
              <MessageSquare className="w-4 h-4 mr-2" /> Messages
            </TabsTrigger>
            <TabsTrigger value="about-media" className="data-[state=active]:bg-[hsl(var(--admin-gold))] data-[state=active]:text-[hsl(var(--admin-bg))]">
              <ImageIcon className="w-4 h-4 mr-2" /> About Media
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[hsl(var(--admin-gold))] data-[state=active]:text-[hsl(var(--admin-bg))]">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--admin-text-muted))]" />
                <Input 
                  placeholder="Search videos..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] focus-visible:ring-[hsl(var(--admin-gold))]"
                />
              </div>
              <Button 
                onClick={handleAddVideo}
                className="w-full sm:w-auto bg-[hsl(var(--admin-gold))] text-[hsl(var(--admin-bg))] hover:bg-[hsl(var(--admin-gold))]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Video
              </Button>
            </div>

            <div className="bg-[hsl(var(--admin-card))] border border-[hsl(var(--admin-border))] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[hsl(var(--admin-bg))] border-b border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text-muted))]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Thumbnail</th>
                      <th className="px-6 py-4 font-medium">Title</th>
                      <th className="px-6 py-4 font-medium">Category</th>
                      <th className="px-6 py-4 font-medium">Date Added</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[hsl(var(--admin-border))]">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4"><Skeleton className="w-24 h-14 rounded-md bg-[hsl(var(--admin-border))]" /></td>
                          <td className="px-6 py-4"><Skeleton className="w-48 h-4 bg-[hsl(var(--admin-border))]" /></td>
                          <td className="px-6 py-4"><Skeleton className="w-24 h-6 rounded-full bg-[hsl(var(--admin-border))]" /></td>
                          <td className="px-6 py-4"><Skeleton className="w-24 h-4 bg-[hsl(var(--admin-border))]" /></td>
                          <td className="px-6 py-4"><Skeleton className="w-32 h-8 ml-auto bg-[hsl(var(--admin-border))]" /></td>
                        </tr>
                      ))
                    ) : filteredVideos.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-[hsl(var(--admin-text-muted))]">
                          No videos found. Click "Add New Video" to get started.
                        </td>
                      </tr>
                    ) : (
                      filteredVideos.map((video) => (
                        <tr key={video.id} className="hover:bg-[hsl(var(--admin-bg))]/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="w-24 h-14 rounded-md overflow-hidden bg-[hsl(var(--admin-bg))]">
                              <img 
                                src={pb.files.getUrl(video, video.thumbnail_image, { thumb: '100x100' })} 
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-[hsl(var(--admin-text))]">{video.title}</td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="border-[hsl(var(--admin-gold))]/30 text-[hsl(var(--admin-gold))] bg-[hsl(var(--admin-gold))]/10">
                              {video.expand?.category_id?.name || video.category}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-[hsl(var(--admin-text-muted))]">
                            {new Date(video.created).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handlePreviewVideo(video)} className="text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-border))]">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditVideo(video)} className="text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-gold))] hover:bg-[hsl(var(--admin-gold))]/10">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteVideo(video)} className="text-[hsl(var(--admin-text-muted))] hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>

          <TabsContent value="packages">
            <PackageManagement />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewManagement />
          </TabsContent>

          <TabsContent value="team">
            <TeamMemberManagement />
          </TabsContent>

          <TabsContent value="faqs">
            <FAQManagement />
          </TabsContent>

          <TabsContent value="messages">
            <ClientMessagesManagement />
          </TabsContent>

          <TabsContent value="about-media">
            <AboutMediaManagement />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>

        </Tabs>
      </main>

      <VideoFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        videoToEdit={selectedVideo}
        onSuccess={fetchVideos}
      />
      
      <VideoPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        video={selectedVideo}
      />

      <DeleteVideoDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        video={selectedVideo}
        onSuccess={fetchVideos}
      />
    </div>
  );
}

export default AdminDashboard;