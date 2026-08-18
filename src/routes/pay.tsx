import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Smartphone, CreditCard, ShieldCheck, ChevronRight, CheckCircle2, AlertCircle, Loader2, ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/pay")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      amount: (search.amount as number) || 0,
      item: (search.item as string) || "General Payment",
      id: (search.id as string) || "",
    };
  },
  head: () => ({
    meta: [
      { title: "Secure M-Pesa Payment | My World Africa Ltd" },
      { name: "description", content: "Pay securely via M-Pesa STK Push for tours, events, and tech services." },
    ],
  }),
  component: PaymentPage,
});

function PaymentPage() {
  const { amount, item, id } = Route.useSearch();
  const { user, profile } = useAuth();
  const nav = useNavigate();
  const [phone, setPhone] = useState("");
  const [payAmount, setPayAmount] = useState(amount || 1);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (profile?.phone) {
        // Simple formatter for Kenyan numbers
        let p = profile.phone.replace("+", "");
        if (p.startsWith("0")) p = "254" + p.substring(1);
        setPhone(p);
    }
  }, [profile]);

  const handleSTKPush = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const cleanPhone = phone.trim().replace(/\+/g, "");
    if (!/^(254|0|7|1)\d{8,9}$/.test(cleanPhone)) {
        toast.error("Please enter a valid M-Pesa number (e.g., 0712345678)");
        return;
    }

    // Format to 254...
    let formattedPhone = cleanPhone;
    if (formattedPhone.startsWith("0")) formattedPhone = "254" + formattedPhone.substring(1);
    if (formattedPhone.startsWith("7") || formattedPhone.startsWith("1")) formattedPhone = "254" + formattedPhone;

    setStatus("processing");
    setErrorMessage("");

    try {
      // NOTE: In a real system, you would call a Supabase Edge Function or your backend here.
      // This is the trigger for the Daraja STK Push.

      /*
      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: { phone: formattedPhone, amount: payAmount, accountReference: id || 'MWA-PAY' }
      });
      */

      // Simulating STK Push Trigger
      toast.info("Sending STK Push to your phone... Please check your handset.");

      // We simulate a successful trigger
      setTimeout(() => {
        // In reality, you'd poll the status or wait for a callback
        setStatus("success");
        toast.success("Payment request sent! Check your phone to enter M-Pesa PIN.");
      }, 3000);

    } catch (err: any) {
      console.error(err);
      setStatus("failed");
      setErrorMessage(err.message || "Failed to initiate M-Pesa payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#25D366] selection:text-white">
      <SiteNav />

      <main className="relative pt-32 pb-24 px-6 flex flex-col items-center">
        {/* Background Ambient Glow */}
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#25D366]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-all mb-8 text-xs font-black uppercase tracking-widest">
            <ArrowLeft className="h-4 w-4" /> Back to Safety
          </Link>

          <div className="bg-zinc-900/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden">

            {status === "success" ? (
              <div className="text-center py-8 animate-in zoom-in duration-500">
                <div className="h-20 w-20 rounded-full bg-green-500/20 border-2 border-green-500 grid place-items-center mx-auto mb-8">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-green-500">STK Push Sent!</h1>
                <p className="text-white/60 mb-8 font-medium">
                  We've sent a payment request to <span className="text-white font-bold">{phone}</span>.
                  Please enter your M-Pesa PIN on your phone to complete the transaction.
                </p>
                <div className="space-y-4">
                  <Button onClick={() => setStatus("idle")} variant="outline" className="w-full h-14 border-white/10 bg-white/5 rounded-2xl font-bold">
                    Pay with another number
                  </Button>
                  <Link to="/dashboard">
                    <Button className="w-full h-14 bg-warm-gradient text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-glow">
                      Go to My Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <header className="text-center mb-10">
                  <div className="flex justify-center mb-6">
                    <div className="bg-[#25D366] p-4 rounded-3xl shadow-glow">
                       <Smartphone className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2 leading-none">M-Pesa <span className="text-[#25D366]">Express</span></h1>
                  <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Secure STK Push Payment Gateway</p>
                </header>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Paying For</div>
                    <div className="text-sm font-bold text-white truncate max-w-[200px]">{item}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Total Amount</div>
                    <div className="text-xl font-black text-accent italic">Ksh {payAmount.toLocaleString()}</div>
                  </div>
                </div>

                <form onSubmit={handleSTKPush} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">M-Pesa Number</Label>
                    <div className="relative group">
                      <Input
                        id="phone"
                        required
                        placeholder="e.g. 0712345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-16 bg-white/5 border-white/10 rounded-2xl pl-14 text-lg font-bold text-white focus:bg-white/10 focus:border-[#25D366]/50 transition-all"
                      />
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 font-bold group-focus-within:text-[#25D366] transition-colors">
                        KE
                      </div>
                    </div>
                  </div>

                  {!amount && (
                     <div className="space-y-2">
                        <Label htmlFor="amount" className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Custom Amount (Ksh)</Label>
                        <Input
                           id="amount"
                           type="number"
                           required
                           value={payAmount}
                           onChange={(e) => setPayAmount(Number(e.target.value))}
                           className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-lg font-bold text-white focus:bg-white/10 transition-all"
                        />
                     </div>
                  )}

                  {status === "failed" && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-500/80 font-medium leading-relaxed">{errorMessage}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={status === "processing"}
                    className="w-full h-20 bg-[#25D366] text-white font-black uppercase tracking-[0.2em] rounded-[2.5rem] shadow-[0_0_30px_rgba(37,211,102,0.3)] text-lg transition-all active:scale-95 disabled:opacity-50"
                  >
                    {status === "processing" ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin" /> Processing...
                      </div>
                    ) : (
                      "Initiate M-Pesa Pay"
                    )}
                  </Button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-4 grayscale opacity-40">
                   <img src="/africa real.png" alt="M-Pesa" className="h-6 w-auto" />
                   <div className="h-4 w-px bg-white/10" />
                   <ShieldCheck className="h-5 w-5" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Secure 128-bit Encrypted</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 text-center space-y-4">
             <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Official My World Africa Payment Node</p>
             <div className="flex justify-center gap-6">
                <a href="https://wa.me/254701460110" target="_blank" rel="noreferrer" className="text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-green-500 transition-colors flex items-center gap-2">
                   <MessageSquare className="h-3 w-3 fill-current" /> Payment Support
                </a>
             </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
