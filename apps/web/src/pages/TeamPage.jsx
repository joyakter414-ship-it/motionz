import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import TeamMemberCard from '@/components/TeamMemberCard.jsx';
import pb from '@/lib/pocketbaseClient.js';

function TeamPage() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const records = await pb.collection('team_members').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setMembers(records);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError('Failed to load team members. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Our Team | MotionZ</title>
        <meta name="description" content="Meet the creative minds behind MotionZ. Our team of expert video editors and creators." />
      </Helmet>

      <Header />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            >
              Meet the <span className="text-primary">MotionZ</span> Team
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              We are a collective of passionate creators, editors, and storytellers dedicated to bringing your vision to life through exceptional video content.
            </motion.p>
          </div>

          {/* Content Area */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden h-[400px] flex flex-col">
                  <Skeleton className="h-48 w-full rounded-none" />
                  <div className="p-6 flex-1 flex flex-col">
                    <Skeleton className="w-24 h-24 rounded-xl -mt-16 mb-4 border-4 border-card" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-2xl border border-border">
              <AlertCircle className="w-16 h-16 text-destructive mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Oops! Something went wrong</h3>
              <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
              <Button onClick={fetchMembers} variant="outline">Try Again</Button>
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-2xl border border-border">
              <Users className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No team members yet</h3>
              <p className="text-muted-foreground">Check back later to meet our growing team.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TeamMemberCard member={member} />
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default TeamPage;