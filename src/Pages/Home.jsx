// src/pages/Home.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import HomeBg from "../assets/home.png";
import contactPhoto from "../assets/contact.png";

const accent = "#000FDA";

/* --- helpers --- */
function AboutCard({ src, caption }) {
    return (
        <div className="relative overflow-hidden rounded-2xl shadow-md ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800">
            <img
                src={src}
                alt={caption}
                className="h-72 md:h-80 lg:h-[22rem] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white text-sm font-medium drop-shadow">
                {caption}
            </div>
        </div>
    );
}

function FeatureTile({ icon, title, text }) {
    return (
        <div className="h-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full ring-1 ring-gray-300 dark:ring-gray-600 text-[#000FDA]">
                    {icon}
                </div>
                <div>
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h4>
                    <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{text}</p>
                </div>
            </div>
        </div>
    );
}

/* Labeled inputs for the Contact form (label above field) */
function LabeledInput({ id, label, type = "text", value, onChange, className = "" }) {
    return (
        <div className={`mb-4 ${className}`}>
            <label
                htmlFor={id}
                className="mb-1 block text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
            >
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 p-3 text-sm
                   text-gray-900 dark:text-white bg-transparent dark:bg-transparent
                   focus:border-[#000FDA] focus:ring-[#000FDA]"
            />
        </div>
    );
}

function LabeledTextarea({ id, label, value, onChange, rows = 6, className = "" }) {
    return (
        <div className={`mb-4 ${className}`}>
            <label
                htmlFor={id}
                className="mb-1 block text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
            >
                {label}
            </label>
            <textarea
                id={id}
                rows={rows}
                value={value}
                onChange={onChange}
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 p-3 text-sm
                   text-gray-900 dark:text-white bg-transparent dark:bg-transparent
                   focus:border-[#000FDA] focus:ring-[#000FDA]"
            />
        </div>
    );
}

/* --- page --- */
export default function Home() {
    // Contact form state
    const [contact, setContact] = useState({
        fullName: "",
        email: "",
        phone: "",
        country: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState({ submitting: false, success: "", error: "" });

    const updateContact = (e) =>
        setContact((c) => ({ ...c, [e.target.id]: e.target.value }));

    function validateContact() {
        const e = {};
        if (!contact.fullName.trim()) e.fullName = "Full name is required.";
        if (!contact.email) e.email = "Email is required.";
        else if (!/^\S+@\S+\.\S+$/.test(contact.email)) e.email = "Enter a valid email.";
        if (!contact.message.trim()) e.message = "Please enter a message.";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function submitContact(ev) {
        ev.preventDefault();
        setStatus({ submitting: false, success: "", error: "" });

        if (!validateContact()) return;

        try {
            setStatus({ submitting: true, success: "", error: "" });

            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contact),
            });

            // Robust parse to avoid "Unexpected end of JSON input"
            const ct = res.headers.get("content-type") || "";
            const isJSON = ct.includes("application/json");
            let data = null;
            let text = "";
            try {
                if (isJSON) data = await res.json();
                else text = await res.text();
            } catch {
                // ignore parse errors (empty body)
            }

            if (!res.ok) {
                const msg = data?.error || text || `Request failed (${res.status})`;
                throw new Error(msg);
            }

            setStatus({
                submitting: false,
                success: "Message sent! We’ll get back to you shortly.",
                error: "",
            });
            setContact({ fullName: "", email: "", phone: "", country: "", message: "" });
            setErrors({});
        } catch (err) {
            setStatus({
                submitting: false,
                success: "",
                error: err?.message || "Something went wrong. Please try again.",
            });
        }
    }

    return (
        <div id="top" className="min-h-screen bg-[#FDFDFD] dark:bg-gray-900">
            {/* NAVBAR */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/70 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <div className="font-semibold tracking-wide text-gray-900 dark:text-white">LOGO</div>
                    <nav className="hidden gap-3 md:flex">
                        {[
                            { href: "#top", label: "HOME" },
                            { href: "#about", label: "ABOUT US" },
                            { href: "#features", label: "SERVICES" },
                            { href: "#contact", label: "CONTACT US" },
                        ].map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="rounded-full border px-4 py-1.5 text-sm"
                                style={{ borderColor: accent, color: accent }}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-2 md:flex">
                        <Link
                            to="/signup"
                            className="rounded-full border px-4 py-1.5 text-sm"
                            style={{ borderColor: accent, color: accent }}
                        >
                            Sign Up
                        </Link>
                        <Link
                            to="/login"
                            className="rounded-full border px-4 py-1.5 text-sm"
                            style={{ borderColor: accent, color: accent }}
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
                <div className="grid items-center gap-10 md:grid-cols-2">
                    <div>
                        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">Work Smarter. Together.</p>
                        <h1 className="mt-2 header-text font-extrabold text-gray-900 dark:text-white md:text-4xl">
                            ONUIGBO <span className="block">FLOWSPACE</span>
                        </h1>
                        <p className="mt-3 max-w-md text-sm md:text-base text-gray-600 dark:text-gray-300">
                            FlowSpace helps teams collaborate, organize tasks, and bring ideas to life effortlessly.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                to="/signup"
                                className="rounded-full px-5 py-2 text-sm font-semibold text-white shadow"
                                style={{ backgroundColor: accent }}
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/login"
                                className="rounded-full border px-5 py-2 text-sm font-semibold"
                                style={{ borderColor: accent, color: accent }}
                            >
                                Log in
                            </Link>
                        </div>
                    </div>

                    <div className="mx-auto max-w-md md:max-w-none relative isolate">
                        <img
                            src={HomeBg}
                            alt="Hero"
                            className="w-full object-contain mask-soft mix-blend-lighten dark:mix-blend-multiply dark:opacity-90"
                        />
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section id="about" className="mx-auto max-w-6xl px-4 py-10 md:py-14">
                <div className="text-center">
                    <span
                        className="rounded-full border px-4 py-1.5 text-sm md:text-base font-bold tracking-wide"
                        style={{ borderColor: accent, color: accent }}
                    >
                        ABOUT US
                    </span>
                    <p className="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-300">
                        Our mission is helping you track, test, and understand user behavior with ease
                    </p>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <AboutCard src={HomeBg} caption="Keep tasks and projects in one place." />
                    <AboutCard src={HomeBg} caption="Connect with your team in real time." />
                    <AboutCard src={HomeBg} caption="Streamline workflows to achieve more." />
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="mx-auto max-w-6xl px-4 py-10 md:py-14">
                <div className="text-center">
                    <span
                        className="rounded-full border px-4 py-1.5 text-sm md:text-base font-bold tracking-wide"
                        style={{ borderColor: accent, color: accent }}
                    >
                        OUR FEATURES
                    </span>
                    <p className="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-300">Powerful tools to keep your team in flow.</p>
                </div>

                <div className="mt-8 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <FeatureTile
                        icon={<svg viewBox="0 0 24 24" className="h-6 w-6"><path fill="currentColor" d="M5 5h14v14H5zM8 8h8v2H8zm0 4h6v2H8z" /></svg>}
                        title="Smart Notes"
                        text="Capture ideas instantly and keep them organized for your team."
                    />
                    <FeatureTile
                        icon={<svg viewBox="0 0 24 24" className="h-6 w-6"><path fill="currentColor" d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2ZM18 16v-5a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z" /></svg>}
                        title="Instant Alerts"
                        text="Get notified about important updates the moment they happen."
                    />
                    <FeatureTile
                        icon={<svg viewBox="0 0 24 24" className="h-6 w-6"><path fill="currentColor" d="M7 3h10a2 2 0 0 1 2 2v14l-7-3-7 3V5a2 2 0 0 1 2-2Z" /></svg>}
                        title="Shared Calendars"
                        text="Coordinate schedules and keep everyone aligned."
                    />
                    <FeatureTile
                        icon={<svg viewBox="0 0 24 24" className="h-6 w-6"><path fill="currentColor" d="M14 3H6a2 2 0 0 0-2 2v14l4-2 4 2 4-2 4 2V9" /></svg>}
                        title="File Hub"
                        text="Store, share, and access files without switching apps."
                    />
                    <FeatureTile
                        icon={<svg viewBox="0 0 24 24" className="h-6 w-6"><path fill="currentColor" d="M3 13h4v8H3v-8Zm7-6h4v14h-4V7Zm7 3h4v11h-4V10Z" /></svg>}
                        title="Workflow Insights"
                        text="Visualize productivity trends with easy-to-read reports."
                    />
                    <FeatureTile
                        icon={<svg viewBox="0 0 24 24" className="h-6 w-6"><path fill="currentColor" d="M12 2l3 7h7l-5.5 4.2L18 21l-6-4-6 4 1.5-7.8L2 9h7z" /></svg>}
                        title="OKR Tracking"
                        text="Set clear objectives and measure progress as a team."
                    />
                </div>

                <p className="mt-6 text-center text-sm md:text-base text-gray-500 dark:text-gray-400">
                    FlowSpace is built to scale with your team, whether you’re 2 people or 200.
                </p>

                <div className="mt-6 text-center">
                    <a
                        href="#contact"
                        className="rounded-full border px-4 py-1.5 text-sm md:text-base font-bold"
                        style={{ borderColor: accent, color: accent }}
                    >
                        CONTACT US
                    </a>
                </div>
            </section>

            {/* CONTACT */}
            <section id="contact" className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
                <div className="grid items-stretch gap-8 md:grid-cols-2">
                    {/* Left image */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow h-full md:min-h-[520px]">
                        <img src={contactPhoto} alt="Contact" className="h-full w-full object-cover" />
                    </div>

                    {/* Right form with labels */}
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow h-full md:min-h-[520px] flex flex-col">
                        <h2 className="header-text text-gray-900 dark:text-white">Let’s Build Together</h2>
                        <p className="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-300">
                            We’d love to hear from you. Whether it’s feedback, partnership, or support.
                        </p>

                        <form onSubmit={submitContact} noValidate className="mt-10 grow">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <LabeledInput id="fullName" label="Full Name" value={contact.fullName} onChange={updateContact} className="md:col-span-1" />
                                {errors.fullName && <p className="-mt-3 text-xs text-red-600 md:col-span-1">{errors.fullName}</p>}

                                <LabeledInput id="email" label="Email" type="email" value={contact.email} onChange={updateContact} className="md:col-span-1" />
                                {errors.email && <p className="-mt-3 text-xs text-red-600 md:col-span-1">{errors.email}</p>}

                                <LabeledInput id="phone" label="Phone Number" value={contact.phone} onChange={updateContact} className="md:col-span-1" />
                                <LabeledInput id="country" label="Country" value={contact.country} onChange={updateContact} className="md:col-span-1" />

                                <LabeledTextarea id="message" label="How Can We Help?" value={contact.message} onChange={updateContact} className="md:col-span-2" />
                                {errors.message && <p className="-mt-3 text-xs text-red-600 md:col-span-2">{errors.message}</p>}
                            </div>

                            {/* Alerts */}
                            {status.error && (
                                <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-700" role="alert">
                                    {status.error}
                                </div>
                            )}
                            {status.success && (
                                <div className="mt-4 rounded-md border border-green-300 bg-green-50 p-2 text-sm text-green-700" role="status">
                                    {status.success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status.submitting}
                                className="mt-4 w-full rounded-md px-4 py-2 text-white font-semibold disabled:opacity-60"
                                style={{ backgroundColor: accent }}
                            >
                                {status.submitting ? "Sending…" : "Send your Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
