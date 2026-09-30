import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PlatformAnnouncement from "@/components/PlatformAnnouncement";
import { getDictionary } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Déjà connecté ?
  if (user) {
    const { data: admin } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (admin) {
      redirect("/admin/dashboard");
    }
  }

  const { locale, t } = await getDictionary();

  return (
    <main className="font-body grid min-h-screen bg-adm-bg text-adm-ink lg:grid-cols-[1fr_minmax(0,32rem)]">
      <section className="relative hidden overflow-hidden bg-adm-wine p-12 text-adm-cream lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-1/3 h-96 w-96 rounded-full bg-adm-coral/15 blur-[140px]"
        />
        <p className="relative font-elegant text-lg">
          Gala d&apos;Élégance
        </p>
        <div className="relative max-w-md">
          <h1 className="font-elegant text-5xl leading-tight text-white">
            {t.login.tagline}
          </h1>
          <p className="mt-4 leading-relaxed text-adm-cream/60">
            {t.login.intro}
          </p>
        </div>
        <div className="relative max-w-md space-y-6">
          <PlatformAnnouncement locale={locale} tone="admin" />
          <p className="text-sm text-adm-cream/40">{t.login.footer}</p>
        </div>
      </section>

      <section className="flex flex-col px-5 py-6">
        <div className="flex justify-end">
          <LanguageSwitcher tone="light" />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <p className="font-elegant text-lg text-adm-wine lg:hidden">
              Gala d&apos;Élégance
            </p>
            <h2 className="mt-6 font-elegant text-3xl font-semibold lg:mt-0">
              {t.login.title}
            </h2>
            <p className="mb-8 mt-2 text-sm text-adm-muted">
              {t.login.subtitle}
            </p>

            <AdminLoginForm />

            <PlatformAnnouncement
              locale={locale}
              tone="light"
              className="mt-10 lg:hidden"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
