import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FloatingInput from "../components/FloatingInput";
import FloatingSelect from "../components/FloatingSelect";
import FormImage from "../assets/logreg.png";

export default function SignUp() {
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
            // simulate request — replace with real API later
            await new Promise((r) => setTimeout(r, 500));
            console.log("SIGNUP SUBMIT:", form);
            nav("/login");
        } catch (error) {
            console.error("Signup failed:", error);
            setGeneral(error?.message || "Something went wrong. Please try again.");
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
                                    type="text"
                                    value={form.dob}
                                    onChange={update}
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
