import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "./button";
import GlassCard from "./GlassCard";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
  image?: string | null;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  autoplayDelay?: number;
}

const TestimonialsCarousel = ({ 
  testimonials, 
  autoplayDelay = 5000 
}: TestimonialsCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: "center",
      skipSnaps: false,
    },
    [
      Autoplay({ 
        delay: autoplayDelay, 
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      })
    ]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* Main Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 px-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: selectedIndex === index ? 1 : 0.95,
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <GlassCard className="h-full relative overflow-hidden group">
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote size={48} className="text-primary" />
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <Star
                          size={18}
                          className={`${
                            i < testimonial.rating
                              ? "text-primary fill-primary"
                              : "text-muted-foreground"
                          } transition-colors`}
                        />
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-foreground mb-6 italic leading-relaxed relative z-10">
                    "{testimonial.quote}"
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-4 mt-auto">
                    {testimonial.image ? (
                      <motion.div 
                        className="w-12 h-12 rounded-full overflow-hidden shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.author}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {testimonial.author.charAt(0)}
                      </motion.div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.author}</p>
                      <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollPrev}
          className="rounded-full border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
        >
          <ChevronLeft size={20} />
        </Button>
        
        {/* Dots Indicator */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                selectedIndex === index
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          className="rounded-full border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 max-w-xs mx-auto">
        <div className="h-1 bg-muted-foreground/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: "0%" }}
            animate={{ 
              width: `${((selectedIndex + 1) / testimonials.length) * 100}%` 
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
