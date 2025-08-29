import { useState } from "react";
import { Link } from "react-router-dom";
import FloatingInput from "../components/FloatingInput";
import FormImage from "../assets/logreg.png";

export default function Login() {
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
            // No API yet — simulate submit and log values
            await new Promise((r) => setTimeout(r, 400));
            console.log("LOGIN SUBMIT:", form);
        } catch (error) {
            console.error("Login failed:", error);
            setGeneral("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-900">
            <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
                {/* Left Side */}
                <div className="flex items-center justify-center p-6 sm:p-10">
                    <div className="w-full max-w-md">
                        <h1 className="header-text mb-6 text-gray-900 dark:text-white">Log In</h1>
                        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                            We love to have you back again!
                        </p>

                        <form onSubmit={onSubmit} noValidate>
                            <FloatingInput
                                id="email"
                                type="email"
                                label="Email"
                                value={form.email}
                                onChange={update}
                                autoComplete="email"
                                required
                                error={errors.email}
                            />

                            <FloatingInput
                                id="password"
                                type="password"
                                label="Password"
                                value={form.password}
                                onChange={update}
                                autoComplete="current-password"
                                required
                                error={errors.password}
                                withToggle
                            />

                            <div className="mb-4 flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        checked={form.remember}
                                        onChange={update}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                                    />
                                    Remember me
                                </label>
                                <Link to="#" className="text-sm text-blue-600 hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>

                            {general && (
                                <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                                    {general}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full mb-4 rounded-md bg-[#000FDA] px-4 py-2 text-white font-semibold bg-[#000CC4] disabled:opacity-60"
                            >
                                {submitting ? "Signing in..." : "Log In"}
                            </button>
                        </form>

                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                            Don&apos;t have an account?{" "}
                            <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
                        </p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="relative hidden lg:block">
                    <img src={FormImage} alt="Login Visual" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>
            </div>
        </div>
    );
}
