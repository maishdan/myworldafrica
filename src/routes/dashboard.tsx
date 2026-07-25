import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Users, Ticket as TicketIcon, Download, ExternalLink, Calendar, MapPin, DollarSign, LayoutDashboard, Settings, Mail, Award, CheckCircle, Clock, Trash2, Route as RouteIcon, Zap, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user, profile } = useAuth();
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "tickets" | "admin">("overview");
  const [loading, setLoading] = useState(true);

  // Data State
  const [myHostedEvents, setMyHostedEvents] = useState<any[]>([]);
  const [myBookedTickets, setMyBookedTickets] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]); // For Admin
  const [stats, setStats] = useState({ revenue: 0, points: 0, attended: 0, distance: 1240 });

  useEffect(() => {
    if (!user) {
      nav({ to: "/auth" });
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Hosted Events
        const { data: hosted } = await supabase
          .from("events")
          .select("*")
          .eq("creator_id", user.id);

        const { data: statsData } = await supabase
          .from("event_stats")
          .select("*");

        if (hosted) {
          const mergedHosted = hosted.map(h => ({
            ...h,
            attendee_count: statsData?.find(s => s.event_id === h.id)?.taken || 0
          }));
          setMyHostedEvents(mergedHosted);
        }

        // 2. Fetch Booked Tickets
        const { data: tickets } = await supabase
          .from("bookings")
          .select("*, events(*)")
          .eq("user_id", user.id);
        if (tickets) setMyBookedTickets(tickets);

        // 3. Stats calculation
        const rev = hosted?.reduce((acc, curr) => {
          const count = statsData?.find(s => s.event_id === curr.id)?.taken || 0;
          return acc + (Number(curr.price) * count);
        }, 0) || 0;

        setStats({
          revenue: rev,
          points: (tickets?.filter(t => t.attended).length || 0) * 100 + 50, // Base points + 100 per event
          attended: tickets?.filter(t => t.attended).length || 0,
          distance: (tickets?.filter(t => t.attended).length || 0) * 450 + 120 // Simulated distance
        });

        // 4. Admin Data
        if (profile?.role === "admin") {
          const { data: users } = await supabase.from("profiles").select("*");
          if (users) setAllUsers(users);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, profile, nav]);

  if (!user || loading) return <div className="min-h-screen grid place-items-center bg-black"><div className="animate-spin h-10 w-10 border-4 border-accent border-t-transparent rounded-full" /></div>;

  const isAdmin = profile?.role === "admin";
  const isRider = profile?.role === "rider";

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteNav />

      {/* Cinematic Background for Riders */}
      {isRider && (
        <div className="fixed inset-0 z-0 pointer-events-none">
           <img src="/back 1.png" className="w-full h-full object-cover opacity-30" alt="" />
           <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>
      )}

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-16">
        <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              {isRider ? <Zap className="h-48 w-48 text-accent" /> : <Award className="h-40 w-40" />}
           </div>

           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                 <div className="h-16 w-16 rounded-2xl bg-warm-gradient grid place-items-center text-2xl font-black">
                   {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                 </div>
                 <div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                      {isRider ? "RIDER" : "EXPLORER"} <span className="text-accent">{profile?.username || user.email?.split("@")[0]}</span>
                    </h1>
                    <div className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 mt-1">Verified Continental Member</div>
                 </div>
              </div>
              <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-white/60">
                 <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5"><Award className="h-3 w-3 text-accent" /> {stats.points} Points</div>
                 <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5"><CheckCircle className="h-3 w-3 text-accent" /> {stats.attended} Events Attended</div>
                 {isRider && <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5"><RouteIcon className="h-3 w-3 text-accent" /> {stats.distance} KM Covered</div>}
              </div>
           </div>

           <div className="relative z-10 flex gap-4">
              <Link to="/events">
                <Button className="bg-warm-gradient h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-glow transition-transform hover:scale-105">
                  Join a Ride
                </Button>
              </Link>
           </div>
        </header>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 space-y-4">
            <NavButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={LayoutDashboard} label="Overview" />
            <NavButton active={activeTab === "tickets"} onClick={() => setActiveTab("tickets")} icon={TicketIcon} label="My Tickets" />
            <NavButton active={activeTab === "events"} onClick={() => setActiveTab("events")} icon={Calendar} label="Hosted Events" />
            {isAdmin && <NavButton active={activeTab === "admin"} onClick={() => setActiveTab("admin")} icon={Users} label="Admin Console" />}

            <div className="pt-8">
               <Link to="/events/create">
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10">
                     Host Event
                  </Button>
               </Link>
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <section className="flex-1 min-w-0">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {isRider ? (
                    <>
                      <StatCard label="Total Distance" value={`${stats.distance} KM`} icon={RouteIcon} color="text-accent" />
                      <StatCard label="Upcoming Rides" value={myBookedTickets.filter(t => !t.attended).length} icon={Clock} color="text-blue-400" />
                      <StatCard label="Rider Status" value={stats.points > 500 ? "PRO" : "ROOKIE"} icon={Zap} color="text-yellow-400" />
                    </>
                  ) : (
                    <>
                      <StatCard label="Hosted Revenue" value={`Ksh ${stats.revenue}`} icon={DollarSign} color="text-green-400" />
                      <StatCard label="Total RSVPs" value={myHostedEvents.reduce((a, b) => a + (b.attendee_count || 0), 0)} icon={Users} color="text-blue-400" />
                      <StatCard label="Tribe Rank" value={stats.points > 500 ? "VETERAN" : "EXPLORER"} icon={Award} color="text-accent" />
                    </>
                  )}
                </div>

                <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                   <span className="w-12 h-1 bg-accent rounded-full" /> {isRider ? "Your Journey" : "Tribe Impact"}
                </h3>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                      <Map className="h-40 w-40" />
                   </div>
                   <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-md mx-auto py-10">
                      <div className="h-20 w-20 rounded-full bg-accent/10 border-2 border-accent/20 grid place-items-center mb-6">
                         <MapPin className="h-8 w-8 text-accent" />
                      </div>
                      <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-4">No Active Adventure</h4>
                      <p className="text-white/40 text-sm font-medium leading-relaxed">
                         {isRider
                           ? "Your next mission hasn't started. Join an upcoming ride to earn points and climb the rider rankings."
                           : "Start hosting events to rally the tribe and build your community reputation."}
                      </p>
                      <Link to="/events" className="mt-8">
                         <Button className="bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl px-8 h-12">
                           {isRider ? "Find a Ride" : "Create Event"}
                         </Button>
                      </Link>
                   </div>
                </div>
              </div>
            )}

            {activeTab === "tickets" && (
              <div className="grid gap-6 sm:grid-cols-2">
                {myBookedTickets.map(ticket => (
                  <div key={ticket.id} className="bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-accent/40 transition-all group relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                        <TicketIcon className="h-20 w-20" />
                     </div>
                     <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                           <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${ticket.attended ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                              {ticket.attended ? "MISSION COMPLETE" : "UPCOMING MISSION"}
                           </div>
                           <img src={ticket.events?.logo_url || "/a (2).png"} className="h-8 w-auto grayscale group-hover:grayscale-0 transition-all opacity-50" alt="" />
                        </div>
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-4 leading-tight">{ticket.events?.title}</h4>
                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/40">
                           <div className="flex items-center gap-2"><Calendar className="h-3 w-3 text-accent" /> {ticket.events?.date}</div>
                           <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-accent" /> {ticket.events?.location}</div>
                        </div>
                     </div>
                     <div className="mt-10 flex gap-3 relative z-10">
                        <Button variant="outline" size="sm" className="flex-1 rounded-xl font-bold h-12 border-white/10 hover:bg-white/10 uppercase tracking-widest text-[10px]">
                           <Download className="h-4 w-4 mr-2" /> PDF Ticket
                        </Button>
                        <Link to={`/events/${ticket.events?.id}`} className="flex-1">
                           <Button variant="ghost" size="sm" className="w-full rounded-xl font-bold h-12 hover:text-accent uppercase tracking-widest text-[10px]">
                              Intelligence
                           </Button>
                        </Link>
                     </div>
                  </div>
                ))}
                {myBookedTickets.length === 0 && <div className="col-span-full py-24 text-center bg-white/5 rounded-[3rem] border-2 border-dashed border-white/5 text-white/20 font-black uppercase tracking-widest italic">No Mission Data Found.</div>}
              </div>
            )}

            {activeTab === "events" && (
              <div className="space-y-6">
                {myHostedEvents.map(event => (
                  <div key={event.id} className="bg-white/5 border border-white/10 rounded-[3rem] p-10 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 hover:bg-white/[0.07] transition-all">
                     <div className="flex-1 text-center md:text-left">
                        <div className="text-[10px] font-black text-accent uppercase tracking-widest mb-2">Group Organizer</div>
                        <h4 className="text-3xl font-black uppercase italic tracking-tighter mb-4 leading-none">{event.title}</h4>
                        <div className="flex flex-wrap justify-center md:justify-start gap-8 text-[10px] font-black uppercase tracking-widest text-white/40">
                           <div className="flex flex-col items-center md:items-start gap-1">
                              <span className="text-white text-lg leading-none">{event.attendee_count}</span>
                              <span>Tribe RSVPs</span>
                           </div>
                           <div className="flex flex-col items-center md:items-start gap-1">
                              <span className="text-white text-lg leading-none">{event.price === 0 ? "FREE" : `Ksh ${event.price}`}</span>
                              <span>Resource Cost</span>
                           </div>
                           <div className="flex flex-col items-center md:items-start gap-1">
                              <span className="text-white text-lg leading-none">{new Date(event.date).toLocaleDateString()}</span>
                              <span>Mission Date</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <Button variant="outline" className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 border-white/10 hover:bg-white/10">Tactical Map</Button>
                        <Button className="bg-warm-gradient rounded-xl font-black uppercase tracking-widest text-[10px] h-12 shadow-glow">Modify Mission</Button>
                     </div>
                  </div>
                ))}
                {myHostedEvents.length === 0 && <div className="py-24 text-center bg-white/5 rounded-[3rem] border-2 border-dashed border-white/5 text-white/20 font-black uppercase tracking-widest italic">You haven\u0027t rallied the tribe yet.</div>}
              </div>
            )}

            {activeTab === "admin" && isAdmin && (
              <div className="space-y-8 animate-in fade-in duration-700">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-accent">Continental Command</h3>
                <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                   <table className="w-full text-left">
                      <thead className="bg-white/5 text-[10px] uppercase font-black tracking-[0.3em] text-white/40">
                         <tr>
                            <th className="px-8 py-6">Operative</th>
                            <th className="px-8 py-6">Specialization</th>
                            <th className="px-8 py-6">Enlisted</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {allUsers.map(u => (
                           <tr key={u.id} className="text-sm font-bold hover:bg-white/5 transition-all group">
                              <td className="px-8 py-6">
                                 <div className="text-white uppercase italic tracking-tighter text-lg leading-none mb-1">{u.username || "Unknown"}</div>
                                 <div className="text-[10px] font-black uppercase text-white/30 tracking-widest">{u.email}</div>
                              </td>
                              <td className="px-8 py-6"><span className="text-[10px] font-black uppercase tracking-widest bg-accent/10 text-accent px-3 py-1 rounded-full border border-accent/20">{u.role}</span></td>
                              <td className="px-8 py-6 text-white/40 text-[10px] uppercase font-black">{new Date(u.created_at).toLocaleDateString()}</td>
                              <td className="px-8 py-6 text-right">
                                 <Button variant="ghost" size="sm" className="text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 className="h-4 w-4" /></Button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* FOOTER BRANDING */}
        <div className="mt-24 pt-10 border-t border-white/5 text-center flex flex-col items-center gap-4">
          <div className="flex flex-col items-center">
             <img src="/a (2).png" className="h-10 w-auto grayscale opacity-40 mb-4" alt="" />
             <div className="font-sans font-black italic text-lg tracking-tighter uppercase leading-none">
               <span className="text-white/40">MY WORLD</span> <span className="text-accent/40">AFRICA</span>
             </div>
          </div>
          <div className="text-[9px] uppercase font-black tracking-[0.5em] text-white/20 italic">
            powered by online world kenya
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group hover:bg-white/10 transition-all">
       <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-500 ${color}`}><Icon className="h-12 w-12" /></div>
       <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
             <div className={`h-8 w-8 rounded-lg bg-white/5 grid place-items-center ${color}`}><Icon className="h-4 w-4" /></div>
             <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</div>
          </div>
          <div className="text-3xl font-black uppercase italic tracking-tighter leading-none">{value}</div>
       </div>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden ${active ? "bg-accent text-black shadow-[0_20px_40px_-10px_rgba(255,165,0,0.3)]" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"}`}
    >
      <Icon className={`h-4 w-4 ${active ? "text-black" : "text-white/20"}`} /> {label}
      {active && <div className="absolute right-0 top-0 bottom-0 w-1 bg-black/20" />}
    </button>
  );
}
