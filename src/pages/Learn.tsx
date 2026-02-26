import { motion } from "framer-motion";
import { BookOpen, Play, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { useState } from "react";

const resources = [
  { id: "1", title: "Modern Drip Irrigation Techniques", category: "Irrigation", duration: "12 min", hasVideo: true, description: "Learn how to set up and maintain drip irrigation for maximum water efficiency." },
  { id: "2", title: "Organic Pest Control Methods", category: "Pest Control", duration: "8 min", hasVideo: true, description: "Natural ways to protect your crops without harmful chemicals." },
  { id: "3", title: "Soil Health & Testing Guide", category: "Soil Science", duration: "15 min", hasVideo: false, description: "Understanding soil pH, nutrients, and how to test your farmland." },
  { id: "4", title: "Crop Rotation Best Practices", category: "Farming", duration: "10 min", hasVideo: true, description: "Maximize yield and soil health with proper crop rotation planning." },
  { id: "5", title: "Government Subsidy Guide 2026", category: "Finance", duration: "6 min", hasVideo: false, description: "Complete guide to agricultural subsidies and how to apply." },
  { id: "6", title: "Greenhouse Farming Basics", category: "Farming", duration: "20 min", hasVideo: true, description: "Start your protected cultivation journey with this comprehensive guide." },
];

const categories = ["All", "Farming", "Irrigation", "Pest Control", "Soil Science", "Finance"];

const Learn = () => {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? resources : resources.filter((r) => r.category === filter);

  return (
    <PageLayout>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Knowledge Hub</span>
            <h1 className="text-3xl md:text-5xl font-bold mt-2 text-foreground">Learning Resources</h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Expert tutorials and guides to help you farm smarter and more efficiently.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <Button key={cat} variant={filter === cat ? "default" : "outline"} size="sm" onClick={() => setFilter(cat)}>
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow group cursor-pointer"
              >
                {item.hasVideo && (
                  <div className="w-full h-40 rounded-lg bg-secondary mb-4 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Play className="h-12 w-12 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
                  {item.category}
                </span>
                <h3 className="font-semibold text-foreground mt-3 mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {item.duration}
                  </span>
                  <Button size="sm" variant="ghost" className="text-primary">
                    {item.hasVideo ? "Watch" : "Read"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Learn;
