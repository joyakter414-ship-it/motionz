import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Sparkles, 
  RotateCcw, 
  TrendingUp, 
  Headphones, 
  Mail, 
  MessageCircle, 
  ArrowRight,
  Play,
  Film,
  Users,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FeatureItem from '@/components/FeatureItem.jsx';
import TestimonialCard from '@/components/TestimonialCard.jsx';
import FAQItem from '@/components/FAQItem.jsx';
import BookCallSection from '@/components/BookCallSection.jsx';
import PortfolioCard from '@/components/PortfolioCard.jsx';
import PricingCard from '@/components/PricingCard.jsx';
import TeamMemberCard from '@/components/TeamMemberCard.jsx';
import VideoPlayerModal from '@/components/VideoPlayerModal.jsx';
import { Button } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/hooks/useSettings.js';
import pb from '@/lib/pocketbaseClient.js';

function HomePage() {
  // Video Modal State
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Portfolio Videos State
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  // Pricing Packages State
  const [packages, setPackages] = useState([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);

  // Team Members State
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  
  // FAQs State
  const [faqs, setFaqs] = useState([]);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);

  const { settings, loading: settingsLoading } = useSettings();

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Categories
      try {
        const catRecords = await pb.collection('categories').getFullList({
          sort: 'name',
          $autoCancel: false
        });
        setCategories(catRecords);
      } catch (e) {
        console.error('Error fetching categories:', e);
      }

      // 2. Fetch Portfolio Videos
      try {
        const videoRecords = await pb.collection('portfolio_videos').getFullList({
          sort: '-created',
          expand: 'category_id',
          $autoCancel: false
        });
        setVideos(videoRecords);
      } catch (e) {
        console.error('Error fetching videos:', e);
      } finally {
        setIsLoadingVideos(false);
      }

      // 3. Fetch Pricing Packages
      try {
        const pkgRecords = await pb.collection('packages').getFullList({
          sort: 'price',
          $autoCancel: false
        });
        setPackages(pkgRecords);
      } catch (e) {
        console.error('Error fetching packages:', e);
      } finally {
        setIsLoadingPackages(false);
      }

      // 4. Fetch Team Members
      try {
        const teamRecords = await pb.collection('team_members').getFullList({
          sort: '-created',
          $autoCancel: false
        });
        setTeamMembers(teamRecords);
      } catch (e) {
        console.error('Error fetching team:', e);
      } finally {
        setIsLoadingTeam(false);
      }

      // 5. Fetch Reviews
      try {
        const revRecords = await pb.collection('reviews').getFullList({
          sort: '-rating,-created',
          $autoCancel: false
        });
        setReviews(revRecords);
      } catch (e) {
        console.error('Error fetching reviews:', e);
      } finally {
        setIsLoadingReviews(false);
      }
      
      // 6. Fetch FAQs
      try {
        const faqRecords = await pb.collection('faqs').getList(1, 50, {
          sort: '+order',
          $autoCancel: false
        });
        setFaqs(faqRecords.items || []);
      } catch (e) {
        console.error('Error fetching faqs:', e);
      } finally {
        setIsLoadingFaqs(false);
      }
    };

    fetchData();
  }, []);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const filteredVideos = activeCategory === 'all' 
    ? videos 
    : videos.filter(video => 
        video.category_id === activeCategory || 
        video.expand?.category_id?.id === activeCategory ||
        video.category === activeCategory
      );

  const displayedVideos = filteredVideos.slice(0, 6);

  const features = [
    {
      icon: Zap,
      title: 'Fast delivery',
      description: 'Get your edited videos back in 24-48 hours. We understand deadlines matter for your content schedule.'
    }, 
    {
      icon: Sparkles,
      title: 'Professional editors',
      description: 'Work with experienced editors who understand storytelling, pacing, and what makes content engaging.'
    }, 
    {
      icon: RotateCcw,
      title: 'Unlimited revisions',
      description: "We refine until you're completely satisfied. Your vision is our priority, no matter how many rounds it takes."
    }, 
    {
      icon: TrendingUp,
      title: 'High retention editing',
      description: 'Specialized techniques to keep viewers watching. We optimize for engagement and watch time.'
    }, 
    {
      icon: Headphones,
      title: 'Dedicated support',
      description: 'Direct communication with your editor. No middlemen, just clear collaboration on your projects.'
    }
  ];

  const avatarColors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600', 'bg-pink-600', 'bg-teal-600'];
  
  const getWhatsAppLink = () => {
    const rawNumber = settings?.whatsapp_number || '+8801518904165';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}`;
  };
  
  const getEmailLink = () => {
    const email = settings?.email_address || 'motionz.studio.team@gmail.com';
    return `mailto:${email}`;
  };

  return (
    <>
      <Helmet>
        <title>MotionZ - Professional Video Editing That Grows Your Brand | motionz.pro</title>
        <meta name="description" content="MotionZ (motionz.pro) is a premier video editing agency. We produce high-retention short form videos, YouTube edits, podcasts, real estate videos, and motion graphics with fast 24-48h turnaround." />
        <link rel="canonical" href="https://motionz.pro/" />
      </Helmet>

      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Premium Video Editing Agency &bull; motionz.pro</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground text-balance">
              Professional video editing<br />that grows your brand
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              We help creators, businesses, and brands scale through high-retention video production, captivating motion design, and seamless storytelling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open(getWhatsAppLink(), '_blank')} 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 active:scale-[0.98] text-lg px-8 py-6 rounded-xl shadow-lg shadow-primary/20"
              >
                Book a free call
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-2 border-primary/20 hover:border-primary text-foreground bg-card hover:bg-card/90 transition-all duration-300 text-lg px-8 py-6 rounded-xl"
              >
                <Link to="/portfolio">View our work</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PORTFOLIO VIDEOS SHOWCASE SECTION */}
      <section className="py-24 bg-card/40 border-y border-border" id="portfolio-showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-3">
                <Film className="w-4 h-4" />
                <span>OUR WORK</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Featured Portfolio</h2>
              <p className="text-lg text-muted-foreground mt-2 max-w-xl">
                Explore our high-converting video edits across short-form, podcasts, real estate, and motion graphics.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0 border-primary/30 text-primary hover:bg-primary/10">
              <Link to="/portfolio" className="inline-flex items-center gap-2">
                <span>View all 30+ projects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2">
              <Button
                variant={activeCategory === 'all' ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setActiveCategory('all')}
                className={`rounded-full px-5 ${activeCategory === 'all' ? 'bg-primary text-primary-foreground' : ''}`}
              >
                All Works
              </Button>
              {categories.slice(0, 6).map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-5 ${activeCategory === cat.id ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          )}

          {/* Videos Grid */}
          {isLoadingVideos ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedVideos.length === 0 ? (
            <div className="text-center py-16 bg-muted/20 rounded-2xl border border-border">
              <Film className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground text-lg">No videos found for this category.</p>
              <Button onClick={() => setActiveCategory('all')} variant="link" className="mt-2 text-primary">
                View all projects
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedVideos.map((video, index) => (
                <PortfolioCard 
                  key={video.id} 
                  video={video} 
                  index={index} 
                  onClick={handleVideoClick} 
                />
              ))}
            </div>
          )}

          {/* Call-to-action bar */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-background to-primary/10 border border-primary/20 text-center flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="text-xl font-bold text-foreground">Want custom edits tailored to your brand style?</h3>
              <p className="text-muted-foreground text-sm mt-1">We create sample videos for serious creators and businesses.</p>
            </div>
            <div className="flex gap-3">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/portfolio">Explore Full Portfolio</Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open(getWhatsAppLink(), '_blank')}
                className="border-primary/40 text-primary hover:bg-primary/10"
              >
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Why choose us</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine speed, quality, expertise, and affordability to deliver outstanding results every time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <FeatureItem 
                key={index} 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description} 
                index={index} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PLANS SECTION */}
      <section className="py-24 bg-secondary/50 border-t border-border" id="pricing-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-3">
              <DollarSign className="w-4 h-4" />
              <span>TRANSPARENT PRICING</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary-foreground text-balance">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your content creation needs. No hidden fees, cancel anytime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {isLoadingPackages ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border rounded-2xl p-8 flex flex-col h-full shadow-sm">
                  <Skeleton className="h-8 w-1/2 mb-4" />
                  <Skeleton className="h-12 w-2/3 mb-6" />
                  <div className="space-y-3 flex-grow">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-12 w-full mt-8 rounded-lg" />
                </div>
              ))
            ) : packages.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Pricing plans are currently being updated. Please check back later.
              </div>
            ) : (
              packages
                .filter(pkg => pkg.price > 10) // Filter out tiny sample test pkg
                .slice(0, 3)
                .map((pkg, index) => {
                  const featuresList = pkg.features 
                    ? pkg.features.split('\n').filter(Boolean) 
                    : [];
                  
                  // Mark the AI Workflow / middle package as popular
                  const isPopular = pkg.name.toLowerCase().includes('ai') || index === 1;

                  return (
                    <PricingCard
                      key={pkg.id}
                      tier={pkg.name}
                      price={`$${pkg.price}`}
                      features={featuresList}
                      isPopular={isPopular}
                      index={index}
                      onSelect={() => window.open(getWhatsAppLink(), '_blank')}
                    />
                  );
                })
            )}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
              <Link to="/pricing" className="inline-flex items-center gap-2">
                <span>View all pricing tiers &amp; customization details</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground text-balance">Proven Track Record</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trusted by creators, influencers, and brands worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '7+', label: 'Years of experience' },
              { number: '2,847', label: 'Videos delivered' },
              { number: '97.3%', label: 'Client satisfaction' }
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: index * 0.1 }} 
                className="text-center bg-background shadow-sm rounded-2xl p-8 border border-border"
              >
                <div className="text-5xl md:text-6xl font-bold text-primary mb-2 tabular-nums">{stat.number}</div>
                <div className="text-lg text-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MEET OUR TEAM SECTION */}
      <section className="py-24 bg-secondary/30 border-t border-border" id="team-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-3">
                <Users className="w-4 h-4" />
                <span>EXPERT EDITORS</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Meet Our Creative Team</h2>
              <p className="text-lg text-muted-foreground mt-2 max-w-xl">
                The talented creators, editors, and storytellers behind your video productions.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0 border-primary/30 text-primary hover:bg-primary/10">
              <Link to="/team" className="inline-flex items-center gap-2">
                <span>Meet all team members</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {isLoadingTeam ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden h-[380px] flex flex-col">
                  <Skeleton className="h-44 w-full" />
                  <div className="p-6 flex-1 flex flex-col space-y-3">
                    <Skeleton className="w-20 h-20 rounded-xl -mt-14 border-4 border-card" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No team members listed at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.slice(0, 3).map((member, index) => (
                <motion.div 
                  key={member.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TeamMemberCard member={member} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
              <Link to="/team">View All 8 Team Members &amp; Roles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CLIENT TESTIMONIALS */}
      <section className="py-24 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground text-balance">What our clients say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real feedback from creators and brands we've worked with
            </p>
          </motion.div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {isLoadingReviews ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="mb-6 bg-background rounded-2xl p-6 border border-border shadow-sm break-inside-avoid">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="w-4 h-4 rounded-full" />
                    ))}
                  </div>
                  <Skeleton className="w-full h-4 mb-2" />
                  <Skeleton className="w-full h-4 mb-2" />
                  <Skeleton className="w-2/3 h-4 mb-6" />
                </div>
              ))
            ) : reviews.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground break-inside-avoid">
                No testimonials available at the moment.
              </div>
            ) : (
              reviews.map((review, index) => {
                const colorIndex = index % avatarColors.length;
                return (
                  <TestimonialCard 
                    key={review.id} 
                    name={review.client_name} 
                    company={review.client_company} 
                    review={review.review_text} 
                    rating={review.rating} 
                    photo={review.client_photo ? pb.files.getUrl(review, review.client_photo, { thumb: '100x100' }) : null} 
                    initials={review.client_name ? review.client_name.substring(0, 2).toUpperCase() : 'CL'} 
                    color={avatarColors[colorIndex]} 
                    index={index} 
                  />
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Frequently asked questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our services and process
            </p>
          </motion.div>

          {isLoadingFaqs ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="w-full h-16 rounded-lg" />
              ))}
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-border rounded-xl">
              No FAQs available at the moment.
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={faq.id || index} question={faq.question} answer={faq.answer} value={`item-${index}`} />
              ))}
            </Accordion>
          )}
        </div>
      </section>

      {/* BOOK CALL BANNER */}
      <BookCallSection />

      {/* GET IN TOUCH */}
      <section className="py-24 bg-card/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Get in touch</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Ready to start your next video project? Reach out directly via WhatsApp or Email
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <motion.a 
              href={getEmailLink()} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5, delay: 0.1 }} 
              className="flex flex-col items-center gap-4 p-8 bg-card border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Mail className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg mb-1 text-card-foreground">Email</p>
                <p className="text-muted-foreground">{settings?.email_address || 'motionz.studio.team@gmail.com'}</p>
              </div>
            </motion.a>

            <motion.a 
              href={getWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer" 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5, delay: 0.2 }} 
              className="flex flex-col items-center gap-4 p-8 bg-card border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg mb-1 text-card-foreground">WhatsApp</p>
                <p className="text-muted-foreground">{settings?.whatsapp_number || '+8801518904165'}</p>
              </div>
            </motion.a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Video Player Modal for Playback */}
      <VideoPlayerModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVideo(null);
        }}
      />
    </>
  );
}

export default HomePage;