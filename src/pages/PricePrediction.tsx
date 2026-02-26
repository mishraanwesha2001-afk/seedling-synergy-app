import { motion } from "framer-motion";
import { TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const crops = ["Wheat", "Rice", "Cotton", "Sugarcane", "Maize", "Soybean"];

const generateData = (crop: string) => {
  const base: Record<string, number> = { Wheat: 2200, Rice: 1800, Cotton: 5500, Sugarcane: 350, Maize: 1900, Soybean: 3800 };
  const b = base[crop] || 2000;
  return Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    actual: i < 8 ? Math.round(b + Math.sin(i * 0.8) * b * 0.15 + Math.random() * b * 0.05) : undefined,
    predicted: i >= 6 ? Math.round(b + Math.sin(i * 0.8) * b * 0.15 + b * 0.08) : undefined,
  }));
};

const PricePrediction = () => {
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const data = generateData(selectedCrop);

  const currentPrice = data.find((d) => d.actual)?.actual || 0;
  const predictedPrice = data[data.length - 1]?.predicted || 0;
  const change = ((predictedPrice - currentPrice) / currentPrice) * 100;

  return (
    <PageLayout>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">AI-Powered</span>
            <h1 className="text-3xl md:text-5xl font-bold mt-2 text-foreground">
              Crop Price Prediction
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Make informed selling decisions with our AI-powered price forecasting engine.
            </p>
          </motion.div>

          {/* Crop selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {crops.map((crop) => (
              <Button
                key={crop}
                variant={selectedCrop === crop ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCrop(crop)}
              >
                {crop}
              </Button>
            ))}
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-xl bg-card border border-border shadow-card">
              <div className="text-sm text-muted-foreground mb-1">Current Price</div>
              <div className="text-2xl font-bold text-foreground">₹{currentPrice}/qtl</div>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border shadow-card">
              <div className="text-sm text-muted-foreground mb-1">Predicted Price</div>
              <div className="text-2xl font-bold text-primary">₹{predictedPrice}/qtl</div>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border shadow-card">
              <div className="text-sm text-muted-foreground mb-1">Expected Change</div>
              <div className={`text-2xl font-bold flex items-center gap-1 ${change >= 0 ? "text-primary" : "text-destructive"}`}>
                {change >= 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                {Math.abs(change).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-card border border-border shadow-card"
          >
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {selectedCrop} Price Trends
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="actual" stroke="hsl(var(--foreground))" strokeWidth={2} dot={{ r: 4 }} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default PricePrediction;
