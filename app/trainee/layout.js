import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";

export const revalidate = 0;

export default async function TraineeLayout({ children }) {
  const session = await getServerSession(authOptions);

  // Before login: Hide sidebar completely for unauthenticated visitors
  if (!session) {
    return (
      <main className="flex-1 bg-zinc-50 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    );
  }

  // After login: Keep everything exactly as it is with the role-based sidebar
  return (
    <div className="flex-1 flex flex-col md:flex-row bg-zinc-50">
      <Sidebar role="trainee" />
      <section className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        {children}
      </section>
    </div>
  );
}
