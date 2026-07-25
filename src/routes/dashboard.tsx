import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Users, Ticket as TicketIcon, Download, ExternalLink, Calendar, MapPin, DollarSign, LayoutDashboard, Settings, Mail, Award, CheckCircle, Clock, Trash2 } from "lucide-react";
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
  const [stats, setStats] = useState({ revenue: 0, points: 0, attended: 0 });

  useEffect(() => {
    if (!user) {
      nav({ to: "/auth" });
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Hosted Events with booking counts from our view
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

        // 3. Stats
        const rev = hosted?.reduce((acc, curr) => {
          const count = statsData?.find(s => s.event_id === curr.id)?.taken || 0;
          return acc + (curr.price * count);
        }, 0) || 0;
        setStats({
          revenue: rev,
          points: (tickets?.filter(t => t.attended).length || 0) * 100,
          attended: tickets?.filter(t => t.attended).length || 0
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

  if (!user || loading) return <div className="min-h-screen grid place-items-center"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" /></div>;

  const isAdmin = profile?.role === "admin";

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 pt-28 pb-16">
        <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-black p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Award className="h-40 w-40" />
           </div>

           <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                Welcome back, <span className="text-accent">{profile?.username || user.email?.split("@")[0]}</span>
              </h1>
              <div className="mt-4 flex flex-wrap gap-6 text-sm font-bold uppercase tracking-widest text-white/60">
                 <div className="flex items-center gap-2"><Award className="h-4 w-4 text-accent" /> {stats.points} Tribe Points</div>
                 <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent" /> {stats.attended} Events Attended</div>
              </div>
           </div>

           <div className="relative z-10 flex gap-4">
              <Link to="/events/create">
                <Button className="bg-warm-gradient h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-glow">
                  Rally New Event
                </Button>
              </Link>
           </div>
        </header>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 space-y-4">
            <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === "overview" ? "bg-primary text-white shadow-lg" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
              <LayoutDashboard className="h-4 w-4" /> Overview
            </button>
            <button onClick={() => setActiveTab("tickets")} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === "tickets" ? "bg-primary text-white shadow-lg" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
              <TicketIcon className="h-4 w-4" /> My Tickets
            </button>
            <button onClick={() => setActiveTab("events")} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === "events" ? "bg-primary text-white shadow-lg" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
              <Calendar className="h-4 w-4" /> Hosted Events
            </button>
            {isAdmin && (
              <button onClick={() => setActiveTab("admin")} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === "admin" ? "bg-accent text-primary-foreground shadow-lg" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                <Users className="h-4 w-4" /> Admin Console
              </button>
            )}
          </aside>

          {/* Main Dashboard Content */}
          <section className="flex-1 min-w-0">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="grid sm:grid-cols-3 gap-6">
                  <StatCard label="Hosted Revenue" value={`Ksh ${stats.revenue}`} icon={DollarSign} />
                  <StatCard label="Upcoming Bookings" value={myBookedTickets.filter(t => !t.attended).length} icon={Clock} />
                  <StatCard label="Tribe Rank" value={stats.points > 500 ? "Veteran" : "Explorer"} icon={Award} />
                </div>

                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Latest Tribe Activity</h3>
                <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm text-center">
                   <p className="text-muted-foreground italic">Your recent interactions with the tribe will appear here.</p>
                </div>
              </div>
            )}

            {activeTab === "tickets" && (
              <div className="grid gap-6 sm:grid-cols-2">
                {myBookedTickets.map(ticket => (
                  <div key={ticket.id} className="bg-card border-2 border-dashed border-border rounded-3xl p-6 flex flex-col justify-between hover:border-primary/50 transition-colors">
                     <div>
                        <div className="flex justify-between items-start mb-4">
                           <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${ticket.attended ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"}`}>
                              {ticket.attended ? "Attended" : "Upcoming"}
                           </div>
                           <img src={ticket.events?.logo_url || "/a (2).png"} className="h-6 w-auto opacity-30" alt="" />
                        </div>
                        <h4 className="text-xl font-black uppercase italic tracking-tighter mb-2">{ticket.events?.title}</h4>
                        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                           <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {ticket.events?.date}</div>
                           <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {ticket.events?.location}</div>
                        </div>
                     </div>
                     <div className="mt-8 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 rounded-xl font-bold h-10">
                           <Download className="h-3 w-3 mr-2" /> PDF Ticket
                        </Button>
                        <Link to={`/events/${ticket.events?.id}`} className="flex-1">
                           <Button variant="ghost" size="sm" className="w-full rounded-xl font-bold h-10">
                              View Event
                           </Button>
                        </Link>
                     </div>
                  </div>
                ))}
                {myBookedTickets.length === 0 && <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border-2 border-dashed border-border">No tickets booked yet.</div>}
              </div>
            )}

            {activeTab === "events" && (
              <div className="space-y-6">
                {myHostedEvents.map(event => (
                  <div key={event.id} className="bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
                     <div className="flex-1">
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-2">{event.title}</h4>
                        <div className="flex flex-wrap gap-6 text-sm font-bold text-muted-foreground">
                           <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {event.attendee_count} RSVPs</div>
                           <div className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> {event.price === 0 ? "FREE" : `Ksh ${event.price}`}</div>
                           <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {event.date}</div>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <Button variant="outline" className="rounded-xl font-bold h-12">Manage RSVPs</Button>
                        <Button className="bg-warm-gradient rounded-xl font-bold h-12">Edit Event</Button>
                     </div>
                  </div>
                ))}
                {myHostedEvents.length === 0 && <div className="py-20 text-center bg-muted/20 rounded-3xl border-2 border-dashed border-border">You haven\u0027t hosted any events yet.</div>}
              </div>
            )}

            {activeTab === "admin" && isAdmin && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">System Users</h3>
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                   <table className="w-full text-left">
                      <thead className="bg-muted/50 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                         <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                         {allUsers.map(u => (
                           <tr key={u.id} className="text-sm font-medium hover:bg-muted/30 transition-colors">
                              <td className="px-6 py-4">
                                 <div className="font-bold">{u.username || "Unknown"}</div>
                                 <div className="text-[10px] text-muted-foreground">{u.email}</div>
                              </td>
                              <td className="px-6 py-4 uppercase text-[10px] font-black">{u.role}</td>
                              <td className="px-6 py-4 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-right">
                                 <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
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
        <div className="mt-16 pt-8 border-t border-border/50 text-center flex flex-col items-center gap-2">
          <div className="font-display font-bold text-sm text-muted-foreground uppercase">MY WORLD AFRICA</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground italic">powered by online world kenya</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: any) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
       <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center"><Icon className="h-4 w-4" /></div>
          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</div>
       </div>
       <div className="text-3xl font-black uppercase italic tracking-tighter">{value}</div>
    </div>
  );
}
