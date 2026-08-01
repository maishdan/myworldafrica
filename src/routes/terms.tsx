import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { CONTACT, mailHref } from "@/lib/contact";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service & Privacy Policy | My World Africa" },
      {
        name: "description",
        content:
          "The terms that govern use of My World Africa, plus how we collect, store and protect your data — accounts, event bookings, media uploads and payments.",
      },
      { property: "og:title", content: "Terms & Privacy — My World Africa" },
      {
        property: "og:description",
        content: "How My World Africa works, and how we handle your data and bookings.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteNav />

      <section className="pt-32 pb-16 px-6 mx-auto max-w-3xl">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-6">
          Legal
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
          Terms & Privacy
        </h1>
        <p className="mt-6 text-sm font-bold uppercase tracking-widest text-white/40">
          Last updated {new Date().getFullYear()}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-32 space-y-12">
        <Section title="1. Using My World Africa">
          By creating an account you agree to use the platform lawfully and to provide accurate
          details. You are responsible for your account credentials and for any content you publish,
          including events, photos and videos.
        </Section>
        <Section title="2. Events and bookings">
          Events are published by community hosts. My World Africa facilitates discovery and
          ticketing but is not the organiser unless explicitly stated. Hosts are responsible for
          route safety, permits and delivering the experience described. Refunds are handled by the
          host under the terms shown on the event page.
        </Section>
        <Section title="3. Ride safety and liability">
          Adventure travel carries risk. You participate at your own risk and confirm you hold valid
          licences, insurance and roadworthy equipment. My World Africa is not liable for injury,
          loss or damage arising from participation in any event.
        </Section>
        <Section title="4. Content you upload">
          You keep ownership of your photos, videos and posts, and grant us a licence to display and
          promote them on the platform and our social channels with credit. We remove content that is
          illegal, hateful, or infringes others' rights.
        </Section>
        <Section title="5. Data we collect">
          We store your name, username, email, phone number, profile photo, role and the events you
          host or book. Authentication and data are handled by Supabase; payments and emails are
          processed by our payment and email providers. We never sell your personal data.
        </Section>
        <Section title="6. How we use your data">
          To run your account, deliver tickets and confirmations, notify you about events matching
          your tribe, prevent abuse, and improve the platform. You can opt out of event notifications
          at any time from your dashboard.
        </Section>
        <Section title="7. Cookies and analytics">
          We use essential cookies for sign-in sessions, plus analytics and advertising cookies
          (including Google AdSense) to understand traffic and fund the platform. You can block
          non-essential cookies in your browser settings.
        </Section>
        <Section title="8. Your rights">
          You may request a copy of your data, correct it, or ask us to delete your account entirely.
          Email us and we'll action verified requests within 30 days.
        </Section>
        <Section title="9. Changes">
          We may update these terms as the platform grows. Material changes will be announced on the
          site, and continued use means acceptance.
        </Section>
        <Section title="10. Contact">
          Questions about these terms or your data? Email{" "}
          <a href={mailHref} className="text-accent hover:underline">
            {CONTACT.email}
          </a>{" "}
          or call {CONTACT.phoneDisplay}.
        </Section>
      </section>

      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-black uppercase italic tracking-tighter mb-4 text-accent">
        {title}
      </h2>
      <p className="text-white/60 leading-relaxed font-medium">{children}</p>
    </div>
  );
}
