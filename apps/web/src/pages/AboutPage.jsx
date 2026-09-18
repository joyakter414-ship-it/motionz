import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Target, Users, Award, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import pb from '@/lib/pocketbaseClient.js';

function AboutPage() {
  const [mediaRecord, setMediaRecord] = useState(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const result = await pb.collection('about_media').getList(1, 1, { $autoCancel: false });
        if (result.items.length > 0) {
          setMediaRecord(result.items[0]);
        }
      } catch (error) {
        console.error('Error fetching about media:', error);
      } finally {
        setIsLoadingMedia(false);
      }
    };

    fetchMedia();
  }, []);

  const values = [{
    icon: Target,
    title: 'Quality first',
    description: 'We never compromise on quality. Every frame matters, and we treat your content as if it were our own.'
  }, {
    icon: Users,
    title: 'Collaboration',
    description: 'Your vision drives our work. We believe in transparent communication and working closely with our clients.'
  }, {
    icon: Award,
    title: 'Excellence',
    description: 'We stay ahead of trends, master new techniques, and continuously improve our craft to deliver exceptional results.'
  }, {
    icon: Heart,
    title: 'Passion',
    description: "We love what we do. Video editing is not just our job - it's our passion, and it shows in every project."
  }];

  return <>
      <Helmet>
        <title>About Us - Professional Video Editing Team | MotionZ</title>
        <meta name="description" content="Learn about MotionZ's mission, values, and the experienced team behind professional video editing services." />
      </Helmet>

      <Header />

      <section className="pt-32 pb-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-secondary-foreground">
              About MotionZ
            </h1>
            <p className="text-xl text-muted-foreground">
              We're a team of passionate video editors dedicated to helping creators and brands tell their stories
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Our story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Our journey began in 2019 with a small group of passionate video editors who shared a simple vision: making high-quality video editing accessible to everyone.

We noticed that many new creators, growing brands, businesses, and individuals struggled to find professional video editing services at affordable prices. High costs often prevented talented people from bringing their ideas to life.
                </p>
                <p>
                  What started as a small team working out of a home studio has grown into a full-service video editing agency serving clients worldwide. We've edited thousands of videos across every platform and format imaginable.
                </p>
                <p>
                  Our mission is to provide high-quality video editing, reliable customer support, and a smooth client experience without the premium price tag. Whether you’re a content creator, entrepreneur, brand, or someone with a story to tell, we’re here to help transform your vision into engaging videos.

Today, MotionZ continues to combine creativity, quality, affordability, and dedicated customer service to help clients grow and succeed through powerful visual storytelling.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }} className="grid grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">7+</div>
                <div className="text-muted-foreground">Years in business</div>
              </div>
              <div className="bg-card rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">2,847</div>
                <div className="text-muted-foreground">Videos delivered</div>
              </div>
              <div className="bg-card rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">97.3%</div>
                <div className="text-muted-foreground">Client satisfaction</div>
              </div>
              <div className="bg-card rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">24-48h</div>
                <div className="text-muted-foreground">Average turnaround</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dynamic Media Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {isLoadingMedia ? (
              <>
                <Skeleton className="w-full aspect-video rounded-2xl" />
                <Skeleton className="w-full aspect-video rounded-2xl" />
              </>
            ) : (
              <>
                {mediaRecord?.image ? (
                  <div className="rounded-2xl overflow-hidden shadow-lg border border-border aspect-video bg-muted">
                    <img 
                      src={pb.files.getUrl(mediaRecord, mediaRecord.image)} 
                      alt="MotionZ Team" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl overflow-hidden shadow-sm border border-border aspect-video bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">No image available</p>
                  </div>
                )}

                {mediaRecord?.video ? (
                  <div className="rounded-2xl overflow-hidden shadow-lg border border-border aspect-video bg-black">
                    <video 
                      src={pb.files.getUrl(mediaRecord, mediaRecord.video)} 
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl overflow-hidden shadow-sm border border-border aspect-video bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">No video available</p>
                  </div>
                )}
              </>
            )}
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary-foreground">Our values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => <motion.div key={index} initial={{
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
          }} className="bg-card rounded-2xl p-8">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-card-foreground">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
        }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to work together?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's discuss your video editing needs and how we can help bring your vision to life
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-accent transition-all duration-300 hover:blue-glow-strong active:scale-[0.98] text-lg px-8 py-6">
              <Link to="/contact">Book a free call</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>;
}
export default AboutPage;