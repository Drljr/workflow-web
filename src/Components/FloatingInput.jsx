import { useState } from "react";

export default function FloatingInput({
    id,
    label,
    type = "text",
    value,
    onChange,
    autoComplete,
    required,
    error,
    withToggle = false,
    containerClass = "",       // ⬅️ NEW: lets us control grid span/spacing
}) {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && withToggle ? (show ? "text" : "password") : type;

    const base =
        "peer block w-full rounded-md border p-2 pt-5 text-sm " +
        "!bg-transparent text-gray-900 dark:text-white dark:bg-transparent dark:caret-white " + // ← key line
        "placeholder-transparent focus:ring focus:outline-none";
    const border = error
        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600";

    return (
        <div className={`relative mb-6 ${containerClass}`}>
            <input
                id={id}
                type={inputType}
                placeholder=" "
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                required={required}
                aria-invalid={Boolean(error)}
                className={`${base}${border}`}
            />
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

            {isPassword && withToggle && (
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute inset-y-0 right-2 my-auto rounded-md px-2 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    {show ? "Hide" : "Show"}
                </button>
            )}

            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}
