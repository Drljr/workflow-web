import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const teal = "#0E7490";
const LS_KEY = "fs_notes_v1";

function formatWhen(ts) {
    const d = new Date(ts);
    return d.toLocaleString();
}

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [query, setQuery] = useState("");
    const [draft, setDraft] = useState({ id: null, title: "", body: "", pinned: false });
    const [editingId, setEditingId] = useState(null);

    // load/save to localStorage
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
            setNotes(Array.isArray(saved) ? saved : []);
        } catch { /* ignore */ }
    }, []);
    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(notes));
    }, [notes]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const byMatch = q
            ? notes.filter(n =>
                n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
            )
            : notes;
        // pin to top, then newest first
        return byMatch.sort((a, b) => (b.pinned - a.pinned) || (b.updatedAt - a.updatedAt));
    }, [notes, query]);

    function resetDraft() {
        setDraft({ id: null, title: "", body: "", pinned: false });
        setEditingId(null);
    }

    function createNote(e) {
        e.preventDefault();
        if (!draft.title.trim() && !draft.body.trim()) return;

        const now = Date.now();
        if (editingId) {
            setNotes(ns =>
                ns.map(n =>
                    n.id === editingId
                        ? { ...n, title: draft.title, body: draft.body, pinned: draft.pinned, updatedAt: now }
                        : n
                )
            );
        } else {
            setNotes(ns => [
                { id: crypto.randomUUID(), title: draft.title, body: draft.body, pinned: draft.pinned, createdAt: now, updatedAt: now },
                ...ns,
            ]);
        }
        resetDraft();
    }

    function startEdit(n) {
        setEditingId(n.id);
        setDraft({ id: n.id, title: n.title, body: n.body, pinned: n.pinned });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function delNote(id) {
        setNotes(ns => ns.filter(n => n.id !== id));
        if (editingId === id) resetDraft();
    }

    function togglePin(n) {
        setNotes(ns => ns.map(x => x.id === n.id ? { ...x, pinned: !x.pinned, updatedAt: Date.now() } : x));
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
            {/* top bar */}
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
                    <nav className="hidden gap-2 md:flex">
                        <Link to="/home" className="rounded-xl bg-cyan-400 px-4 py-1.5 text-sm font-bold text-slate-900 shadow"
                            style={{ borderColor: teal, color: teal }}>HOME</Link>
                        <Link to="/" className="rounded-full border px-4 py-1.5 text-sm"
                            style={{ borderColor: teal, color: teal }}>LOG OUT</Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8">
                {/* title + search */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Smart Notes</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Capture ideas, pin priority notes, and search quickly.</p>
                    </div>
                    <div className="w-full md:w-80">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search notes…"
                            className="w-full rounded-md bg-white text-gray-900 placeholder:text-gray-500
                         border border-white/20 shadow-md p-3 focus:outline-none
                         focus:ring-2 focus:ring-cyan-400 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                        />
                    </div>
                </div>

                {/* editor */}
                <form onSubmit={createNote} className="mt-6 grid gap-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 shadow">
                    <input
                        value={draft.title}
                        onChange={(e) => setDraft(d => ({ ...d, title: e.target.value }))}
                        placeholder="Note title"
                        className="w-full rounded-md border border-white/20 bg-white/8 px-4 py-3 text-white
                         placeholder:uppercase placeholder:text-[11px]shadow-sm p-3 focus:outline-none
                       focus:ring-2 focus:ring-cyan-400 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                    />
                    <textarea
                        rows={4}
                        value={draft.body}
                        onChange={(e) => setDraft(d => ({ ...d, body: e.target.value }))}
                        placeholder="Write your note…"
                        className="w-full rounded-md bg-white text-gray-900 placeholder:text-gray-500
                       border border-white/20 shadow-sm p-3 focus:outline-none
                       focus:ring-2 focus:ring-cyan-400 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                    />
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={draft.pinned}
                                onChange={(e) => setDraft(d => ({ ...d, pinned: e.target.checked }))}
                                className="h-4 w-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-400 dark:border-gray-600"
                            />
                            Pin this note
                        </label>

                        <div className="flex gap-2">
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetDraft}
                                    className="rounded-md border px-4 py-2 text-sm font-semibold"
                                    style={{ borderColor: teal, color: teal }}
                                >
                                    Cancel edit
                                </button>
                            )}
                            <button
                                type="submit"
                                className="rounded-md px-4 py-2 text-sm font-semibold text-white"
                                style={{ backgroundColor: teal }}
                            >
                                {editingId ? "Save changes" : "Add note"}
                            </button>
                        </div>
                    </div>
                </form>

                {/* notes grid */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.length === 0 && (
                        <div className="col-span-full rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
                            No notes yet. Add your first one above.
                        </div>
                    )}

                    {filtered.map((n) => (
                        <article
                            key={n.id}
                            className="h-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 shadow-md flex flex-col"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white break-words">
                                    {n.title || "Untitled"}
                                </h3>
                                <button
                                    onClick={() => togglePin(n)}
                                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${n.pinned
                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200"
                                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                                        }`}
                                    title="Toggle pin"
                                >
                                    {n.pinned ? "Pinned" : "Pin"}
                                </button>
                            </div>

                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                                {n.body || "—"}
                            </p>

                            <div className="mt-auto flex items-center justify-between pt-4 text-xs text-gray-500 dark:text-gray-400">
                                <span>Updated {formatWhen(n.updatedAt)}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(n)}
                                        className="rounded-md border px-2 py-1"
                                        style={{ borderColor: teal, color: teal }}
                                        title="Edit"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => delNote(n.id)}
                                        className="rounded-md border border-rose-300 px-2 py-1 text-rose-600 dark:border-rose-700 dark:text-rose-400"
                                        title="Delete"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
