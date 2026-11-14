"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";
import { QrCode, CreditCard, Landmark, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  itemTitle,
  orderId,
  onSuccess,
}) {
  const [activeTab, setActiveTab] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState("rahul@oksbi");

  const handleSimulatePayment = async (success = true) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    if (!success) {
      setLoading(false);
      toast.error("Payment was declined or cancelled. No charges were made.");
      return;
    }

    const simulatedPaymentId = `pay_test_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .substring(2, 6)}`;
    const simulatedSignature = "test_signature_valid";

    try {
      if (onSuccess) {
        await onSuccess({
          orderId: orderId || `order_inr_${Date.now()}`,
          paymentId: simulatedPaymentId,
          signature: simulatedSignature,
        });
      }
      toast.success("Payment verified successfully via Razorpay!");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to confirm payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Razorpay Secure Checkout" maxWidth="max-w-md">
      <div className="space-y-5">
        {/* Header badge & details */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div>
            <p className="text-xs text-zinc-500 font-medium">Paying for</p>
            <p className="font-bold text-sm text-zinc-900 truncate max-w-[200px]">
              {itemTitle || "Personal Fitness Coaching"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 font-medium">Total Amount</p>
            <p className="text-xl font-black text-black">
              {formatINR(amount)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-zinc-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            256-Bit SSL Secured
          </span>
          <Badge variant="secondary" className="text-[10px] bg-zinc-200 text-zinc-800">
            Razorpay Test Sandbox
          </Badge>
        </div>

        {/* Payment Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab("upi")}
            className={`py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "upi"
                ? "bg-white text-black shadow-sm"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            UPI
          </button>
          <button
            onClick={() => setActiveTab("card")}
            className={`py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "card"
                ? "bg-white text-black shadow-sm"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            Card
          </button>
          <button
            onClick={() => setActiveTab("netbanking")}
            className={`py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "netbanking"
                ? "bg-white text-black shadow-sm"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            <Landmark className="h-3.5 w-3.5" />
            NetBanking
          </button>
        </div>

        {/* Tab 1: UPI */}
        {activeTab === "upi" && (
          <div className="space-y-4 pt-1">
            <div className="flex flex-col items-center justify-center p-4 border border-zinc-200 rounded-xl bg-zinc-50 space-y-2">
              <div className="h-28 w-28 bg-white border border-zinc-300 rounded-lg flex items-center justify-center shadow-inner">
                <QrCode className="h-20 w-20 text-zinc-800" />
              </div>
              <p className="text-[11px] text-zinc-600 text-center">
                Scan with any Indian UPI App: <br />
                <span className="font-semibold text-zinc-900">GPay • PhonePe • Paytm • BHIM • CRED</span>
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Or enter UPI ID / VPA
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Card */}
        {activeTab === "card" && (
          <div className="space-y-3 pt-1 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Card Number</label>
              <input
                type="text"
                defaultValue="4242 •••• •••• 4242"
                disabled
                className="w-full px-3 py-2 border border-zinc-300 bg-zinc-50 rounded-lg font-mono text-zinc-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Expiry</label>
                <input
                  type="text"
                  defaultValue="12/28"
                  disabled
                  className="w-full px-3 py-2 border border-zinc-300 bg-zinc-50 rounded-lg font-mono text-zinc-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">CVV</label>
                <input
                  type="password"
                  defaultValue="123"
                  disabled
                  className="w-full px-3 py-2 border border-zinc-300 bg-zinc-50 rounded-lg font-mono text-zinc-600"
                />
              </div>
            </div>
            <p className="text-[11px] text-zinc-500">
              Supports RuPay, Visa, and Mastercard with OTP simulation.
            </p>
          </div>
        )}

        {/* Tab 3: NetBanking */}
        {activeTab === "netbanking" && (
          <div className="space-y-2 pt-1 text-xs">
            <p className="font-semibold text-zinc-700">Select Popular Indian Bank:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Kotak Mahindra"].map(
                (bank, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 border border-zinc-200 rounded-lg hover:border-black cursor-pointer font-medium text-zinc-800 transition-colors"
                  >
                    {bank}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={() => handleSimulatePayment(true)}
            disabled={loading}
            className="w-full h-11 bg-black text-white hover:bg-zinc-800 text-sm font-bold flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {loading ? "Processing with Razorpay..." : `Pay ${formatINR(amount)} • Simulate Success`}
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleSimulatePayment(false)}
            disabled={loading}
            className="w-full text-xs text-zinc-500 hover:text-red-600"
          >
            Simulate Payment Failure
          </Button>
        </div>
      </div>
    </Modal>
  );
}
