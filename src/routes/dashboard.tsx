import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Users, Ticket as TicketIcon, Download, Calendar, MapPin, DollarSign, LayoutDashboard, Settings, Award, CheckCircle, Clock, Trash2, Route as RouteIcon, Zap, Map as MapIcon, ShieldCheck, Compass, Sparkles, Menu, X, LogOut, ChevronRight, BarChart3, Globe, CreditCard, Smartphone, Send, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "tickets" | "admin" | "discovery" | "sales">("overview");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sales State
  const [salesPhone, setSalesPhone] = useState("");
  const [salesAmount, setSalesAmount] = useState(1);
  const [isProcessingSTK, setIsProcessingSTK] = useState(false);

  // Data State
  const [myHostedEvents, setMyHostedEvents] = useState<any[]>([]);
  const [myBookedTickets, setMyBookedTickets] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [systemStats, setSystemStats] = useState({ totalUsers: 0, totalEvents: 0, globalRevenue: 0 });
  const [stats, setStats] = useState({ revenue: 0, points: 0, attended: 0, distance: 1240 });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      toast.error("Access Denied: Please login to access the dashboard");
      nav({ to: "/auth", search: { redirect: "/dashboard" } });
      return;
    }

    const uid = user.id;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: hosted, error: hostedErr } = await supabase
          .from("events")
          .select("*")
          .eq("creator_id", uid);
        if (hostedErr) console.error("events:", hostedErr.message);

        const { data: statsData } = await supabase.from("event_stats").select("*");

        setMyHostedEvents(
          (hosted ?? []).map((h) => ({
            ...h,
            attendee_count: statsData?.find((s) => s.event_id === h.id)?.taken || 0,
          })),
        );

        const { data: tickets, error: ticketsErr } = await supabase
          .from("bookings")
          .select("*, events(*)")
          .eq("user_id", uid);
        if (ticketsErr) console.error("bookings:", ticketsErr.message);
        setMyBookedTickets(tickets ?? []);

        const rev =
          hosted?.reduce(
            (acc, curr) =>
              acc + Number(curr.price || 0) * (statsData?.find((s) => s.event_id === curr.id)?.taken || 0),
            0,
          ) || 0;
        const attended = tickets?.filter((t) => t.attended).length || 0;
        setStats({
          revenue: rev,
          points: attended * 100 + 50,
          attended,
          distance: attended * 450 + 120,
        });

        if (profile?.role === "admin") {
          const [usersRes, eventsRes] = await Promise.all([
            supabase.from("profiles").select("*"),
            supabase.from("events").select("*, profiles(username)"),
          ]);
          setAllUsers(usersRes.data ?? []);
          setAllEvents(eventsRes.data ?? []);
          setSystemStats({
            totalUsers: usersRes.data?.length || 0,
            totalEvents: eventsRes.data?.length || 0,
            globalRevenue:
              eventsRes.data?.reduce(
                (acc, curr) =>
                  acc +
                  Number(curr.price || 0) * (statsData?.find((s) => s.event_id === curr.id)?.taken || 0),
                0,
              ) || 0,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, profile, authLoading, nav]);


  const handleManualSTK = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salesPhone) {
      toast.error("Please enter a phone number");
      return;
    }

    // Format phone number correctly for M-Pesa (254...)
    let formattedPhone = salesPhone.trim().replace(/\+/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith("7") || formattedPhone.startsWith("1")) {
      formattedPhone = "254" + formattedPhone;
    }

    if (!/^254(7|1)\d{8}$/.test(formattedPhone)) {
      toast.error("Invalid phone number format. Use 07... or 254...");
      return;
    }

    setIsProcessingSTK(true);

    try {
      toast.info(`Transmitting STK Push for Ksh ${salesAmount} to ${formattedPhone}...`);

      // Call the Supabase Edge Function to securely trigger M-Pesa STK Push
      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: {
          phone: formattedPhone,
          amount: salesAmount,
          id: 'MWA-ADMIN-PUSH'
        }
      });

      if (error) throw error;

      if (data && data.ResponseCode === "0") {
        toast.success("STK Command Executed!", {
          description: `M-Pesa STK Prompt sent to ${formattedPhone}. Please enter PIN on the handset.`,
        });
      } else {
        throw new Error(data?.CustomerMessage || "Failed to trigger prompt");
      }

      setSalesPhone("");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Handset Transmission Failed.");
    } finally {
      setIsProcessingSTK(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out from Mission Control");
    nav({ to: "/" });
  };

  if (!user || loading) return <div className="min-h-screen grid place-items-center bg-black"><div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full shadow-[0_0_20px_rgba(255,165,0,0.5)]" /></div>;

  const role = profile?.role || "explorer";
  const isAdmin = role === "admin";
  const isRider = role === "rider";
  const isDriver = role === "driver";
  const isExplorer = role === "explorer";

  const getRoleBg = () => {
    if (isRider) return "/back 1.png";
    if (isDriver) return "/backg2.png";
    if (isExplorer) return "/ocean.png";
    if (isAdmin) return "/all.png";
    return "/back 1.png";
  };

  const getRoleIcon = (className = "h-6 w-6") => {
    if (isRider) return <Zap className={className} />;
    if (isDriver) return <MapIcon className={className} />;
    if (isExplorer) return <Compass className={className} />;
    return <ShieldCheck className={className} />;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
      <SiteNav />

      {/* DASHBOARD CONTAINER */}
      <div className="flex-1 flex pt-16 sm:pt-20 relative overflow-hidden">

        {/* Background Layer */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img src={getRoleBg()} className={`w-full h-full object-cover transition-opacity duration-1000 ${isAdmin ? 'opacity-20 grayscale' : 'opacity-40'}`} alt="" />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-transparent" />
        </div>

        {/* SIDEBAR - Collapsible */}
        <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-black/40 backdrop-blur-3xl border-r border-white/5 transition-all duration-500 ease-in-out z-40 hidden md:flex flex-col`}>
          <div className="p-6 flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center gap-3 animate-in fade-in duration-500">
                <div className="h-10 w-10 rounded-xl bg-warm-gradient grid place-items-center text-black">
                  {getRoleIcon("h-5 w-5")}
                </div>
                <div className="font-black italic text-xs tracking-widest text-accent">MISSION CONTROL</div>
              </div>
            )}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-xl transition-colors mx-auto">
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-accent" />}
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            <NavTab active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={LayoutDashboard} label="Overview" isOpen={isSidebarOpen} />
            <NavTab active={activeTab === "tickets"} onClick={() => setActiveTab("tickets")} icon={TicketIcon} label={isRider ? "MISSIONS" : isDriver ? "CONVOYS" : "JOURNEYS"} isOpen={isSidebarOpen} />
            <NavTab active={activeTab === "events"} onClick={() => setActiveTab("events")} icon={Calendar} label="MANAGED RALLIES" isOpen={isSidebarOpen} />
            <NavTab active={activeTab === "sales"} onClick={() => setActiveTab("sales")} icon={CreditCard} label="SALES COMMAND" isOpen={isSidebarOpen} />
            {isExplorer && <NavTab active={activeTab === "discovery"} onClick={() => setActiveTab("discovery")} icon={Globe} label="DISCOVERY LAB" isOpen={isSidebarOpen} />}
            {isAdmin && <NavTab active={activeTab === "admin"} onClick={() => setActiveTab("admin")} icon={BarChart3} label="GLOBAL COMMAND" isOpen={isSidebarOpen} />}
          </nav>

          <div className="p-4 border-t border-white/5">
            <button
              onClick={handleSignOut}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all ${!isSidebarOpen && 'justify-center px-0'}`}
            >
              <LogOut className="h-5 w-5" /> {isSidebarOpen && "Abort Session"}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 h-[calc(100vh-80px)] overflow-y-auto p-6 md:p-12 relative z-10 custom-scrollbar">

          {/* Welcome Tile */}
          <div className="mb-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-700">
               {getRoleIcon("h-48 w-48")}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="relative">
                <div className="h-24 w-24 rounded-3xl bg-warm-gradient grid place-items-center text-4xl font-black shadow-[0_0_40px_rgba(255,165,0,0.4)]">
                  {profile?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-green-500 border-4 border-black grid place-items-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                  Hello, <span className="text-accent">{profile?.username}</span>
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-white/10 px-4 py-1.5 rounded-full border border-white/10">{role} Specialization</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent animate-pulse">Continental clearance active</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
               <Link to="/events">
                  <Button className="bg-white text-black h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">Explore Events</Button>
               </Link>
               <Link to="/events/create">
                  <Button className="bg-accent text-black h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">Host Rally</Button>
               </Link>
            </div>
          </div>

          {/* Tab Content Rendering */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             {activeTab === "overview" && (
                <div className="space-y-12">
                   {/* Stats Grid */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <StatTile label="Tribe Points" value={stats.points} icon={Award} color="text-accent" />
                      <StatTile label="Mission RSVP" value={stats.attended} icon={CheckCircle} color="text-green-400" />
                      {isRider && <StatTile label="KM Covered" value={stats.distance} icon={RouteIcon} color="text-blue-400" />}
                      {isDriver && <StatTile label="Expeditions" value={Math.floor(stats.distance / 10)} icon={MapIcon} color="text-orange-400" />}
                      {!isAdmin && <StatTile label="Hosted Revenue" value={`Ksh ${stats.revenue}`} icon={DollarSign} color="text-emerald-400" />}
                      {isAdmin && <StatTile label="System Users" value={systemStats.totalUsers} icon={Users} color="text-accent" />}
                   </div>

                   {/* Dashboard Menu Section */}
                   <div className="grid lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-8">
                         <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                           <span className="w-12 h-1 bg-accent rounded-full" /> Recent Intelligence
                         </h3>
                         <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-center min-h-[300px] flex flex-col items-center justify-center">
                            <div className="h-16 w-16 rounded-full bg-white/5 grid place-items-center mb-6">
                               <Zap className="h-6 w-6 text-accent opacity-20" />
                            </div>
                            <p className="text-white/40 italic font-medium">Monitoring continental activity... No new updates for your specialization.</p>
                         </div>
                      </div>

                      <div className="space-y-8">
                         <h3 className="text-2xl font-black uppercase italic tracking-tighter">Your Assets</h3>
                         <div className="space-y-4">
                            <AssetLink label="Digital Tickets" count={myBookedTickets.length} onClick={() => setActiveTab("tickets")} />
                            <AssetLink label="Hosted Events" count={myHostedEvents.length} onClick={() => setActiveTab("events")} />
                            {isAdmin && <AssetLink label="GM Console" count="ALL ACCESS" onClick={() => setActiveTab("admin")} />}
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === "tickets" && (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                   {myBookedTickets.map(t => (
                      <TicketCard key={t.id} ticket={t} role={role} />
                   ))}
                   {myBookedTickets.length === 0 && <EmptyState message="No mission data detected." />}
                </div>
             )}

             {activeTab === "events" && (
                <div className="space-y-6">
                   {myHostedEvents.map(e => (
                      <HostedEventRow key={e.id} event={e} />
                   ))}
                   {myHostedEvents.length === 0 && <EmptyState message="You haven\u0027t rallied the tribe yet." />}
                </div>
             )}

             {activeTab === "admin" && isAdmin && (
                <div className="space-y-12">
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <StatTile label="Total Operatives" value={systemStats.totalUsers} icon={Users} color="text-accent" />
                      <StatTile label="Global Missions" value={systemStats.totalEvents} icon={MapIcon} color="text-blue-400" />
                      <StatTile label="Global Revenue" value={`Ksh ${systemStats.globalRevenue}`} icon={DollarSign} color="text-green-400" />
                   </div>

                   <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                         <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                            <tr>
                               <th className="px-8 py-6">Operative</th>
                               <th className="px-8 py-6">Specialization</th>
                               <th className="px-8 py-6">Joined</th>
                               <th className="px-8 py-6 text-right">Control</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {allUsers.map(u => (
                               <tr key={u.id} className="hover:bg-white/5 transition-all text-sm font-bold group">
                                  <td className="px-8 py-6">
                                     <div className="text-white uppercase italic tracking-tighter text-lg leading-none">{u.username}</div>
                                     <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">{u.email}</div>
                                  </td>
                                  <td className="px-8 py-6">
                                     <span className="text-[9px] font-black uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full">{u.role}</span>
                                  </td>
                                  <td className="px-8 py-6 text-white/40 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                                  <td className="px-8 py-6 text-right">
                                     <Button variant="ghost" size="sm" className="text-red-500/40 hover:text-red-500 rounded-xl"><Trash2 className="h-4 w-4" /></Button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             )}

             {activeTab === "sales" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                   <div className="grid lg:grid-cols-3 gap-8">
                      {/* Manual STK Prompt */}
                      <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <Smartphone className="h-48 w-48 text-accent" />
                         </div>

                         <header className="mb-10">
                            <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-2 text-white">STK PUSH COMMAND</h3>
                            <div className="flex items-center gap-2">
                               <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping" />
                               <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Direct Handset Trigger Core</p>
                            </div>
                         </header>

                         <form onSubmit={handleManualSTK} className="space-y-8 max-w-xl relative z-10">
                            <div className="grid sm:grid-cols-2 gap-8">
                               <div className="space-y-3">
                                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Handset Number</Label>
                                  <Input
                                     required
                                     placeholder="e.g. 254701460110"
                                     value={salesPhone}
                                     onChange={(e) => setSalesPhone(e.target.value)}
                                     className="h-16 bg-white/10 border-white/10 rounded-2xl px-6 text-xl font-black italic focus:border-accent transition-all text-white placeholder:text-white/10"
                                  />
                               </div>

                               <div className="space-y-3">
                                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Amount (Ksh)</Label>
                                  <Input
                                     type="number"
                                     required
                                     value={salesAmount}
                                     onChange={(e) => setSalesAmount(Number(e.target.value))}
                                     className="h-16 bg-white/10 border-white/10 rounded-2xl px-6 text-xl font-black italic focus:border-accent transition-all text-accent"
                                  />
                               </div>
                            </div>

                            <Button
                               disabled={isProcessingSTK}
                               className="w-full h-20 bg-warm-gradient text-black font-black uppercase tracking-[0.2em] rounded-[2.5rem] shadow-glow hover:scale-[1.02] transition-all text-lg"
                            >
                               {isProcessingSTK ? (
                                  <div className="flex items-center gap-3">
                                     <Loader2 className="h-6 w-6 animate-spin" /> EXECUTING TRANSMISSION...
                                  </div>
                               ) : (
                                  <div className="flex items-center gap-3">
                                     <Send className="h-6 w-6" /> TRANSMIT PUSH PROMPT
                                  </div>
                               )}
                            </Button>
                         </form>
                      </div>

                      {/* STK Config & Status */}
                      <div className="space-y-8">
                         <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-xl">
                            <h4 className="text-xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3 text-white">
                               <div className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_orange]" /> NODE CONFIG
                            </h4>
                            <div className="space-y-6">
                               <ConfigLine label="ENTITY NAME" value="MY WORLD AFRICA LTD" />
                               <ConfigLine label="BUSINESS ID" value="174379" />
                               <ConfigLine label="TRANSMISSION" value="ACTIVE" />
                               <ConfigLine label="AUTH CORE" value="VERIFIED" />
                            </div>
                         </div>

                         <div className="bg-[#25D366]/5 border border-[#25D366]/20 rounded-[2.5rem] p-10">
                            <div className="flex items-center gap-4 mb-6">
                               <Smartphone className="h-6 w-6 text-[#25D366]" />
                               <h4 className="text-xl font-black uppercase italic tracking-tighter text-[#25D366]">HANDSET SUPPORT</h4>
                            </div>
                            <p className="text-white/40 text-[10px] font-medium leading-relaxed mb-8 uppercase tracking-widest">
                               If no prompt appears, ensure the handset has active internet and is registered on M-Pesa.
                            </p>
                            <a href="https://wa.me/254701460110" target="_blank" rel="noreferrer" className="block w-full">
                               <Button variant="outline" className="w-full h-14 border-[#25D366]/20 bg-[#25D366]/5 text-[#25D366] font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[#25D366] hover:text-white transition-all">
                                  WHATSAPP CEO FOR HELP
                                </Button>
                            </a>
                         </div>
                      </div>
                   </div>
                </div>
             )}
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,165,0,0.2); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,165,0,0.4); }
      `}</style>
      <SiteFooter />
    </div>
  );
}

// SUB-COMPONENTS
function NavTab({ active, onClick, icon: Icon, label, isOpen }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${active ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'bg-white/5 text-white/40 hover:bg-white/10'} ${!isOpen && 'justify-center px-0'}`}>
      <Icon className="h-5 w-5" /> {isOpen && label}
    </button>
  );
}

function StatTile({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 shadow-xl relative overflow-hidden group hover:bg-white/10 transition-all">
       <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-500 ${color}`}><Icon className="h-10 w-10" /></div>
       <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">{label}</div>
       <div className="text-3xl font-black uppercase italic tracking-tighter leading-none">{value}</div>
    </div>
  );
}

function AssetLink({ label, count, onClick }: any) {
   return (
      <button onClick={onClick} className="w-full flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-accent/40 hover:bg-white/10 transition-all group">
         <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-accent group-hover:animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
         </div>
         <span className="text-sm font-bold text-accent">{count}</span>
      </button>
   );
}

function TicketCard({ ticket, role }: any) {
   return (
      <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] p-8 hover:border-accent/40 transition-all group relative overflow-hidden flex flex-col justify-between">
         <div>
            <div className="flex justify-between items-start mb-6">
               <div className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 ${ticket.attended ? 'text-green-500 bg-green-500/10' : 'text-accent bg-accent/10'}`}>
                  {ticket.attended ? "MISSION COMPLETE" : "UPCOMING MISSION"}
               </div>
               <img src={ticket.events?.logo_url || "/logo.png"} className="h-8 w-auto opacity-30 group-hover:opacity-100 transition-opacity" alt="" />
            </div>
            <h4 className="text-xl font-black uppercase italic tracking-tighter mb-4 leading-none">{ticket.events?.title}</h4>
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/30">
               <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {ticket.events?.date}</div>
               <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {ticket.events?.location}</div>
            </div>
         </div>
         <div className="mt-10 flex gap-2">
            <Button variant="outline" className="flex-1 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest border-white/10 hover:bg-white/10">Download PDF</Button>
            <Link to={`/events/${ticket.events?.id}`} className="flex-1">
               <Button variant="ghost" className="w-full rounded-xl h-12 text-[10px] font-black uppercase tracking-widest hover:text-accent">Intel</Button>
            </Link>
         </div>
      </div>
   );
}

function HostedEventRow({ event }: any) {
   return (
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 hover:bg-white/[0.07] transition-all group">
         <div className="flex-1 text-center md:text-left">
            <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-4 leading-none group-hover:text-accent transition-colors">{event.title}</h4>
            <div className="flex flex-wrap justify-center md:justify-start gap-8 text-[10px] font-black uppercase tracking-widest text-white/40">
               <div className="flex flex-col items-center md:items-start gap-1">
                  <span className="text-white text-lg leading-none">{event.attendee_count}</span>
                  <span>Operatives RSVPs</span>
               </div>
               <div className="flex flex-col items-center md:items-start gap-1">
                  <span className="text-white text-lg leading-none">{event.price === 0 ? "FREE" : `Ksh ${event.price}`}</span>
                  <span>Resource Cost</span>
               </div>
            </div>
         </div>
         <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="rounded-xl h-12 px-6 text-[10px] font-black uppercase tracking-widest border-white/10 hover:bg-white/10">Manage RSVPs</Button>
            <Button className="bg-warm-gradient text-black rounded-xl h-12 px-6 text-[10px] font-black uppercase tracking-widest shadow-glow">Modify Mission</Button>
         </div>
      </div>
   );
}

function EmptyState({ message }: { message: string }) {
   return (
      <div className="col-span-full py-24 text-center bg-white/5 rounded-[3rem] border-2 border-dashed border-white/5 text-white/20 font-black uppercase tracking-widest italic animate-pulse">
         {message}
      </div>
   );
}

function ConfigLine({ label, value }: { label: string; value: string }) {
   return (
      <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
         <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{label}</span>
         <span className="text-sm font-bold text-white uppercase">{value}</span>
      </div>
   );
}
