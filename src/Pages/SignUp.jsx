import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FloatingInput from "../Components/FloatingInput";
import FloatingSelect from "../Components/FloatingSelect";
import FormImage from "../assets/logreg.png";
import { supabase } from "../lib/supabaseClient";

const accent = "#000FDA";

export default function Signup() {
    const nav = useNavigate();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        gender: "",
        location: "",
        weight: "",
        height: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [general, setGeneral] = useState("");

    const update = (e) => setForm((f) => ({ ...f, [e.target.id]: e.target.value }));

    function validate() {
        const e = {};
        if (!form.firstName) e.firstName = "First name is required.";
        if (!form.lastName) e.lastName = "Last name is required.";
        if (!form.email) e.email = "Email is required.";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";
        if (!form.password) e.password = "Password is required.";
        else if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
        if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
        else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function onSubmit(ev) {
        ev.preventDefault();
        setGeneral("");
        if (!validate()) return;

        setSubmitting(true);
        try {
            // 1) Create auth user
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: { first_name: form.firstName, last_name: form.lastName }, // optional user metadata
                },
            });
            if (error) throw error;

            // 2) If user is already signed in (email confirmation OFF), create profile now
            const userId = data?.user?.id;
            const hasSession = Boolean(data?.session); // null when email confirmation is ON
            if (userId && hasSession) {
                const { error: upsertErr } = await supabase.from("profiles").upsert({
                    user_id: userId,
                    first_name: form.firstName,
                    last_name: form.lastName,
                    dob: form.dob || null,
                    gender: form.gender || null,
                    location: form.location || null,
                    weight: form.weight || null,
                    height: form.height || null,
                });
                if (upsertErr) throw upsertErr;
            }

            // 3) UX: tell them what happened, then route
            if (!hasSession) {
                setGeneral("Account created. Please check your email to confirm, then log in.");
            } else {
                setGeneral("Account created successfully.");
            }
            nav("/login");
        } catch (err) {
            // Friendlier errors
            const msg = err?.message || "Something went wrong. Please try again.";
            if (/already registered|user already exists/i.test(msg)) {
                setGeneral("An account with this email already exists.");
            } else if (/password/i.test(msg)) {
                setGeneral("Please use a stronger password (at least 6 characters).");
            } else {
                setGeneral(msg);
            }
        } finally {
            setSubmitting(false);
        }
    }


    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-900">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
                {/* Left */}
                <div className="flex items-center justify-center p-6 sm:p-10">
                    <div className="w-full max-w-md">
                        {/* FlowSpace logo (top-right) */}
                        <div className="mb-4 flex justify-end">
                            <div className="flex items-center gap-2">
                                <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: accent }} />
                                <span className="font-semibold text-gray-900 dark:text-white">FlowSpace</span>
                            </div>
                        </div>
                        <h1 className="header-text mb-6 text-gray-900 dark:text-white">Sign Up</h1>
                        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                            Let us know more about you
                        </p>

                        {/* Use the onSubmit function */}
                        <form onSubmit={onSubmit} noValidate>
                            {/* GRID: 1 col on mobile, 2 cols from md+ */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* First / Last (side-by-side) */}
                                <FloatingInput
                                    id="firstName"
                                    label="First name"
                                    value={form.firstName}
                                    onChange={update}
                                    required
                                    containerClass="md:col-span-1 mb-0"
                                    error={errors.firstName}
                                />
                                <FloatingInput
                                    id="lastName"
                                    label="Last name"
                                    value={form.lastName}
                                    onChange={update}
                                    required
                                    containerClass="md:col-span-1 mb-0"
                                    error={errors.lastName}
                                />

                                {/* Date of birth (full width) */}
                                <FloatingInput
                                    id="dob"
                                    label="Date of birth"
                                    type="date"
                                    value={form.dob}
                                    onChange={update}
                                    autoComplete="bday"
                                    containerClass="md:col-span-2 mb-0"
                                    error={errors.dob}
                                />

                                {/* Email (full width) */}
                                <FloatingInput
                                    id="email"
                                    type="email"
                                    label="Email"
                                    value={form.email}
                                    onChange={update}
                                    autoComplete="email"
                                    required
                                    containerClass="md:col-span-2 mb-0"
                                    error={errors.email}
                                />

                                {/* Gender (full width) */}
                                <FloatingSelect
                                    id="gender"
                                    label="Gender"
                                    value={form.gender}
                                    onChange={update}
                                    required
                                    options={[
                                        { value: "male", label: "Male" },
                                        { value: "female", label: "Female" },
                                        { value: "other", label: "Other" },
                                        { value: "prefer_not", label: "Prefer not to say" },
                                    ]}
                                    containerClass="md:col-span-2 mb-0"
                                    error={errors.gender}
                                />

                                {/* Location (full width) */}
                                <FloatingInput
                                    id="location"
                                    label="Location of residence"
                                    value={form.location}
                                    onChange={update}
                                    containerClass="md:col-span-2 mb-0"
                                    error={errors.location}
                                />

                                {/* Weight / Height (side-by-side) */}
                                <FloatingInput
                                    id="weight"
                                    label="Weight"
                                    value={form.weight}
                                    onChange={update}
                                    containerClass="md:col-span-1 mb-0"
                                    error={errors.weight}
                                />
                                <FloatingInput
                                    id="height"
                                    label="Height"
                                    value={form.height}
                                    onChange={update}
                                    containerClass="md:col-span-1 mb-0"
                                    error={errors.height}
                                />

                                {/* Passwords (full width each) */}
                                <FloatingInput
                                    id="password"
                                    type="password"
                                    label="Password"
                                    value={form.password}
                                    onChange={update}
                                    withToggle
                                    required
                                    containerClass="md:col-span-2 mb-0"
                                    error={errors.password}
                                />
                                <FloatingInput
                                    id="confirmPassword"
                                    type="password"
                                    label="Confirm password"
                                    value={form.confirmPassword}
                                    onChange={update}
                                    withToggle
                                    required
                                    containerClass="md:col-span-2 mb-0"
                                    error={errors.confirmPassword}
                                />
                            </div>

                            {general && (
                                <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                                    {general}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-6 w-full rounded-md bg-[#000FDA] px-4 py-2 text-white font-semibold transition hover:bg-[#000CC4] disabled:opacity-60"
                            >
                                {submitting ? "Creating account..." : "Sign Up"}
                            </button>
                        </form>

                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                            Already signed up?{" "}
                            <Link to="/login" className="text-[#000FDA] hover:underline">Login</Link>
                        </p>
                    </div>
                </div>

                {/* Right */}
                <div className="relative hidden lg:block">
                    <img src={FormImage} alt="Signup Visual" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/10" />
                </div>
            </div>
        </div>
    );
}
