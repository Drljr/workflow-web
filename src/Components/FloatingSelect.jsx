export default function FloatingSelect({
    id,
    label,
    value,
    onChange,
    required,
    error,
    options = [],
    containerClass = "",
}) {
    // Solid white field + subtle border/shadow + cyan focus ring
    const base =
        "peer block w-full appearance-none rounded-md p-3 pt-5 pr-5 " + // pr-5 leaves room for chevron
        "bg-white text-gray-900 shadow-md focus:outline-none";
    const border = error
        ? "border border-rose-400 focus:ring-2 focus:ring-rose-400"
        : "border border-white/20 focus:ring-2 focus:ring-cyan-400";

    return (
        <div className={`relative mb-6 ${containerClass}`}>
            <select
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                className={`${base} ${border}`}
            >
                <option value="" hidden />
                {options.map((o) => (
                    <option key={o.value} value={o.value} className="bg-white text-gray-900">
                        {o.label}
                    </option>
                ))}
            </select>

            {/* Floating label: stays large until focused or a value is chosen */}
            <label
                htmlFor={id}
                className={
                    "pointer-events-none absolute left-3 top-3.5 text-base text-gray-500 transition-all " +
                    "peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-cyan-500 " +
                    "peer-[&:not([value=''])]:top-2.5 peer-[&:not([value=''])]:text-sm"
                }
            >
                {label}
            </label>

            {/* Chevron */}
            <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>

            {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        </div>
    );
}
