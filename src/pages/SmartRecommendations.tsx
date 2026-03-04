import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, ShoppingBag, Lightbulb, TrendingUp, DollarSign, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import { Navigate } from "react-router-dom";

interface Recommendations {
  product_recommendations: { name: string; reason: string; category: string; priority: string }[];
  seasonal_tips: string[];
  market_insights: string[];
  cost_saving_tips: string[];
}

const priorityBadge: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-accent/20 text-accent-foreground",
  low: "bg-secondary text-secondary-foreground",
};

const SmartRecommendations = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useState("Punjab");
  const [cropTypes, setCropTypes] = useState("Wheat, Rice");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Recommendations | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke("smart-recommendations", {
        body: { userId: user?.id, location, cropTypes: cropTypes.split(",").map((s) => s.trim()) },
      });
      if (error) throw error;
      setData(res);
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchRecommendations();
  }, [user]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <PageLayout>
      <section className="relative py-20 bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/20 text-sm font-medium mb-4">✨ AI Personalization</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Smart Recommendations</h1>
            <p className="text-lg opacity-90 max-w-xl mx-auto">Personalized product suggestions, seasonal tips, and market insights tailored to your farm.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="p-5 rounded-xl bg-card border border-border shadow-card mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1.5">
                <Label>Your Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Punjab" />
              </div>
              <div className="space-y-1.5">
                <Label>Crops (comma-separated)</Label>
                <Input value={cropTypes} onChange={(e) => setCropTypes(e.target.value)} placeholder="e.g. Wheat, Rice" />
              </div>
              <Button onClick={fetchRecommendations} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Refresh
              </Button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Generating personalized recommendations...</p>
            </div>
          )}

          {data && !loading && (
            <div className="space-y-8">
              {/* Product Recommendations */}
              {data.product_recommendations?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-primary" />Recommended Products</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.product_recommendations.map((p, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="p-4 rounded-xl bg-card border border-border shadow-card">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{p.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityBadge[p.priority] || priorityBadge.low}`}>{p.priority}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{p.reason}</p>
                        <span className="text-xs text-primary font-medium">{p.category}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.seasonal_tips?.length > 0 && (
                  <div className="p-5 rounded-xl bg-primary/5 border border-primary/20">
                    <h3 className="font-semibold text-primary mb-3 flex items-center gap-2"><Lightbulb className="h-4 w-4" />Seasonal Tips</h3>
                    <ul className="space-y-2">
                      {data.seasonal_tips.map((t, i) => <li key={i} className="text-sm text-foreground flex gap-2"><span className="text-primary shrink-0">•</span>{t}</li>)}
                    </ul>
                  </div>
                )}
                {data.market_insights?.length > 0 && (
                  <div className="p-5 rounded-xl bg-accent/10 border border-accent/20">
                    <h3 className="font-semibold text-accent-foreground mb-3 flex items-center gap-2"><TrendingUp className="h-4 w-4" />Market Insights</h3>
                    <ul className="space-y-2">
                      {data.market_insights.map((t, i) => <li key={i} className="text-sm text-foreground flex gap-2"><span className="text-accent-foreground shrink-0">•</span>{t}</li>)}
                    </ul>
                  </div>
                )}
                {data.cost_saving_tips?.length > 0 && (
                  <div className="p-5 rounded-xl bg-secondary border border-border">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" />Cost Savings</h3>
                    <ul className="space-y-2">
                      {data.cost_saving_tips.map((t, i) => <li key={i} className="text-sm text-foreground flex gap-2"><span className="text-primary shrink-0">•</span>{t}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default SmartRecommendations;
