import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Sparkles, RotateCcw, TrendingUp, Headphones, Mail, MessageCircle } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FeatureItem from '@/components/FeatureItem.jsx';
import TestimonialCard from '@/components/TestimonialCard.jsx';
import FAQItem from '@/components/FAQItem.jsx';
import BookCallSection from '@/components/BookCallSection.jsx';
import { Button } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/hooks/useSettings.js';
import pb from '@/lib/pocketbaseClient.js';

function HomePage() {
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  
  const [faqs, setFaqs] = useState([]);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);

  const {
    settings,
    loading: settingsLoading
  } = useSettings();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const records = await pb.collection('reviews').getFullList({
          sort: '-rating,-created',
          $autoCancel: false
        });
        setReviews(records);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoadingReviews(false);
      }
    };
    
    const fetchFaqs = async () => {
      try {
        const records = await pb.collection('faqs').getList(1, 50, {
          sort: '+order',
          $autoCancel: false
        });
        setFaqs(records.items || []);
      } catch (error) {
        console.error('Error fetching faqs:', error);
      } finally {
        setIsLoadingFaqs(false);
      }
    };

    fetchReviews();
    fetchFaqs();
  }, []);

  const features = [{
    icon: Zap,
    title: 'Fast delivery',
    description: 'Get your edited videos back in 24-48 hours. We understand deadlines matter for your content schedule.'
  }, {
    icon: Sparkles,
    title: 'Professional editors',
    description: 'Work with experienced editors who understand storytelling, pacing, and what makes content engaging.'
  }, {
    icon: RotateCcw,
    title: 'Unlimited revisions',
    description: "We refine until you're completely satisfied. Your vision is our priority, no matter how many rounds it takes."
  }, {
    icon: TrendingUp,
    title: 'High retention editing',
    description: 'Specialized techniques to keep viewers watching. We optimize for engagement and watch time.'
  }, {
    icon: Headphones,
    title: 'Dedicated support',
    description: 'Direct communication with your editor. No middlemen, just clear collaboration on your projects.'
  }];

  const avatarColors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600', 'bg-pink-600', 'bg-teal-600'];
  
  const getWhatsAppLink = () => {
    if (!settings?.whatsapp_number) return '#';
    const cleanNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}`;
  };
  
  const getEmailLink = () => {
    if (!settings?.email_address) return '#';
    return `mailto:${settings.email_address}`;
  };

  return <>
      <Helmet>
        <title>MotionZ - Professional Video Editing That Grows Your Brand</title>
        <meta name="description" content="Professional video editing services for creators, businesses, and brands. Fast delivery, unlimited revisions, and high retention editing." />
      </Helmet>

      <Header />

      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground text-balance">
              Professional video editing<br />that grows your brand
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              We help creators, businesses, and brands grow through high-quality video production and editing services at affordable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.open('https://wa.me/8801518904165', '_blank')} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 active:scale-[0.98] text-lg px-8 py-6 rounded-xl shadow-lg shadow-primary/20">
                Book a free call
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-primary/20 hover:border-primary text-foreground bg-card hover:bg-card/90 transition-all duration-300 text-lg px-8 py-6 rounded-xl">
                <Link to="/portfolio">View our work</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary-foreground text-balance">About us</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trusted by creators and brands worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
            number: '7+',
            label: 'Years of experience'
          }, {
            number: '2,847',
            label: 'Videos delivered'
          }, {
            number: '97.3%',
            label: 'Client satisfaction'
          }].map((stat, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} className="text-center bg-card shadow-sm rounded-2xl p-8 border border-border">
                <div className="text-5xl md:text-6xl font-bold text-primary mb-2 tabular-nums">{stat.number}</div>
                <div className="text-lg text-card-foreground font-medium">{stat.label}</div>
              </motion.div>)}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Why choose us</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine speed, quality, expertise, and affordability to deliver outstanding results every time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {features.map((feature, index) => <FeatureItem key={index} icon={feature.icon} title={feature.title} description={feature.description} index={index} />)}
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary-foreground text-balance">What our clients say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real feedback from creators and brands we've worked with
            </p>
          </motion.div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {isLoadingReviews ? Array.from({
            length: 6
          }).map((_, i) => <div key={i} className="mb-6 bg-card rounded-2xl p-6 border border-border shadow-sm break-inside-avoid">
                  <div className="flex gap-1 mb-4">
                    {Array.from({
                length: 5
              }).map((_, j) => <Skeleton key={j} className="w-4 h-4 rounded-full" />)}
                  </div>
                  <Skeleton className="w-full h-4 mb-2" />
                  <Skeleton className="w-full h-4 mb-2" />
                  <Skeleton className="w-2/3 h-4 mb-6" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="w-24 h-4 mb-1" />
                      <Skeleton className="w-16 h-3" />
                    </div>
                  </div>
                </div>) : reviews.length === 0 ? <div className="col-span-full text-center py-12 text-muted-foreground break-inside-avoid">
                No testimonials available at the moment.
              </div> : reviews.map((review, index) => {
            const colorIndex = index % avatarColors.length;
            return <TestimonialCard key={review.id} name={review.client_name} company={review.client_company} review={review.review_text} rating={review.rating} photo={review.client_photo ? pb.files.getUrl(review, review.client_photo, {
              thumb: '100x100'
            }) : null} initials={review.client_name.substring(0, 2).toUpperCase()} color={avatarColors[colorIndex]} index={index} />;
          })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Frequently asked questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our services
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
                <FAQItem key={faq.id} question={faq.question} answer={faq.answer} value={`item-${index}`} />
              ))}
            </Accordion>
          )}
        </div>
      </section>

      <BookCallSection />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Get in touch</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Ready to start your next project? Reach out and let's discuss how we can help
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {!settingsLoading && settings?.email_address && <motion.a href={getEmailLink()} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }} className="flex flex-col items-center gap-4 p-8 bg-card border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Mail className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg mb-1 text-card-foreground">Email</p>
                  <p className="text-muted-foreground">{settings.email_address}</p>
                </div>
              </motion.a>}

            {!settingsLoading && settings?.whatsapp_number && <motion.a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} className="flex flex-col items-center gap-4 p-8 bg-card border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg mb-1 text-card-foreground">WhatsApp</p>
                  <p className="text-muted-foreground">{settings.whatsapp_number}</p>
                </div>
              </motion.a>}
          </div>
        </div>
      </section>

      <Footer />
    </>;
}
export default HomePage;