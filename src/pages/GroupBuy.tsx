import { motion } from "framer-motion";
import { Users, Clock, ShoppingBag, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PageLayout from "@/components/PageLayout";

const groupBuys = [
  { id: "1", title: "Organic Fertilizer - Bulk Order", category: "Fertilizer", price: 450, targetQty: 500, currentQty: 320, deadline: "2026-03-15", participants: 24 },
  { id: "2", title: "Drip Irrigation Kit", category: "Equipment", price: 2800, targetQty: 100, currentQty: 67, deadline: "2026-03-20", participants: 67 },
  { id: "3", title: "Hybrid Wheat Seeds (10kg)", category: "Seeds", price: 1200, targetQty: 300, currentQty: 280, deadline: "2026-03-10", participants: 45 },
  { id: "4", title: "Solar Water Pump", category: "Equipment", price: 15000, targetQty: 50, currentQty: 18, deadline: "2026-04-01", participants: 18 },
  { id: "5", title: "Neem Pesticide - 5L", category: "Pesticide", price: 380, targetQty: 400, currentQty: 350, deadline: "2026-03-08", participants: 52 },
  { id: "6", title: "Bio Compost Pack", category: "Fertilizer", price: 250, targetQty: 600, currentQty: 150, deadline: "2026-04-15", participants: 30 },
];

const categories = ["All", "Seeds", "Fertilizer", "Equipment", "Pesticide"];

import { useState } from "react";

const GroupBuy = () => {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? groupBuys : groupBuys.filter((g) => g.category === filter);

  return (
    <PageLayout>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Save Together</span>
            <h1 className="text-3xl md:text-5xl font-bold mt-2 text-foreground">Group Buying</h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Join other farmers to buy seeds, fertilizers, and equipment at bulk discount prices.
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
            {filtered.map((item, i) => {
              const progress = (item.currentQty / item.targetQty) * 100;
              const daysLeft = Math.max(0, Math.ceil((new Date(item.deadline).getTime() - Date.now()) / 86400000));
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
                      {item.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {daysLeft}d left
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <div className="text-2xl font-bold text-primary mb-4">₹{item.price}</div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{item.currentQty}/{item.targetQty} units</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> {item.participants} joined
                    </span>
                    <Button size="sm">Join Now</Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default GroupBuy;
