import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export const revalidate = 0;

export default function TrainerLayout({ children }) {
  return (
    <div className="flex-1 flex flex-col md:flex-row bg-zinc-50">
      <Sidebar role="trainer" />
      <section className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        {children}
      </section>
    </div>
  );
}
