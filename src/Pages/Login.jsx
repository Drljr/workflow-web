import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FloatingInput from "../Components/FloatingInput";
import FormImage from "../assets/logreg.jpg";
import { supabase } from "../lib/supabaseClient";

const teal = "#0E7490";

export default function Login() {
    const nav = useNavigate();
    const [form, setForm] = useState({ email: "", password: "", remember: true });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [general, setGeneral] = useState("");

    function update(e) {
        const { id, value, type, checked } = e.target;
        setForm((f) => ({ ...f, [id]: type === "checkbox" ? checked : value }));
    }

    function validate() {
        const e = {};
        if (!form.email) e.email = "Email is required.";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";
        if (!form.password) e.password = "Password is required.";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function onSubmit(ev) {
        ev.preventDefault();
        setGeneral("");
        if (!validate()) return;

        setSubmitting(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password,
            });
            if (error) throw error;

            nav("/home");
        } catch (err) {
            const msg = err?.message || "Something went wrong. Please try again.";
            if (/invalid login credentials/i.test(msg)) setGeneral("Incorrect email or password.");
            else if (/email not confirmed/i.test(msg)) setGeneral("Please confirm your email, then try again.");
            else setGeneral(msg);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-900">
            {/* Use min-h-screen here (not h-screen) */}
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
                {/* LEFT: gradient + form */}
                <div
                    className="relative flex items-center justify-center px-6 py-10"
                    style={{
                        backgroundImage:
                            "conic-gradient(from 59.35deg at 109.13% -2.89%, #06B6D4 -88.01deg, #0F172A 72.51deg, #0F172A 146.39deg, #06B6D4 271.99deg, #0F172A 432.51deg)",
                    }}
                >
                    <div className="w-full max-w-xl">
                        <div className="mb-4 flex justify-end">
                            <div className="flex items-center gap-2">
                                <span className="inline-block rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-[10px] font-black tracking-wider text-white">
                                    ONUIGBO{" "}
                                    <span className="ml-1 rounded-sm bg-cyan-400 px-1 text-slate-900">
                                        FLOWSPACE
                                    </span>
                                </span>
                            </div>
                        </div>

                        <h1 className="text-center text-4xl md:text-5xl font-extrabold text-white">Sign in</h1>
                        <p className="mt-2 text-center text-white/80">
                            Welcome Back, Please Enter your Details
                        </p>

                        <form onSubmit={onSubmit} noValidate className="mx-auto mt-8 space-y-5 max-w-lg">
                            <FloatingInput
                                id="email"
                                label="EMAIL"
                                type="email"
                                value={form.email}
                                onChange={update}
                                autoComplete="email"
                                error={errors.email}
                            />
                            <FloatingInput
                                id="password"
                                label="PASSWORD"
                                type="password"
                                value={form.password}
                                onChange={update}
                                autoComplete="current-password"
                                error={errors.password}
                            />

                            <div className="flex items-center justify-between text-white/90">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        checked={form.remember}
                                        onChange={update}
                                        className="h-4 w-4 rounded border-white/30 bg-transparent text-cyan-400 focus:ring-cyan-400"
                                    />
                                    Remember me
                                </label>
                                <Link to="/forgot-password" className="text-sm hover:underline text-cyan-200">
                                    Forgot Password ?
                                </Link>
                            </div>

                            {general && (
                                <div className="rounded-md border border-rose-200/50 bg-rose-900/20 p-2 text-sm text-rose-100">
                                    {general}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-md px-4 py-3 font-semibold text-white disabled:opacity-60"
                                style={{ backgroundColor: teal }}
                            >
                                {submitting ? "Signing in…" : "Sign in"}
                            </button>

                            <p className="text-white/90">
                                Don’t have an account ?{" "}
                                <Link to="/signup" className="font-semibold text-cyan-200 hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>

                {/* Right Side */}
                <div className="relative hidden lg:block">
                    <img
                        src={FormImage}
                        alt="Login Visual"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    {/* gradient overlay */}
                    <div
                        className="absolute inset-0 opacity-90"
                        style={{
                            background:
                                "conic-gradient(from 59.35deg at 67.13% -3.89%, #06B6D4 -88.01deg, #0F172A 52.51deg, #0F172A 146.39deg, #06B6D4 271.99deg, #0F172A 432.51deg)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
