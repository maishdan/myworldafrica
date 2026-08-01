import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MessageSquare, MapPin, Clock } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { CONTACT, mailHref, telHref, smsHref, whatsappHref } from "@/lib/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact My World Africa | Call, SMS, WhatsApp or Email Us" },
      {
        name: "description",
        content:
          "Talk to My World Africa about safaris, rallies and expeditions. Call or SMS 0701460110, chat on WhatsApp, or email myworldafrica1@gmail.com. Based in Nairobi, Kenya.",
      },
      { property: "og:title", content: "Contact My World Africa" },
      {
        property: "og:description",
        content:
          "Call or SMS 0701460110, WhatsApp us, or email myworldafrica1@gmail.com — we reply fast.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteNav />

      <section className="relative overflow-hidden pt-32 pb-20">
        <img src="/back 1.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-6">
            Get in touch
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
            Talk to <span className="text-accent">My World Africa</span>
          </h1>
          <p className="mt-8 mx-auto max-w-2xl text-lg text-white/70 font-medium leading-relaxed">
            Planning a safari, hosting a rally, or joining a convoy? Reach us any way you like — we
            answer calls, SMS, WhatsApp and email.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24 grid gap-6 sm:grid-cols-2">
        <ContactCard
          href={telHref}
          icon={<Phone className="h-6 w-6" />}
          label="Call us"
          value={CONTACT.phoneDisplay}
          hint="Mon–Sun · 7am – 9pm EAT"
        />
        <ContactCard
          href={smsHref}
          icon={<MessageSquare className="h-6 w-6" />}
          label="Send an SMS"
          value={CONTACT.phoneDisplay}
          hint="Text us your trip details"
        />
        <ContactCard
          href={whatsappHref}
          external
          icon={<WhatsAppIcon className="h-6 w-6" />}
          label="WhatsApp"
          value={CONTACT.phoneDisplay}
          hint="Fastest reply — share photos & routes"
        />
        <ContactCard
          href={mailHref}
          icon={<Mail className="h-6 w-6" />}
          label="Email"
          value={CONTACT.email}
          hint="Bookings, partnerships & press"
        />
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-32">
        <div className="rounded-[3rem] border border-white/10 bg-white/5 p-10 md:p-16 backdrop-blur-xl">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-6">
                Where we ride from
              </h2>
              <div className="space-y-4 text-sm font-bold uppercase tracking-widest text-white/60">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-accent" /> {CONTACT.location}
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-accent" /> Daily · 7am – 9pm EAT
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <Button className="w-full h-16 rounded-2xl bg-[#25D366] text-black font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform">
                  <WhatsAppIcon className="h-5 w-5 mr-3" /> Chat on WhatsApp
                </Button>
              </a>
              <a href={telHref}>
                <Button
                  variant="outline"
                  className="w-full h-16 rounded-2xl border-white/20 bg-white/5 font-black uppercase tracking-widest text-xs hover:bg-white/10"
                >
                  <Phone className="h-5 w-5 mr-3 text-accent" /> Call {CONTACT.phoneDisplay}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function ContactCard({
  href,
  icon,
  label,
  value,
  hint,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group rounded-[2.5rem] border border-white/10 bg-white/5 p-10 transition-all hover:border-accent/50 hover:bg-white/10"
    >
      <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-accent/15 text-accent transition-transform group-hover:scale-110">
        {icon}
      </div>
      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{label}</div>
      <div className="mt-2 break-words text-xl font-black italic tracking-tighter group-hover:text-accent transition-colors">
        {value}
      </div>
      <div className="mt-3 text-xs font-medium text-white/40">{hint}</div>
    </a>
  );
}
