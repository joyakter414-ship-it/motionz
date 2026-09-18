import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PricingCard from '@/components/PricingCard.jsx';
import FAQItem from '@/components/FAQItem.jsx';
import { Accordion } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import pb from '@/lib/pocketbaseClient.js';

function PricingPage() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const records = await pb.collection('packages').getFullList({
          sort: 'price',
          $autoCancel: false
        });
        setPackages(records);
      } catch (error) {
        console.error('Error fetching pricing packages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const faqs = [
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades will apply at the start of your next billing cycle.'
    },
    {
      question: 'What happens if I need more videos than my plan allows?',
      answer: "You can purchase additional videos at a discounted rate, or upgrade to a higher tier. We're flexible and can accommodate your needs."
    },
    {
      question: 'Do you offer refunds?',
      answer: "We offer a satisfaction guarantee. If you're not happy with our work in the first month, we'll refund your payment. After that, we work on a month-to-month basis with no long-term commitment."
    },
    {
      question: 'What file formats do you deliver?',
      answer: 'We deliver in any format you need - MP4, MOV, ProRes, and more. We also provide platform-specific exports optimized for YouTube, Instagram, TikTok, etc.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pricing - Video Editing Plans | MotionZ</title>
        <meta name="description" content="Flexible video editing pricing plans. Choose the plan that fits your content creation needs." />
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
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your content creation needs. No hidden fees, cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border rounded-2xl p-8 flex flex-col h-full shadow-sm">
                  <Skeleton className="h-8 w-1/2 mb-4" />
                  <Skeleton className="h-12 w-2/3 mb-6" />
                  <div className="space-y-3 flex-grow">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-12 w-full mt-8 rounded-lg" />
                </div>
              ))
            ) : packages.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Pricing plans are currently being updated. Please check back later.
              </div>
            ) : (
              packages.map((pkg, index) => {
                const featuresList = pkg.features 
                  ? pkg.features.split('\n').filter(Boolean) 
                  : [];
                  
                return (
                  <PricingCard
                    key={pkg.id}
                    tier={pkg.name}
                    price={`$${pkg.price}`}
                    features={featuresList}
                    isPopular={index === 1} // Mark middle item as popular visually
                    index={index}
                  />
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary-foreground">Pricing FAQ</h2>
            <p className="text-xl text-muted-foreground">
              Common questions about our pricing and plans
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                value={`item-${index}`}
              />
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default PricingPage;