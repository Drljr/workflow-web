// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setMsg(""); setErr(""); setBusy(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
            setMsg("A reset code/link has been sent to your email.");
        } catch (e2) {
            setErr(e2?.message || "Failed to send reset email.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            // Exact background from your spec
            style={{
                backgroundImage:
                    "conic-gradient(from 59.35deg at 67.13% -3.89%, #06B6D4 -88.01deg, #0F172A 72.51deg, #0F172A 146.39deg, #06B6D4 271.99deg, #0F172A 432.51deg)",
            }}
        >
            <div className="w-full max-w-md text-center text-white">
                {/* lock */}
                <div className="mx-auto mb-4 h-12 w-12 rounded-full/50 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-10 w-10">
                        <path
                            fill="currentColor"
                            d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-6 0V6a2 2 0 1 1 4 0v2h-4Z"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold">Forgot your password?</h1>
                <p className="mt-2 text-xl text-white/80">
                    A code will be sent to your email to help reset password
                </p>

                <form onSubmit={onSubmit} className="mt-6 text-left">
                    <label className="mb-2 block text-xs tracking-wide text-white/70">EMAIL</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="johndoe@gmail.com"
                        className="w-full rounded-md bg-white text-gray-900 placeholder:text-gray-500
                       border border-white/20 shadow-md p-3 focus:outline-none
                       focus:ring-2 focus:ring-cyan-400"
                    />

                    {err && <p className="mt-3 text-sm text-red-200">{err}</p>}
                    {msg && <p className="mt-3 text-sm text-emerald-200">{msg}</p>}

                    <button
                        type="submit"
                        disabled={busy}
                        className="mt-6 w-full rounded-md px-4 py-3 font-semibold text-white
                       disabled:opacity-60"
                        style={{ backgroundColor: "#0E7490" }} /* teal-ish button from your mock */
                    >
                        {busy ? "Sending…" : "Submit"}
                    </button>
                </form>

                <div className="mt-6">
                    <Link to="/login" className="inline-flex items-center gap-2 text-white/90 font-semibold hover:text-white">
                        <span aria-hidden>←</span> Back to Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
