import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * UniversalClock.jsx (enhanced)
 * - Multi‑timezone clock
 * - Add/select countries to view their current local time
 * - 12/24h toggle, seconds, optional date
 * - No external deps (Tailwind for styles)
 */

// --- Country → Representative IANA Time Zone map ---
// Note: Countries often span multiple time zones; we pick a common/business hub.
const COUNTRY_TZ = [
    { country: "Nigeria", tz: "Africa/Lagos" },
    { country: "United Kingdom", tz: "Europe/London" },
    { country: "United States", tz: "America/New_York" },
    { country: "Canada", tz: "America/Toronto" },
    { country: "Brazil", tz: "America/Sao_Paulo" },
    { country: "South Africa", tz: "Africa/Johannesburg" },
    { country: "Ghana", tz: "Africa/Accra" },
    { country: "Kenya", tz: "Africa/Nairobi" },
    { country: "Egypt", tz: "Africa/Cairo" },
    { country: "UAE", tz: "Asia/Dubai" },
    { country: "India", tz: "Asia/Kolkata" },
    { country: "China", tz: "Asia/Shanghai" },
    { country: "Singapore", tz: "Asia/Singapore" },
    { country: "Japan", tz: "Asia/Tokyo" },
    { country: "Australia", tz: "Australia/Sydney" },
    { country: "New Zealand", tz: "Pacific/Auckland" },
    { country: "Germany", tz: "Europe/Berlin" },
    { country: "France", tz: "Europe/Paris" },
    { country: "Spain", tz: "Europe/Madrid" },
    { country: "Italy", tz: "Europe/Rome" },
    { country: "Netherlands", tz: "Europe/Amsterdam" },
    { country: "Sweden", tz: "Europe/Stockholm" },
    { country: "Norway", tz: "Europe/Oslo" },
    { country: "Turkey", tz: "Europe/Istanbul" },
    { country: "Saudi Arabia", tz: "Asia/Riyadh" },
    { country: "Pakistan", tz: "Asia/Karachi" },
    { country: "Bangladesh", tz: "Asia/Dhaka" },
    { country: "Indonesia", tz: "Asia/Jakarta" },
    { country: "Philippines", tz: "Asia/Manila" },
    { country: "Mexico", tz: "America/Mexico_City" },
    { country: "Argentina", tz: "America/Argentina/Buenos_Aires" },
    { country: "Chile", tz: "America/Santiago" },
];

const DEFAULT_ZONES = [
    { label: "Lagos", tz: "Africa/Lagos" },
    { label: "UTC", tz: "UTC" },
];

function normalizeZones(zonesProp) {
    if (!zonesProp || zonesProp.length === 0) return DEFAULT_ZONES;
    return zonesProp.map((z) =>
        typeof z === "string" ? { label: z.split("/").pop()?.replaceAll("_", " ") || z, tz: z } : z
    );
}

function formatTime(date, tz, { hour12 = false, showSeconds = true, showDate = true } = {}) {
    const time = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: showSeconds ? "2-digit" : undefined,
        hour12,
        timeZone: tz,
    }).format(date);

    const dateStr = showDate
        ? new Intl.DateTimeFormat("en-GB", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "2-digit",
            timeZone: tz,
        }).format(date)
        : "";

    return { time, dateStr };
}

function usePreciseTick(enabled = true) {
    const [, force] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!enabled) return;

        const schedule = () => {
            const now = Date.now();
            const next = 1000 - (now % 1000);
            timerRef.current = setTimeout(() => {
                force((n) => n + 1);
                schedule();
            }, next);
        };

        schedule();
        return () => timerRef.current && clearTimeout(timerRef.current);
    }, [enabled]);
}

export default function UniversalClock({
    variant = "card",
    zones: zonesProp,
    showDate = true,
    showSeconds = true,
    hour12: hour12Default = false,
    accent = "from-sky-500 to-cyan-400",
    className = "",
}) {
    usePreciseTick(true);
    const [hour12, setHour12] = useState(hour12Default);
    const baseZones = useMemo(() => normalizeZones(zonesProp), [zonesProp]);
    const [zones, setZones] = useState(baseZones);
    const [query, setQuery] = useState("");
    const now = new Date();

    // Filter countries based on query
    const filteredCountries = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return COUNTRY_TZ;
        return COUNTRY_TZ.filter((c) =>
            c.country.toLowerCase().includes(q) || c.tz.toLowerCase().includes(q)
        );
    }, [query]);

    const addZone = (tz, label) => {
        setZones((prev) => {
            if (prev.some((z) => z.tz === tz)) return prev; // avoid duplicates
            return [...prev, { tz, label: label || tz.split("/").pop()?.replaceAll("_", " ") }];
        });
    };

    const removeZone = (tz) => setZones((prev) => prev.filter((z) => z.tz !== tz));

    if (variant === "inline") {
        const { time } = formatTime(now, zones[0].tz, { hour12, showSeconds, showDate: false });
        return (
            <span className={`inline-flex items-center gap-2 font-mono text-sm sm:text-base ${className}`}>
                <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${accent}`} />
                {zones[0].label}: {time}
            </span>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-2xl bg-white/90 shadow-xl ring-1 ring-slate-200 ${className}`}>
            {/* Top gradient bar */}
            <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />

            {/* Header */}
            <div className="flex flex-col gap-4 px-5 pt-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${accent} opacity-90`} />
                    <div className="leading-tight">
                        <h3 className="text-base font-semibold tracking-tight text-slate-900">Universal Clock</h3>
                        <p className="text-xs text-slate-600">Add countries to compare local times</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* 12/24 toggle */}
                    <button
                        onClick={() => setHour12((v) => !v)}
                        className="group relative inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:shadow-sm active:scale-[0.98]"
                    >
                        <span className={`inline-block h-2 w-2 rounded-full bg-gradient-to-r ${accent}`} />
                        {hour12 ? "12‑hour" : "24‑hour"}
                    </button>
                </div>
            </div>

            {/* Country picker */}
            <div className="mt-4 grid gap-3 px-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                    <label className="mb-1 block text-xs font-medium text-slate-600">Search country or timezone</label>
                    <div className="relative">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., Nigeria, Europe/London"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        />
                    </div>
                </div>
                <div className="max-h-40 overflow-auto rounded-lg border border-slate-200 bg-white p-2">
                    <ul className="divide-y divide-slate-100 text-sm">
                        {filteredCountries.map((c) => (
                            <li key={c.country} className="flex items-center justify-between gap-3 py-2">
                                <div>
                                    <div className="font-medium text-slate-800">{c.country}</div>
                                    <div className="text-xs text-slate-500">{c.tz}</div>
                                </div>
                                <button
                                    onClick={() => addZone(c.tz, c.country)}
                                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:shadow-sm"
                                >
                                    Add
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Grid of clocks */}
            <div className="grid grid-cols-1 gap-4 px-5 py-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {zones.map(({ label, tz }) => {
                    const { time, dateStr } = formatTime(now, tz, { hour12, showSeconds, showDate });
                    return (
                        <div
                            key={`${label}-${tz}`}
                            className="relative overflow-hidden rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex min-w-0 items-center gap-2">
                                    <div className={`h-2 w-2 shrink-0 rounded-full bg-gradient-to-r ${accent}`} />
                                    <div className="truncate text-sm font-semibold text-slate-800" title={label}>{label}</div>
                                </div>
                                <button
                                    onClick={() => removeZone(tz)}
                                    className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
                                    title="Remove"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mt-2 flex items-baseline gap-2">
                                <div className="font-mono text-2xl tabular-nums text-slate-900 sm:text-3xl">{time}</div>
                            </div>

                            {showDate && <div className="mt-1 text-xs text-slate-600">{dateStr}</div>}

                            {/* Accent corner */}
                            <div className={`pointer-events-none absolute -right-6 -top-6 h-16 w-16 rotate-45 rounded-lg bg-gradient-to-br ${accent} opacity-10`} />
                        </div>
                    );
                })}
            </div>

            {/* Bottom bar */}
            <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${accent}`} />
        </div>
    );
}
