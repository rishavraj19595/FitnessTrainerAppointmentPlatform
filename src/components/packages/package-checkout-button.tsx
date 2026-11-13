"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { CreditCard, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PackageCheckoutButtonProps {
  packageId: string;
  packageTitle: string;
  price: number;
}

export function PackageCheckoutButton({
  packageId,
  packageTitle,
  price,
}: PackageCheckoutButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleCheckout = async () => {
    if (!session) {
      toast.error("Please sign in or create an account to purchase packages");
      router.push("/login?redirect=" + window.location.pathname);
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create Order on server
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          type: "PACKAGE",
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to initialize order");
      }

      // If Razorpay SDK is available on window
      if (typeof window !== "undefined" && window.Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount * 100,
          currency: "INR",
          name: "FitPulse Platform",
          description: `Purchase: ${packageTitle}`,
          order_id: orderData.orderId,
          handler: async function (response: any) {
            // Step 2: Verify signature on server
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                packageId,
                amount: price,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              toast.success("Payment Successful! Workout Package Activated.");
              router.push("/dashboard/packages");
              router.refresh();
            } else {
              toast.error(verifyData.error || "Payment verification failed");
            }
          },
          prefill: {
            name: session.user.name || "",
            email: session.user.email || "",
          },
          theme: {
            color: "#059669",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          toast.error(response.error.description || "Payment failed");
        });
        rzp.open();
      } else {
        // Test mode fallback simulation
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: orderData.orderId,
            razorpayPaymentId: `pay_test_${Date.now()}`,
            razorpaySignature: "test_signature_valid",
            packageId,
            amount: price,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          toast.success("Test Mode: Payment Verified! Package Activated.");
          router.push("/dashboard/packages");
          router.refresh();
        } else {
          toast.error("Failed to verify transaction");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Checkout error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 h-11"
    >
      <CreditCard className="h-4 w-4" />
      <span>{loading ? "Processing..." : `Enroll Now • ${formatPrice(price)}`}</span>
    </Button>
  );
}
