import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Wheat Farmer, Punjab",
    quote: "KrishiMitra's price prediction helped me sell my wheat at 15% higher prices. The group buying saved me ₹20,000 on fertilizers!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Organic Farmer, Maharashtra",
    quote: "The verification system gave buyers confidence in my organic produce. My sales doubled within 3 months of joining.",
    rating: 5,
  },
  {
    name: "Anil Patel",
    role: "Rice Farmer, Gujarat",
    quote: "Learning hub tutorials taught me modern irrigation techniques. I reduced water usage by 30% and increased my yield significantly.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-foreground">
            Trusted by Thousands of Farmers
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="p-8 rounded-xl bg-card border border-border shadow-card relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground/80 mb-6 text-sm leading-relaxed italic">
                "{t.quote}"
              </p>
              <div>
                <div className="font-semibold text-foreground">{t.name}</div>
                <div className="text-muted-foreground text-sm">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
