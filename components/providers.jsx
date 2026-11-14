"use client";

import React, { useEffect } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { Toaster } from "sonner";

function SessionTabWatcher() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let channel = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel("fitpulse_tab_channel");
        channel.onmessage = (event) => {
          if (event.data === "CHECK_ACTIVE_TAB") {
            // Reply if current tab is active
            if (sessionStorage.getItem("fitpulse_session_active") === "true") {
              channel.postMessage("TAB_IS_ACTIVE");
            }
          } else if (event.data === "TAB_IS_ACTIVE") {
            // Received affirmation from another running tab in this browser session
            sessionStorage.setItem("fitpulse_session_active", "true");
          } else if (event.data === "USER_LOGGED_OUT") {
            sessionStorage.removeItem("fitpulse_session_active");
          }
        };
      }
    } catch (e) {
      console.warn("BroadcastChannel not supported", e);
    }

    // If authenticated:
    if (status === "authenticated") {
      // 1. Check if user is suspended in active session
      if (session?.user?.status === "suspended") {
        sessionStorage.removeItem("fitpulse_session_active");
        signOut({ redirect: true, callbackUrl: "/login?error=account_suspended" });
        return;
      }

      // 2. Check if current tab was reopened fresh after window/tab close
      const isTabActive = sessionStorage.getItem("fitpulse_session_active") === "true";

      if (!isTabActive) {
        // Broadcast to check if any other sibling tab is currently open
        if (channel) {
          channel.postMessage("CHECK_ACTIVE_TAB");
        }

        // Allow 300ms for sibling tabs to reply. If no tab answers, all tabs/windows were closed!
        const timer = setTimeout(() => {
          const tabAffirmed = sessionStorage.getItem("fitpulse_session_active") === "true";
          if (!tabAffirmed) {
            // All tabs/windows were previously closed. Automatically log out!
            sessionStorage.removeItem("fitpulse_session_active");
            if (channel) {
              channel.postMessage("USER_LOGGED_OUT");
            }
            signOut({ redirect: true, callbackUrl: "/login?reason=session_ended" });
          }
        }, 300);

        return () => clearTimeout(timer);
      }
    } else if (status === "unauthenticated") {
      sessionStorage.removeItem("fitpulse_session_active");
    }

    return () => {
      if (channel) channel.close();
    };
  }, [status, session]);

  return null;
}

export function Providers({ children }) {
  return (
    <SessionProvider>
      <SessionTabWatcher />
      {children}
      <Toaster position="top-right" richColors />
    </SessionProvider>
  );
}
