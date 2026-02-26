import { motion } from "framer-motion";
import { UserPlus, Search, ShoppingCart, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up as a farmer or vendor in just a few minutes.",
  },
  {
    icon: Search,
    title: "Explore Tools",
    description: "Access AI predictions, group buys, and learning resources.",
  },
  {
    icon: ShoppingCart,
    title: "Save & Earn More",
    description: "Buy in bulk, sell at the right price, and grow your profits.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your savings, orders, and farm verification status.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-foreground">
            Get Started in 4 Simple Steps
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-primary/20" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="h-24 w-24 rounded-full bg-card border-4 border-primary/20 flex items-center justify-center mx-auto mb-5 relative z-10">
                <step.icon className="h-10 w-10 text-primary" />
                <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
