import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BarChart3, AlertTriangle, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";
import PageLayout from "@/components/PageLayout";
import { crops, locations, type CropKey, type LocationKey } from "@/lib/priceData";

// Generate mock historical data
const generateHistorical = (crop: string, months: number) => {
  const data = [];
  const base = 20 + Math.random() * 40;
  for (let i = months; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const seasonal = Math.sin((d.getMonth() / 12) * Math.PI * 2) * 8;
    const trend = (months - i) * 0.3;
    const noise = (Math.random() - 0.5) * 6;
    data.push({
      month: d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
      price: Math.round((base + seasonal + trend + noise) * 100) / 100,
      volume: Math.round(1000 + Math.random() * 5000),
      volatility: Math.round((3 + Math.random() * 8) * 10) / 10,
    });
  }
  return data;
};

const generateSeasonalPattern = () => {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => ({
    month: m,
    avg_price: Math.round((25 + Math.sin((["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(m) / 12) * Math.PI * 2) * 10 + Math.random() * 5) * 100) / 100,
  }));
};

const exportMarkets = [
  { country: "UAE", demand: "High", price_premium: "+15%", trend: "up" },
  { country: "Bangladesh", demand: "Medium", price_premium: "+8%", trend: "up" },
  { country: "Nepal", demand: "Medium", price_premium: "+5%", trend: "stable" },
  { country: "Sri Lanka", demand: "Low", price_premium: "+12%", trend: "down" },
];

const AdvancedAnalytics = () => {
  const [crop, setCrop] = useState<CropKey>("wheat");
  const [location, setLocation] = useState<LocationKey>("delhi");
  const [timeRange, setTimeRange] = useState("12");

  const historical = useMemo(() => generateHistorical(crop, parseInt(timeRange)), [crop, timeRange]);
  const seasonal = useMemo(() => generateSeasonalPattern(), [crop]);
  const latestPrice = historical[historical.length - 1]?.price || 0;
  const prevPrice = historical[historical.length - 2]?.price || 0;
  const priceChange = ((latestPrice - prevPrice) / prevPrice * 100).toFixed(1);
  const avgVolatility = (historical.reduce((s, d) => s + d.volatility, 0) / historical.length).toFixed(1);

  return (
    <PageLayout>
      <section className="relative py-20 bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/20 text-sm font-medium mb-4">📊 Deep Analytics</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Advanced Price Analytics</h1>
            <p className="text-lg opacity-90 max-w-xl mx-auto">Historical trends, seasonal patterns, volatility analysis, and export market insights.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Filters */}
          <div className="p-5 rounded-xl bg-card border border-border shadow-card mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Crop</Label>
                <Select value={crop} onValueChange={(v) => setCrop(v as CropKey)}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{crops.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Select value={location} onValueChange={(v) => setLocation(v as LocationKey)}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{locations.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Time Range</Label>
                <Select value={timeRange} onValueChange={setTimeRange}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">1 Year</SelectItem>
                    <SelectItem value="24">2 Years</SelectItem>
                    <SelectItem value="36">3 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Current Price", value: `₹${latestPrice}/kg`, icon: <BarChart3 className="h-5 w-5" />, color: "text-foreground" },
              { label: "Price Change", value: `${parseFloat(priceChange) >= 0 ? "+" : ""}${priceChange}%`, icon: parseFloat(priceChange) >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />, color: parseFloat(priceChange) >= 0 ? "text-primary" : "text-destructive" },
              { label: "Avg Volatility", value: `${avgVolatility}%`, icon: <AlertTriangle className="h-5 w-5" />, color: "text-accent-foreground" },
              { label: "Data Points", value: historical.length.toString(), icon: <Calendar className="h-5 w-5" />, color: "text-muted-foreground" },
            ].map((c) => (
              <div key={c.label} className="p-4 rounded-xl bg-card border border-border shadow-card">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">{c.icon}{c.label}</div>
                <div className={`text-xl font-bold ${c.color}`}>{c.value}</div>
              </div>
            ))}
          </div>

          {/* Price Trend */}
          <div className="p-6 rounded-xl bg-card border border-border shadow-card mb-8">
            <h3 className="font-semibold text-foreground mb-4">Historical Price Trend</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={historical}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} unit="/kg" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Seasonal Pattern */}
            <div className="p-6 rounded-xl bg-card border border-border shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Seasonal Price Pattern</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={seasonal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="avg_price" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Volatility */}
            <div className="p-6 rounded-xl bg-card border border-border shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Price Volatility</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={historical}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="volatility" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Export Markets */}
          <div className="p-6 rounded-xl bg-card border border-border shadow-card">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Globe className="h-5 w-5 text-primary" />Export Market Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {exportMarkets.map((m) => (
                <div key={m.country} className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <h4 className="font-semibold text-foreground">{m.country}</h4>
                  <p className="text-sm text-muted-foreground">Demand: {m.demand}</p>
                  <p className="text-sm font-medium text-primary">Premium: {m.price_premium}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {m.trend === "up" ? <TrendingUp className="h-3 w-3 text-primary" /> : m.trend === "down" ? <TrendingDown className="h-3 w-3 text-destructive" /> : <span className="text-xs text-muted-foreground">→</span>}
                    <span className="text-xs text-muted-foreground capitalize">{m.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default AdvancedAnalytics;
