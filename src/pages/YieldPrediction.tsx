import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Loader2, TrendingUp, AlertTriangle, ShieldCheck, Calendar, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import { Navigate } from "react-router-dom";

interface YieldResult {
  predicted_yield_per_acre: number;
  total_yield: number;
  confidence_low: number;
  confidence_high: number;
  confidence_percent: number;
  risk_level: string;
  risk_factors: string[];
  recommendations: string[];
  estimated_revenue_per_acre: number;
  optimal_harvest_window: string;
  insurance_recommendation: string;
  monthly_forecast: { month: string; expected_growth: string; key_action: string }[];
}

const cropOptions = ["Wheat", "Rice", "Cotton", "Sugarcane", "Maize", "Soybean", "Mustard", "Chickpea", "Potato", "Tomato"];
const soilTypes = ["Alluvial", "Black/Regur", "Red", "Laterite", "Sandy", "Clay", "Loamy"];
const irrigationTypes = ["Canal", "Tube Well", "Drip", "Sprinkler", "Rain-fed", "Flood"];
const seasons = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];
const locationOptions = ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka", "Tamil Nadu", "West Bengal", "Gujarat"];

const riskColors: Record<string, string> = { low: "text-primary", medium: "text-accent-foreground", high: "text-destructive" };

const YieldPrediction = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [crop, setCrop] = useState("");
  const [location, setLocation] = useState("");
  const [acreage, setAcreage] = useState("");
  const [soilType, setSoilType] = useState("");
  const [irrigationType, setIrrigationType] = useState("");
  const [season, setSeason] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<YieldResult | null>(null);

  const handlePredict = async () => {
    if (!crop || !location || !acreage) return;
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("yield-prediction", {
        body: { crop, location, acreage: parseFloat(acreage), soilType, irrigationType, season },
      });
      if (error) throw error;
      setResult(data);
    } catch (err: any) {
      toast({ title: "Prediction failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <PageLayout>
      <section className="relative py-20 bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/20 text-sm font-medium mb-4">🌾 AI Yield Forecasting</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Yield Prediction</h1>
            <p className="text-lg opacity-90 max-w-xl mx-auto">Advanced ML-powered crop yield forecasting with risk assessment and insurance recommendations.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-card border border-border shadow-elevated">
            <h2 className="text-xl font-bold text-foreground mb-4">Enter Farm Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Crop</Label>
                <Select value={crop} onValueChange={setCrop}><SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                  <SelectContent>{cropOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Select value={location} onValueChange={setLocation}><SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>{locationOptions.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Acreage</Label>
                <Input type="number" min={0.1} step={0.1} placeholder="e.g. 5" value={acreage} onChange={(e) => setAcreage(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Soil Type</Label>
                <Select value={soilType} onValueChange={setSoilType}><SelectTrigger><SelectValue placeholder="Select soil" /></SelectTrigger>
                  <SelectContent>{soilTypes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Irrigation</Label>
                <Select value={irrigationType} onValueChange={setIrrigationType}><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>{irrigationTypes.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Season</Label>
                <Select value={season} onValueChange={setSeason}><SelectTrigger><SelectValue placeholder="Select season" /></SelectTrigger>
                  <SelectContent>{seasons.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full mt-6" disabled={!crop || !location || !acreage || loading} onClick={handlePredict}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Predicting...</> : <><Sprout className="h-4 w-4 mr-2" />Predict Yield</>}
            </Button>
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Yield/Acre", value: `${result.predicted_yield_per_acre} qtl`, icon: <Sprout className="h-5 w-5" />, color: "text-primary" },
                    { label: "Total Yield", value: `${result.total_yield} qtl`, icon: <BarChart3 className="h-5 w-5" />, color: "text-foreground" },
                    { label: "Revenue/Acre", value: `₹${result.estimated_revenue_per_acre?.toLocaleString()}`, icon: <DollarSign className="h-5 w-5" />, color: "text-primary" },
                    { label: "Risk Level", value: result.risk_level, icon: <AlertTriangle className="h-5 w-5" />, color: riskColors[result.risk_level] || "text-muted-foreground" },
                  ].map((m) => (
                    <div key={m.label} className="p-4 rounded-xl bg-card border border-border shadow-card">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">{m.icon}{m.label}</div>
                      <div className={`text-xl font-bold ${m.color} capitalize`}>{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Confidence */}
                <div className="p-5 rounded-xl bg-card border border-border shadow-card">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-foreground">Confidence Interval</span>
                    <span className="text-sm text-primary font-medium">{result.confidence_percent}%</span>
                  </div>
                  <Progress value={result.confidence_percent} className="h-2 mb-3" />
                  <p className="text-sm text-muted-foreground">Expected range: {result.confidence_low} – {result.confidence_high} qtl/acre</p>
                </div>

                {/* Harvest & Insurance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-card border border-border shadow-card">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />Harvest Window</h3>
                    <p className="text-muted-foreground">{result.optimal_harvest_window}</p>
                  </div>
                  <div className="p-5 rounded-xl bg-card border border-border shadow-card">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />Insurance</h3>
                    <p className="text-muted-foreground">{result.insurance_recommendation}</p>
                  </div>
                </div>

                {/* Risk Factors & Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.risk_factors?.length > 0 && (
                    <div className="p-5 rounded-xl bg-destructive/5 border border-destructive/20">
                      <h3 className="font-semibold text-destructive mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4" />Risk Factors</h3>
                      <ul className="space-y-2">{result.risk_factors.map((r, i) => <li key={i} className="text-sm text-foreground flex gap-2"><span className="text-destructive">•</span>{r}</li>)}</ul>
                    </div>
                  )}
                  {result.recommendations?.length > 0 && (
                    <div className="p-5 rounded-xl bg-primary/5 border border-primary/20">
                      <h3 className="font-semibold text-primary mb-3 flex items-center gap-2"><TrendingUp className="h-4 w-4" />Recommendations</h3>
                      <ul className="space-y-2">{result.recommendations.map((r, i) => <li key={i} className="text-sm text-foreground flex gap-2"><span className="text-primary">•</span>{r}</li>)}</ul>
                    </div>
                  )}
                </div>

                {/* Monthly Timeline */}
                {result.monthly_forecast?.length > 0 && (
                  <div className="p-5 rounded-xl bg-card border border-border shadow-card">
                    <h3 className="font-semibold text-foreground mb-4">Monthly Growth Timeline</h3>
                    <div className="space-y-3">
                      {result.monthly_forecast.map((m, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className="w-20 shrink-0 text-sm font-medium text-primary">{m.month}</div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{m.expected_growth}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Action: {m.key_action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageLayout>
  );
};

export default YieldPrediction;
