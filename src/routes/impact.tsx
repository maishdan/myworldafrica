import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Heart, Smartphone, ShieldCheck, Globe, Droplets, Sun, CheckCircle2, Lock, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact Foundation | Donate to My World Africa" },
      {
        name: "description",
        content: "Support the My World Africa Public Benefit Organization (PBO). Donate via PayPal or M-Pesa to fund solar energy and clean water projects in Kenya.",
      },
    ],
  }),
  component: ImpactPage,
});

function ImpactPage() {
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "paypal">("mpesa");
  const [amount, setAmount] = useState<number | "">("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const predefinedAmountsUsd = [10, 50, 100, 500];
  const predefinedAmountsKes = [1000, 5000, 10000, 50000];

  const handleMpesaDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 10) {
      toast.error("Please enter a valid amount (Minimum 10 KES).");
      return;
    }
    if (!phoneNumber || phoneNumber.length < 9) {
      toast.error("Please enter a valid Safaricom number.");
      return;
    }
    setIsProcessing(true);

    try {
      // Call our Supabase Edge Function to process Payero M-Pesa STK Push
      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: {
          phone: phoneNumber,
          amount: amount,
          reference: "DONATION"
        }
      });

      console.log("Supabase Edge Function Response:", data);

      if (error) {
        throw new Error(`Edge Function Error: ${error.message}`);
      }

      if (data?.payero_status !== 200) {
         throw new Error(`Payero rejected the transaction: ${JSON.stringify(data?.payero_response)}`);
      }

      toast.success("M-Pesa Prompt Sent!", {
        description: "Please check your phone and enter your M-Pesa PIN to complete the donation.",
      });
    } catch (err: any) {
      console.error(err);
      toast.error("Transaction Failed", {
        description: err.message || "Could not initiate M-Pesa push. Please try the manual paybill.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalDonate = () => {
    if (!amount || amount < 1) {
      toast.error("Please enter a valid amount.");
      return;
    }
    setIsProcessing(true);
    // Simulate PayPal redirection
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Redirecting to Secure PayPal Gateway...");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 font-sans">
      <SiteNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/explorers.jpg')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]" />

        <div className="mx-auto max-w-5xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-accent mb-8">
            <ShieldCheck className="h-3.5 w-3.5" />
            Registered Public Benefit Organization (PBO)
          </div>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight text-white leading-[0.9] mb-6">
            Empower the <span className="text-accent">Future</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed mb-12">
            100% of your public donations go directly to the field. We fund solar energy grids, clean water boreholes, and education for off-grid communities across Kenya.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> Tax Deductible</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> Audited Financials</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> Direct Impact</span>
          </div>
        </div>
      </section>

      {/* Main Donation Section */}
      <section className="py-20 px-6 relative">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-start">

          {/* Left Column: The Impact Story */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-tight text-white mb-4">Where your money goes</h2>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                As a registered PBO, My World Africa operates with absolute transparency. Our commercial tech and travel divisions cover administrative costs, meaning your donation is spent entirely on engineering community solutions.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 border border-white/10 bg-[#0a0a0a]">
                <Sun className="h-8 w-8 text-accent mb-4" />
                <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">Solar Infrastructure</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">KSh 15,000 ($100) powers a rural school classroom with reliable solar lighting and device charging for an entire year.</p>
              </div>
              <div className="p-6 border border-white/10 bg-[#0a0a0a]">
                <Droplets className="h-8 w-8 text-accent mb-4" />
                <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">Clean Water Systems</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">KSh 5,000 ($35) funds the maintenance of a community solar-powered borehole, providing water to 500 people.</p>
              </div>
            </div>

            <div className="p-6 border border-accent/20 bg-accent/5 flex items-start gap-4">
              <Lock className="h-6 w-6 text-accent shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Bank-Grade Security</h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  All transactions are processed through encrypted, PCI-compliant gateways. We do not store your credit card or M-Pesa PIN data on our servers.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: The Donation Widget */}
          <div className="bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl relative overflow-hidden">
            {/* Tech accents */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-accent/30 pointer-events-none" />

            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold uppercase tracking-tight text-white">Make a Donation</h3>
              <Heart className="h-6 w-6 text-accent animate-pulse" />
            </div>

            {/* Payment Method Toggle */}
            <div className="grid grid-cols-2 gap-2 mb-8 bg-[#050505] p-1 border border-white/10">
              <button
                onClick={() => { setPaymentMethod("mpesa"); setAmount(""); }}
                className={`py-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-3 ${paymentMethod === "mpesa" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}
              >
                <div className="bg-white px-2 py-1 rounded flex items-center justify-center shadow-sm">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" className="h-3 object-contain" />
                </div>
                Local
              </button>
              <button
                onClick={() => { setPaymentMethod("paypal"); setAmount(""); }}
                className={`py-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-3 ${paymentMethod === "paypal" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}
              >
                <div className="bg-white px-2 py-1 rounded flex items-center justify-center shadow-sm">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3 object-contain" />
                </div>
                Global
              </button>
            </div>

            {/* M-PESA FORM */}
            {paymentMethod === "mpesa" && (
              <form onSubmit={handleMpesaDonate} className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-3">Select Amount (KES)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {predefinedAmountsKes.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAmount(amt)}
                        className={`py-3 border text-sm font-bold transition-all ${amount === amt ? "border-[#25D366] bg-[#25D366]/10 text-[#25D366]" : "border-white/10 bg-[#050505] text-zinc-400 hover:border-white/30"}`}
                      >
                        {amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">KSh</span>
                    <Input
                      type="number"
                      placeholder="Custom Amount"
                      className="h-14 pl-12 bg-[#050505] border-white/10 text-white focus:border-[#25D366] transition-colors rounded-none"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-3">M-Pesa Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="e.g. 0701460110"
                    className="h-14 bg-[#050505] border-white/10 text-white focus:border-[#25D366] transition-colors rounded-none"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-14 bg-[#25D366] hover:bg-[#20bd5c] text-black font-bold uppercase tracking-widest text-xs rounded-none transition-all flex items-center justify-center gap-3"
                >
                  {isProcessing ? "Connecting to Safaricom..." : (
                    <>
                      <div className="bg-white px-2 py-1 rounded flex items-center justify-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" className="h-3 object-contain" />
                      </div>
                      Donate via STK Push
                    </>
                  )}
                </Button>

                <div className="text-center p-4 border border-white/5 bg-[#050505] space-y-3">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Other Ways to Pay</p>

                  <a
                    href="https://business.finoq.africa/pay/donation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-colors border border-white/10"
                  >
                    Use Direct Payment Link
                  </a>

                  <p className="text-xs text-zinc-400 font-light pt-2 border-t border-white/5">
                    Or use Paybill: <span className="font-bold text-white">XXXXXX</span> | Account: <span className="font-bold text-white">DONATION</span>
                  </p>
                </div>
              </form>
            )}

            {/* PAYPAL FORM */}
            {paymentMethod === "paypal" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-3">Select Amount (USD)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {predefinedAmountsUsd.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAmount(amt)}
                        className={`py-3 border text-sm font-bold transition-all ${amount === amt ? "border-[#0070BA] bg-[#0070BA]/10 text-[#0070BA]" : "border-white/10 bg-[#050505] text-zinc-400 hover:border-white/30"}`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
                    <Input
                      type="number"
                      placeholder="Custom Amount"
                      className="h-14 pl-10 bg-[#050505] border-white/10 text-white focus:border-[#0070BA] transition-colors rounded-none"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handlePayPalDonate}
                    disabled={isProcessing}
                    className="w-full h-14 bg-[#FFC439] hover:bg-[#F4BB33] text-black font-bold uppercase tracking-widest text-xs rounded-none transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? "Connecting to Gateway..." : (
                      <>
                        Donate with <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 ml-1 object-contain" />
                      </>
                    )}
                  </Button>
                  <p className="text-[10px] text-zinc-500 text-center mt-4 uppercase tracking-widest font-bold flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" /> Secure International Gateway
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
