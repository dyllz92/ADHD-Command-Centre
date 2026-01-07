import type { Metadata } from "next";
import "@/styles/globals.css";
import { BottomTabs } from "@/components/ui/BottomTabs";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "ADHD Command Centre",
  description: "Gentle command dashboard for ADHD support",
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body className="min-h-screen bg-sand-50 font-sans text-ink-900">
        <Providers>
          <ServiceWorkerRegistrar />
          <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-24 pt-6">
            <main className="flex-1 space-y-6">{children}</main>
          </div>
          <BottomTabs />
        </Providers>
      </body>
    </html>
  );
}
