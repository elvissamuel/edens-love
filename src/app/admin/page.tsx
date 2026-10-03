import type { Metadata } from "next";
import { AdminGifts } from "@/components/AdminGifts";

export const metadata: Metadata = {
  title: "Gift admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="min-h-full bg-ivory px-5 py-16">
      <AdminGifts />
    </main>
  );
}
