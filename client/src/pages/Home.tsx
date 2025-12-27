import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Activity, Clock, ShieldCheck, Truck, Microscope, Upload, Star } from "lucide-react";
import { useTests } from "@/hooks/use-tests";
import { usePackages } from "@/hooks/use-packages";
import { useReviews } from "@/hooks/use-reviews";
import { TestCard } from "@/components/TestCard";
import { PackageCard } from "@/components/PackageCard";
import { PrescriptionUpload } from "@/components/PrescriptionUpload";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import video1 from "@assets/generated_videos/high-tech_blood_analysis_machine.mp4";
import video2 from "@assets/generated_videos/medical_laboratory_scientists_at_work.mp4";
import video3 from "@assets/generated_videos/medical_professional_collecting_blood_sample.mp4";
import video4 from "@assets/generated_videos/scientist_looking_through_microscope_lab.mp4";

const HERO_SLIDES = [
  {
    video: video1,
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=2070",
    title: "Your Health,",
    subtitle: "Our Priority",
    description: "Experience world-class diagnostic services with accurate results and state-of-the-art technology."
  },
  {
    video: video2,
    image: "https://images.unsplash.com/photo-1581595221445-262de1ef92c1?auto=format&fit=crop&q=80&w=2070",
    title: "Advanced",
    subtitle: "Diagnostics",
    description: "Precision in every report. Our laboratory is equipped with the latest medical technology."
  },
  {
    video: video3,
    image: "https://images.unsplash.com/photo-1531053326607-9d349096d887?auto=format&fit=crop&q=80&w=2070",
    title: "Home",
    subtitle: "Collection",
    description: "Safe and hygienic sample collection from the comfort of your home at no extra cost."
  },
  {
    video: video4,
    image: "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?auto=format&fit=crop&q=80&w=2070",
    title: "Reliable",
    subtitle: "Care",
    description: "Trusted by thousands for accurate medical reports and compassionate patient care."
  }
];

export default function Home() {
  const { data: tests } = useTests();
  const { data: packages } = usePackages();
  const { data: reviews } = useReviews();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featuredPackages = packages?.filter(p => p.isFeatured) || [];
  const popularTests = tests?.filter(t => t.isPopular) || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center overflow-hidden">
        {/* Hero Slider */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={HERO_SLIDES[currentSlide].image}
              className="w-full h-full object-cover"
            >
              <source src={HERO_SLIDES[currentSlide].video} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/60 to-transparent"></div>
          </motion.div>
        </AnimatePresence>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div 
            key={currentSlide + "-content"}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm text-blue-100 font-semibold text-sm mb-6">
              Leading Pathology Lab
            </span>
            <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-tight mb-6">
              {HERO_SLIDES[currentSlide].title} <br/>
              <span className="text-blue-300">{HERO_SLIDES[currentSlide].subtitle}</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed max-w-lg">
              {HERO_SLIDES[currentSlide].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/tests">
                <Button size="lg" className="text-lg px-8 h-14 rounded-xl shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform bg-white text-blue-900 hover:bg-blue-50">
                  Book a Test
                </Button>
              </Link>
              <PrescriptionUpload>
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-xl border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                  Upload Prescription
                  <Upload className="ml-2 h-5 w-5" />
                </Button>
              </PrescriptionUpload>
            </div>
          </motion.div>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === i ? "bg-white w-8" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Features */}
      <section className="py-12 md:py-20 -mt-20 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-start border border-blue-50"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                <Truck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-3 text-foreground">Free Home Collection</h3>
              <p className="text-muted-foreground mb-4">We collect samples from your doorstep at no extra cost. Safe & hygienic.</p>
              <Link href="/contact" className="text-primary font-bold hover:underline inline-flex items-center">
                Book Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-primary p-8 rounded-3xl shadow-xl shadow-primary/20 flex flex-col items-start text-white"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm">
                <Microscope className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-3">Accurate Reports</h3>
              <p className="text-blue-100 mb-4">State-of-the-art laboratory ensuring 100% accurate results every time.</p>
              <Link href="/about" className="text-white font-bold hover:underline inline-flex items-center">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-start border border-blue-50"
            >
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                <ShieldCheck className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-3 text-foreground">Trusted by Doctors</h3>
              <p className="text-muted-foreground mb-4">Recommended by leading specialists for our precision and timely reports.</p>
              <Link href="/reviews" className="text-primary font-bold hover:underline inline-flex items-center">
                See Reviews <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             {[
               { num: "1000+", label: "Tests Available" },
               { num: "50+", label: "Health Packages" },
               { num: "5000+", label: "Happy Patients" },
               { num: "15+", label: "Years Experience" }
             ].map((stat, i) => (
               <div key={i} className="flex flex-col items-center">
                 <span className="font-display font-black text-4xl md:text-5xl text-primary mb-2">{stat.num}</span>
                 <span className="font-medium text-muted-foreground uppercase tracking-wider text-sm">{stat.label}</span>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-bold tracking-wider uppercase text-sm">Our Best Offers</span>
            <h2 className="font-display font-bold text-4xl mt-3 mb-6">Featured Health Packages</h2>
            <p className="text-muted-foreground text-lg">Comprehensive health checkups designed for your specific needs at affordable prices.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/packages">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
                View All Packages <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Tests */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
             <div className="max-w-2xl">
              <span className="text-primary font-bold tracking-wider uppercase text-sm">Most Booked</span>
              <h2 className="font-display font-bold text-4xl mt-3">Popular Diagnostic Tests</h2>
             </div>
             <Link href="/tests">
               <Button variant="ghost" className="text-primary font-bold">View All Tests &rarr;</Button>
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
           <div className="text-center mb-16">
             <h2 className="font-display font-bold text-4xl mb-4">What Our Patients Say</h2>
             <p className="text-muted-foreground">Real reviews from our valued customers.</p>
           </div>
           
           <Carousel className="w-full max-w-5xl mx-auto">
             <CarouselContent>
               {reviews?.map((review) => (
                 <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                   <div className="p-2">
                     <Card className="border-0 shadow-lg bg-slate-50/50">
                       <CardContent className="flex flex-col items-center text-center p-8">
                         <div className="flex gap-1 mb-4">
                           {Array(review.rating).fill(0).map((_, i) => (
                             <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                           ))}
                         </div>
                         <p className="italic text-muted-foreground mb-6">"{review.comment}"</p>
                         <Avatar className="w-12 h-12 mb-3 border-2 border-white shadow-sm">
                           <AvatarFallback className="bg-primary/10 text-primary font-bold">
                             {review.name.substring(0,2).toUpperCase()}
                           </AvatarFallback>
                         </Avatar>
                         <h4 className="font-bold">{review.name}</h4>
                         <span className="text-xs text-muted-foreground">{review.date}</span>
                       </CardContent>
                     </Card>
                   </div>
                 </CarouselItem>
               ))}
             </CarouselContent>
             <CarouselPrevious />
             <CarouselNext />
           </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white overflow-hidden relative">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">Ready to prioritize your health?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Book your test today and get accurate results delivered to your phone.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link href="/tests">
               <Button size="lg" className="bg-white text-primary hover:bg-blue-50 h-14 px-8 text-lg font-bold shadow-lg">Book Now</Button>
             </Link>
             <Link href="/contact">
               <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-14 px-8 text-lg font-bold">Contact Us</Button>
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
