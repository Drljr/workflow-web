import { useState } from "react";
import { Link } from "react-router-dom";
import HomeBg from "../assets/home.jpg";
import abBg from "../assets/ab-card2.jpg";
import abs from "../assets/ab-card1.jpg";
import aby from "../assets/ab-card3.jpg";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import contactPhoto from "../assets/contact.jpg";



/* ---------------- Framer Motion variants ---------------- */
const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

/* --- helpers --- */
function AboutCard({ src, caption }) {
    return (
        <motion.div
            variants={fadeUp}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5"
        >
            <img src={src} alt="" className="h-[400px] w-full object-cover" />

            {/* bottom glass panel */}
            <div className="absolute inset-x-5 bottom-6">
                <div
                    className="relative px-6 py-5 text-center
                    bg-white/10 backdrop-blur-2xl
                    border border-white/20 ring-1 ring-white/15
                    shadow-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]
                    rounded-2xl"
                >
                    {/* faint borders / highlights */}
                    <span className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10" />
                    <span className="pointer-events-none absolute -left-10 top-1/2 h-28 w-28 -translate-y-1/2 bg-white/20 blur-2xl" />
                    <span
                        className="pointer-events-none absolute left-1/2 top-0 h-full w-8 -translate-x-1/2
              bg-gradient-to-b from-white/35 via-white/10 to-transparent opacity-70 blur-md"
                    />
                    <p className="relative z-[1] text-white text-lg font-extrabold leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
                        {caption}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
AboutCard.propTypes = { src: PropTypes.string.isRequired, caption: PropTypes.string.isRequired };


function FeatureTile({ icon, title, text }) {
    return (
        <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="h-full rounded-2xl border border-white/12 bg-white/5 p-5 md:p-6 shadow-lg"
        >
            <div className="flex items-start gap-4">
                <motion.div
                    whileHover={{ rotate: 6 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16 }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-cyan-300"
                >
                    {icon}
                </motion.div>
                <div>
                    <h4 className="text-base font-semibold text-white">{title}</h4>
                    <p className="mt-1.5 text-sm text-slate-200/80 leading-relaxed">{text}</p>
                </div>
            </div>
        </motion.div>
    );
}
FeatureTile.propTypes = { icon: PropTypes.node.isRequired, title: PropTypes.string.isRequired, text: PropTypes.string.isRequired };

/* Labeled inputs for the Contact form */
function LabeledInput({ id, label, type = "text", value, onChange, className = "" }) {
    return (
        <div className={`mb-4 ${className}`}>
            <label htmlFor={id} className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                className="block w-full rounded-xl border border-white/12 bg-white/5 p-3 text-sm text-white placeholder:text-slate-300/70
                   focus:border-cyan-400/60 focus:ring-0"
            />
        </div>
    );
}
function LabeledTextarea({ id, label, value, onChange, rows = 6, className = "" }) {
    return (
        <div className={`mb-4 ${className}`}>
            <label htmlFor={id} className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                {label}
            </label>
            <textarea
                id={id}
                rows={rows}
                value={value}
                onChange={onChange}
                className="block w-full rounded-xl border border-white/12 bg-white/5 p-3 text-sm text-white placeholder:text-slate-300/70
                   focus:border-cyan-400/60 focus:ring-0"
            />
        </div>
    );
}

/* --- page --- */
export default function Home() {
    // Contact form state
    const [contact, setContact] = useState({ fullName: "", email: "", phone: "", country: "", message: "" });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState({ submitting: false, success: "", error: "" });

    const updateContact = (e) => setContact((c) => ({ ...c, [e.target.id]: e.target.value }));

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
            const ct = res.headers.get("content-type") || "";
            const isJSON = ct.includes("application/json");
            let data = null;
            let text = "";
            try {
                if (isJSON) data = await res.json();
                else text = await res.text();
            } catch { /* ignore */ }
            if (!res.ok) throw new Error(data?.error || text || `Request failed (${res.status})`);
            setStatus({ submitting: false, success: "Message sent! We’ll get back to you shortly.", error: "" });
            setContact({ fullName: "", email: "", phone: "", country: "", message: "" });
            setErrors({});
        } catch (err) {
            setStatus({ submitting: false, success: "", error: err?.message || "Something went wrong. Please try again." });
        }
    }

    return (
        <div
            id="top"
            className="min-h-screen text-white"
            style={{
                background:
                    "conic-gradient(from 59.35deg at 67.13% -3.89%, #06B6D4 -88.01deg, #0F172A 52.51deg, #0F172A 146.39deg, #06B6D4 271.99deg, #0F172A 432.51deg)",
            }}
        >
            {/* NAVBAR */}
            <header className="sticky top-3 z-30 mx-3 md:mx-6 lg:mx-10 rounded-2xl
                border border-white/20 
                bg-white/10 
                backdrop-blur-2xl 
                shadow-lg
                ring-1 ring-white/15
                shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className="inline-block rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-[10px] font-black tracking-wider">
                            ONUIGBO <span className="ml-1 rounded-sm bg-cyan-400 px-1 text-slate-900">FLOWSPACE</span>
                        </span>
                    </div>

                    <nav className="hidden gap-6 md:flex text-sm">
                        {[
                            { href: "#top", label: "Home" },
                            { href: "#about", label: "About Us" },
                            { href: "#features", label: "Services" },
                            { href: "#contact", label: "Contact Us" },
                        ].map((item) => (
                            <a key={item.href} href={item.href} className="text-slate-200/90 hover:text-white">
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-2 md:flex">
                        <Link
                            to="/signup"
                            className="rounded-xl bg-cyan-400 px-4 py-1.5 text-sm font-bold text-slate-900 shadow"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/login"
                            className="rounded-xl border border-white/15 px-4 py-1.5 text-sm font-bold text-white"
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </header>


            {/* HERO */}
            <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
                <div className="grid items-center gap-10 md:grid-cols-2">
                    <div>
                        <p className="text-cyan-300/90 text-sm font-medium tracking-wide">Work Smarter. Together.</p>
                        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold leading-tight">
                            ONUIGBO
                            <span className="block">FLOWSPACE</span>
                        </h1>
                        <p className="mt-4 max-w-md text-slate-200/85">
                            FlowSpace helps teams collaborate, organize tasks, and bring ideas to life effortlessly.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link to="/signup" className="rounded-xl bg-cyan-400 px-5 py-2 text-sm font-bold text-slate-900 shadow">
                                Get Started
                            </Link>
                            <Link to="/login" className="rounded-xl border border-white/15 px-5 py-2 text-sm font-bold text-white">
                                Log in
                            </Link>
                        </div>
                    </div>

                    <div className="mx-auto max-w-md md:max-w-none relative isolate">
                        <span
                            aria-hidden
                            className="pointer-events-none absolute -z-10 right-[-6%] top-1/2 h-[520px] w-[520px]
                -translate-y-1/2 rounded-full blur-2xl bg-white/10"
                        />
                        <img
                            src={HomeBg}
                            alt="Hero"
                            className="relative w-full max-w-[640px] object-contain drop-shadow-xl
                [mask-image:radial-gradient(120%_120%_at_65%_50%,#000_60%,transparent_85%)]
                [-webkit-mask-image:radial-gradient(120%_120%_at_65%_50%,#000_60%,transparent_85%)]"
                        />
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section id="about" className="mx-auto max-w-6xl px-4 py-10 md:py-14">
                <motion.div variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="text-center">
                    <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-bold tracking-wide">
                        ABOUT US
                    </span>
                    <p className="mt-3 text-slate-200/85">
                        Our mission is helping you track, test, and understand user behavior with ease
                    </p>
                </motion.div>

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.25 }}
                    className="mt-6 grid gap-4 md:grid-cols-3"
                >
                    <AboutCard src={aby} caption="Keep tasks and projects in one place." />
                    <AboutCard src={abs} caption="Connect with your team in real time." />
                    <AboutCard src={abBg} caption="Streamline workflows to achieve more." />
                </motion.div>
            </section>

            {/* FEATURES (Services) */}
            <section id="features" className="mx-auto max-w-6xl px-4 py-10 md:py-14">
                <motion.div variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="text-center">
                    <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-bold tracking-wide">
                        SERVICES
                    </span>
                    <p className="mt-3 text-slate-200/85">Powerful tools to keep your team in flow.</p>
                </motion.div>

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mt-8 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
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
                </motion.div>

                <p className="mt-6 text-center text-slate-200/75">
                    FlowSpace is built to scale with your team, whether you’re 2 people or 200.
                </p>

                <div className="mt-6 text-center">
                    <a href="#contact" className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-bold">
                        CONTACT US
                    </a>
                </div>
            </section>

            {/* CONTACT */}
            <section id="contact" className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
                <div className="grid items-stretch gap-8 md:grid-cols-2">
                    {/* Left image */}
                    <div className="h-full md:min-h-[520px] relative overflow-hidden rounded-2xl border border-white/12 shadow">
                        <img
                            src={contactPhoto}
                            alt="Contact"
                            className="h-full w-full object-cover"
                        />
                        {/* gradient overlay */}
                        <div
                            className="absolute inset-0 opacity-80"
                            style={{
                                background:
                                    "conic-gradient(from 59.35deg at 67.13% -3.89%, #06B6D4 -88.01deg, #0F172A 52.51deg, #0F172A 146.39deg, #06B6D4 271.99deg, #0F172A 432.51deg)",
                            }}
                        />
                    </div>

                    {/* Right form */}
                    <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/60 p-6 shadow h-full md:min-h-[520px] flex flex-col">
                        <h2 className="text-2xl font-bold">Let’s Build Together</h2>
                        <p className="mt-1 text-sm text-slate-200/85">
                            We’d love to hear from you. Whether it’s feedback, partnership, or support.
                        </p>

                        <form onSubmit={submitContact} noValidate className="mt-8 grow">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <LabeledInput id="fullName" label="Full Name" value={contact.fullName} onChange={updateContact} />
                                {errors.fullName && <p className="-mt-3 text-xs text-red-300 md:col-span-1">{errors.fullName}</p>}

                                <LabeledInput id="email" label="Email" type="email" value={contact.email} onChange={updateContact} />
                                {errors.email && <p className="-mt-3 text-xs text-red-300 md:col-span-1">{errors.email}</p>}

                                <LabeledInput id="phone" label="Phone Number" value={contact.phone} onChange={updateContact} />
                                <LabeledInput id="country" label="Country" value={contact.country} onChange={updateContact} />

                                <LabeledTextarea id="message" label="How Can We Help?" value={contact.message} onChange={updateContact} className="md:col-span-2" />
                                {errors.message && <p className="-mt-3 text-xs text-red-300 md:col-span-2">{errors.message}</p>}
                            </div>

                            {status.error && (
                                <div className="mt-4 rounded-md border border-red-400/40 bg-red-900/20 p-2 text-sm text-red-200" role="alert">
                                    {status.error}
                                </div>
                            )}
                            {status.success && (
                                <div className="mt-4 rounded-md border border-emerald-400/40 bg-emerald-900/20 p-2 text-sm text-emerald-200" role="status">
                                    {status.success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status.submitting}
                                className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-900 shadow disabled:opacity-60"
                            >
                                {status.submitting ? "Sending…" : "Send your Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/10 py-10 text-sm text-slate-300">
                <div className="mx-auto max-w-6xl px-4 grid gap-10 md:grid-cols-3">
                    <div>
                        <span className="inline-flex items-center gap-1 rounded-md bg-cyan-400/10 border border-cyan-400/30 px-2 py-1 text-[10px] tracking-wide">
                            <span className="font-black">ONUIGBO</span>
                            <span className="rounded-sm bg-cyan-400 px-1 text-slate-900 font-bold">FLOWSPACE</span>
                        </span>
                        <div className="mt-4 space-y-1 text-xs">
                            <p>FlowSpace HQ</p>
                            <p>4th Floor, Unity Towers</p>
                            <p>Marina District</p>
                            <p>Victoria Island, Lagos Nigeria</p>
                        </div>
                    </div>

                    <nav className="text-xs">
                        <h4 className="font-semibold mb-2 text-white">Site Map</h4>
                        <ul className="space-y-1">
                            <li><a href="#top" className="hover:text-white">Home</a></li>
                            <li><a href="#about" className="hover:text-white">About Us</a></li>
                            <li><a href="#features" className="hover:text-white">Services</a></li>
                            <li><a href="#contact" className="hover:text-white">Contact Us</a></li>
                        </ul>
                    </nav>

                    <div className="text-xs">
                        <h4 className="font-semibold mb-2 text-white">Legal</h4>
                        <ul className="space-y-1">
                            <li><a href="#" className="hover:text-white">Terms of Services</a></li>
                            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} FlowSpace. All rights reserved.
                </div>
            </footer>
        </div>
    );
}