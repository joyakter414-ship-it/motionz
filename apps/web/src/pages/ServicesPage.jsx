import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Video, Film, Mic, Sparkles, Palette, Image } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ServiceCard from '@/components/ServiceCard.jsx';

function ServicesPage() {
  const services = [
    {
      icon: Video,
      title: 'Short form video editing',
      description: 'Optimized editing for TikTok, Instagram Reels, and YouTube Shorts. Fast-paced cuts, trending effects, and hooks that stop the scroll.'
    },
    {
      icon: Film,
      title: 'Long form YouTube editing',
      description: 'Complete YouTube video production from intro to outro. Pacing, B-roll integration, graphics, and retention-focused editing techniques.'
    },
    {
      icon: Mic,
      title: 'Podcast editing',
      description: 'Professional audio cleanup, video syncing, dynamic visuals, and chapter markers. Make your podcast look and sound polished.'
    },
    {
      icon: Sparkles,
      title: 'Motion graphics',
      description: 'Custom animations, lower thirds, transitions, and visual effects that elevate your content and reinforce your brand identity.'
    },
    {
      icon: Palette,
      title: 'Color grading',
      description: 'Cinematic color correction and grading that gives your videos a professional, cohesive look across all your content.'
    },
    {
      icon: Image,
      title: 'Thumbnail design',
      description: 'Eye-catching thumbnails designed to maximize click-through rates. A/B testing support and platform-specific optimization.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Our Services - Professional Video Editing | MotionZ</title>
        <meta name="description" content="Comprehensive video editing services including short form, long form, podcasts, motion graphics, color grading, and thumbnail design." />
      </Helmet>

      <Header />

      <section className="pt-32 pb-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-secondary-foreground">
              Our services
            </h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive video editing solutions tailored to your content needs
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary-foreground">
              Not sure which service you need?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Book a free consultation and we'll help you determine the best approach for your content goals
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default ServicesPage;