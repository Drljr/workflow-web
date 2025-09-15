import React from "react";
import { Link } from "react-router-dom";
import UniversalClock from "../Components/UniversalClock";

const teal = "#0E7490";

export default function ClockPage() {
    return (
        <div
            className="min-h-screen text-white"
            style={{
                background:
                    "conic-gradient(from 59.35deg at 67.13% -3.89%, #06B6D4 -88.01deg, #0F172A 52.51deg, #0F172A 146.39deg, #06B6D4 271.99deg, #0F172A 432.51deg)",
            }}
        >
            <header
                className="sticky top-3 z-30 mx-3 md:mx-6 lg:mx-10 rounded-2xl
        border border-white/20 bg-white/10 backdrop-blur-2xl shadow-lg
        ring-1 ring-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]"
            >
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className="inline-block rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-[10px] font-black tracking-wider">
                            ONUIGBO{" "}
                            <span className="ml-1 rounded-sm bg-cyan-400 px-1 text-slate-900">
                                FLOWSPACE
                            </span>
                        </span>
                    </div>
                    <nav className="hidden gap-2 md:flex">
                        <Link
                            to="/home"
                            className="rounded-xl bg-cyan-400 px-4 py-1.5 text-sm font-bold text-slate-900 shadow"
                            style={{ borderColor: teal, color: teal }}
                        >
                            HOME
                        </Link>
                        <Link
                            to="/notes"
                            className="rounded-xl bg-cyan-400 px-4 py-1.5 text-sm font-bold text-slate-900 shadow"
                            style={{ borderColor: teal, color: teal }}
                        >
                            NOTES
                        </Link>
                        <Link
                            to="/"
                            className="rounded-full border px-4 py-1.5 text-sm"
                            style={{ borderColor: teal, color: teal }}
                        >
                            LOG OUT
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        Universal Clock
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Add countries, compare local times, and switch 12/24-hour display.
                    </p>
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow ring-1 ring-white/15 backdrop-blur-md">
                    <UniversalClock
                        // matches your palette
                        accent="from-cyan-400 to-sky-500"
                        className="text-slate-900 dark:text-white"
                        zones={[
                            { label: "Lagos", tz: "Africa/Lagos" },
                            { label: "London", tz: "Europe/London" },
                            { label: "New York", tz: "America/New_York" },
                            { label: "Dubai", tz: "Asia/Dubai" },
                        ]}
                        showSeconds={true}
                        hour12={false}
                    />
                </div>
            </main>
        </div>
    );
}
