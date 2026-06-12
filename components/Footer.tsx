"use client";

import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border bg-card mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-muted">{t("footer.text")}</div>
    </footer>
  );
}
