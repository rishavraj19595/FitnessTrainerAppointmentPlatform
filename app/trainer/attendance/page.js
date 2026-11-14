"use client";

import React, { useState, useEffect } from "react";
import { CheckSquare, UserCheck, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateIST } from "@/lib/utils";
import { toast } from "sonner";

export default function TrainerAttendancePage() {
  const [trainees, setTrainees] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedTrainee, setSelectedTrainee] = useState("");
  const [status, setStatus] = useState("PRESENT");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tRes, aRes] = await Promise.all([
        fetch("/api/trainees"),
        fetch("/api/attendance"),
      ]);
      const tData = await tRes.json();
      const aData = await aRes.json();

      setTrainees(tData.trainees || []);
      setAttendanceLogs(aData.attendance || []);
      if (tData.trainees?.length > 0) {
        setSelectedTrainee(tData.trainees[0].userId);
      }
    } catch (err) {
      toast.error("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!selectedTrainee) {
      toast.error("Please select a trainee.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          traineeId: selectedTrainee,
          date: new Date(),
          status,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(`Attendance marked as ${status} successfully!`);
      setNotes("");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to record attendance");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Attendance Verification & Logging
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Record attendance for gym sessions. Trainees cannot mark attendance themselves.
        </p>
      </div>

      {/* Record Attendance Form Card */}
      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-black" />
          Mark Session Attendance (IST)
        </h2>

        <form onSubmit={handleMarkAttendance} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-zinc-700 mb-1">Select Trainee</label>
            <select
              value={selectedTrainee}
              onChange={(e) => setSelectedTrainee(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black font-semibold"
            >
              {trainees.map((t) => (
                <option key={t.id} value={t.userId}>
                  {t.name} ({t.fitnessGoal})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-zinc-700 mb-1">Attendance Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black font-semibold"
            >
              <option value="PRESENT">PRESENT (Attended Gym)</option>
              <option value="ABSENT">ABSENT (Missed Session)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-zinc-700 mb-1">Session Remarks</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Chest workout completed with 75kg bench"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="sm:col-span-3 pt-2">
            <Button
              type="submit"
              disabled={submitting || trainees.length === 0}
              className="bg-black text-white hover:bg-zinc-800 text-xs font-bold h-9 px-6"
            >
              {submitting ? "Saving..." : "Submit Attendance Record"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Attendance Logs Table */}
      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider">
          Recent Attendance History Logbook ({attendanceLogs.length})
        </h2>

        {loading ? (
          <p className="text-xs text-zinc-500 text-center py-6">Loading logs...</p>
        ) : attendanceLogs.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-6">No attendance records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-zinc-50 text-zinc-500 font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-4">Date (IST)</th>
                  <th className="py-2.5 px-4">Trainee</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Session Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y text-zinc-700">
                {attendanceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50/50">
                    <td className="py-3 px-4 font-semibold text-black">
                      {formatDateIST(log.date)}
                    </td>
                    <td className="py-3 px-4 font-bold text-zinc-900">
                      {log.traineeName}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={log.status === "PRESENT" ? "success" : "danger"}
                        className="text-[10px]"
                      >
                        {log.status === "PRESENT" ? (
                          <CheckCircle2 className="h-3 w-3 inline mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 inline mr-1" />
                        )}
                        {log.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-zinc-500">
                      {log.notes || "Completed"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
