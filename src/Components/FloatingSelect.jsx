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
    const base =
        "peer block w-full appearance-none rounded-md border !bg-transparent p-2 pt-5 text-sm " +
        "text-gray-900 dark:text-white focus:ring focus:outline-none " +
        "placeholder-transparent dark:bg-transparent ";
    const border = error
        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600";

    return (
        <div className={`relative mb-6 ${containerClass}`}>
            <select
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                className={`${base}${border}`}
            >
                <option value="" hidden />
                {options.map((o) => (
                    <option
                        key={o.value}
                        value={o.value}
                        className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                    >
                        {o.label}
                    </option>
                ))}
            </select>

            <label
                htmlFor={id}
                className={
                    "absolute left-3 top-2.5 text-gray-500 text-sm transition-all " +
                    "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base " +
                    "peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                }
            >
                {label}
            </label>

            {/* Chevron */}
            <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                viewBox="0 0 20 20" fill="currentColor"
            >
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>

            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}
