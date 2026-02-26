import { motion } from "framer-motion";
import { TrendingUp, Users, ShieldCheck, BookOpen, Bot, Truck } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "AI Price Prediction",
    description: "Get accurate crop price forecasts powered by machine learning to sell at the best time.",
  },
  {
    icon: Users,
    title: "Group Buying",
    description: "Join forces with fellow farmers to buy seeds, fertilizers and equipment at bulk discounts.",
  },
  {
    icon: ShieldCheck,
    title: "Video Verification",
    description: "Build trust with verified farm profiles through our simple video verification process.",
  },
  {
    icon: BookOpen,
    title: "Learning Hub",
    description: "Access expert tutorials, farming techniques, and best practices in your language.",
  },
  {
    icon: Bot,
    title: "AI Chatbot Assistant",
    description: "Get instant answers to farming questions with our intelligent agricultural assistant.",
  },
  {
    icon: Truck,
    title: "Direct Market Access",
    description: "Connect directly with vendors and buyers, cutting out middlemen for better profits.",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-foreground">
            Everything You Need to Farm Smarter
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            KrishiMitra brings cutting-edge technology to agriculture, helping farmers increase productivity and profitability.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group p-8 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 shadow-card hover:shadow-elevated"
            >
              <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
