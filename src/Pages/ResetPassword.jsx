// src/pages/ResetPassword.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const accent = "#0EA5A6"; // button teal in the mock; tweak as you like

export default function ResetPassword() {
    const nav = useNavigate();
    const [code, setCode] = useState("");               // UI only for now
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    // If arriving from Supabase email link, exchange code for a session.
    useEffect(() => {
        supabase.auth.exchangeCodeForSession(window.location.href).catch(() => { });
    }, []);

    async function onSubmit(e) {
        e.preventDefault();
        setMsg(""); setErr("");

        if (!password || !confirm) {
            setErr("Please enter and confirm your new password.");
            return;
        }
        if (password !== confirm) {
            setErr("Passwords do not match.");
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            setMsg("Password updated. Redirecting to sign in…");
            setTimeout(() => nav("/login"), 900);
        } catch (e) {
            setErr(e?.message || "Failed to update password.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div
            className="
        min-h-screen text-white
        bg-[conic-gradient(from_59.35deg_at_67.13%_-3.89%,_#06B6D4_-88.01deg,_#0F172A_72.51deg,_#0F172A_146.39deg,_#06B6D4_271.99deg,_#0F172A_432.51deg)]
      "
        >
            <div className="mx-auto flex min-h-screen max-w-xl items-center px-6">
                <div className="w-full">
                    {/* Lock icon */}
                    <div className="mb-4 flex justify-center">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                            <svg width="22" height="22" viewBox="0 0 24 24" className="text-white/90">
                                <path fill="currentColor" d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2ZM9 6a3 3 0 0 1 6 0v2H9Zm8 13H7v-9h10Z" />
                            </svg>
                        </span>
                    </div>

                    <h1 className="text-center text-3xl font-extrabold tracking-tight">Reset Password</h1>
                    <p className="mt-2 text-center text-sm text-white/80">
                        Please enter the code and your new password
                    </p>

                    <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-md space-y-4">
                        {/* CODE (visual, optional) */}
                        <input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="CODE SENT"
                            className="w-full rounded-md border border-white/20 bg-white/8 px-4 py-3 text-white
                         placeholder:uppercase placeholder:text-[11px] placeholder:tracking-wide placeholder:text-white/60
                         focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40 outline-none"
                            autoComplete="one-time-code"
                            inputMode="text"
                        />

                        {/* NEW PASSWORD */}
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="NEW PASSWORD"
                            className="w-full rounded-md border border-white/20 bg-white/8 px-4 py-3 text-white
                         placeholder:uppercase placeholder:text-[11px] placeholder:tracking-wide placeholder:text-white/60
                         focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40 outline-none"
                            autoComplete="new-password"
                        />

                        {/* CONFIRM PASSWORD */}
                        <input
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="CONFIRM PASSWORD"
                            className="w-full rounded-md border border-white/20 bg-white/8 px-4 py-3 text-white
                         placeholder:uppercase placeholder:text-[11px] placeholder:tracking-wide placeholder:text-white/60
                         focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40 outline-none"
                            autoComplete="new-password"
                        />

                        {/* Alerts */}
                        {err && (
                            <div className="rounded-md border border-red-300 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                                {err}
                            </div>
                        )}
                        {msg && (
                            <div className="rounded-md border border-emerald-300 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                                {msg}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-md px-4 py-3 font-semibold text-white transition
                         disabled:opacity-60"
                            style={{ backgroundColor: accent }}
                        >
                            {submitting ? "Submitting…" : "Submit"}
                        </button>

                        <div className="mt-4 flex justify-center">
                            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
                                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M10 19l-7-7 7-7v4h8v6h-8z" /></svg>
                                Back to Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
