import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, Loader2, AlertTriangle, CheckCircle, Bug, Leaf, Shield, Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

interface DiagnosisResult {
  disease: string;
  confidence: number;
  severity: string;
  symptoms: string[];
  treatment: string;
  preventive_measures: string;
  description: string;
}

interface DiseaseReport {
  id: string;
  crop_name: string;
  diagnosis: string;
  confidence: number;
  severity: string;
  treatment: string | null;
  preventive_measures: string | null;
  created_at: string;
}

const severityColor: Record<string, string> = {
  none: "text-primary",
  low: "text-accent-foreground",
  medium: "text-accent-foreground",
  high: "text-destructive",
  critical: "text-destructive",
  unknown: "text-muted-foreground",
};

const CropHealth = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropName, setCropName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [history, setHistory] = useState<DiseaseReport[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from("disease_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setHistory(data as DiseaseReport[]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("crop-disease", {
        body: { imageBase64, cropName: cropName || "crop" },
      });
      if (error) throw error;
      setResult(data);

      // Save to history
      if (user && data.disease) {
        await supabase.from("disease_reports").insert({
          user_id: user.id,
          crop_name: cropName || "Unknown",
          diagnosis: data.disease,
          confidence: data.confidence,
          severity: data.severity,
          treatment: data.treatment,
          preventive_measures: data.preventive_measures,
        });
        fetchHistory();
      }
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const deleteReport = async (id: string) => {
    await supabase.from("disease_reports").delete().eq("id", id);
    setHistory((h) => h.filter((r) => r.id !== id));
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <PageLayout>
      <section className="relative py-20 bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/20 text-sm font-medium mb-4">🔬 AI Plant Pathologist</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Crop Disease Detection</h1>
            <p className="text-lg opacity-90 max-w-xl mx-auto">Upload a photo of your plant and get instant AI-powered disease diagnosis with treatment recommendations.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-card border border-border shadow-elevated">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Crop Name (optional)</Label>
                <Input placeholder="e.g. Tomato, Rice, Wheat" value={cropName} onChange={(e) => setCropName(e.target.value)} className="mt-1.5" />
                <div className="mt-4">
                  <Label>Upload Plant Image</Label>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1.5 border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                    ) : (
                      <div className="text-muted-foreground">
                        <Camera className="h-10 w-10 mx-auto mb-2" />
                        <p className="text-sm">Click to upload or take a photo</p>
                        <p className="text-xs mt-1">JPG, PNG up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
                <Button className="w-full mt-4" disabled={!imageBase64 || analyzing} onClick={handleAnalyze}>
                  {analyzing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <><Bug className="h-4 w-4 mr-2" />Detect Disease</>}
                </Button>
              </div>

              <div className="flex flex-col">
                <AnimatePresence mode="wait">
                  {analyzing && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                      <p className="font-medium">AI is analyzing your image...</p>
                      <p className="text-sm mt-1">This may take a few seconds</p>
                    </motion.div>
                  )}
                  {result && !analyzing && (
                    <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        {result.severity === "none" ? <CheckCircle className="h-8 w-8 text-primary" /> : <AlertTriangle className={`h-8 w-8 ${severityColor[result.severity]}`} />}
                        <div>
                          <h3 className="font-bold text-lg text-foreground">{result.disease}</h3>
                          <p className={`text-sm font-medium ${severityColor[result.severity]}`}>Severity: {result.severity}</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Confidence</span>
                          <span className="font-semibold text-primary">{result.confidence}%</span>
                        </div>
                        <Progress value={result.confidence} className="h-2" />
                      </div>
                      {result.description && <p className="text-sm text-muted-foreground">{result.description}</p>}
                      {result.symptoms?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm text-foreground mb-1">Symptoms</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {result.symptoms.map((s, i) => <li key={i} className="flex gap-2"><Leaf className="h-3 w-3 mt-1 text-primary shrink-0" />{s}</li>)}
                          </ul>
                        </div>
                      )}
                      {result.treatment && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <h4 className="font-semibold text-sm text-primary mb-1 flex items-center gap-1"><Shield className="h-3 w-3" />Treatment</h4>
                          <p className="text-sm text-foreground">{result.treatment}</p>
                        </div>
                      )}
                      {result.preventive_measures && (
                        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                          <h4 className="font-semibold text-sm text-accent-foreground mb-1">Prevention</h4>
                          <p className="text-sm text-foreground">{result.preventive_measures}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                  {!result && !analyzing && (
                    <motion.div key="empty" className="flex-1 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Bug className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Upload an image to start analysis</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* History */}
          <div className="mt-8">
            <Button variant="outline" onClick={() => setShowHistory(!showHistory)} className="mb-4">
              <History className="h-4 w-4 mr-2" />{showHistory ? "Hide" : "Show"} Disease History ({history.length})
            </Button>
            <AnimatePresence>
              {showHistory && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                  {history.length === 0 && <p className="text-sm text-muted-foreground">No reports yet.</p>}
                  {history.map((r) => (
                    <div key={r.id} className="p-4 rounded-xl bg-card border border-border shadow-card flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">{r.crop_name}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.severity === "none" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>{r.severity}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{r.diagnosis}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteReport(r.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CropHealth;
