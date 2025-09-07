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
    containerClass = "",
}) {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && withToggle ? (show ? "text" : "password") : type;

    // Solid white field + light border + shadow + cyan focus (like your example)
    const base =
        "peer block w-full rounded-md p-3 shadow-md bg-white text-gray-900 " +
        "placeholder-transparent focus:outline-none";
    const border = error
        ? "border border-rose-400 focus:ring-2 focus:ring-rose-400"
        : "border border-white/20 focus:ring-2 focus:ring-cyan-400";

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
                className={`${base} ${border}`}
            />

            {/* Floating label (gray by default, cyan on focus) */}
            <label
                htmlFor={id}
                className={
                    "pointer-events-none absolute left-3 top-3 text-sm text-gray-500 transition-all " +
                    "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 " +
                    "peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-cyan-500"
                }
            >
                {label}
            </label>

            {isPassword && withToggle && (
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute inset-y-0 right-2 my-auto rounded-md px-2 text-xs text-gray-600 hover:bg-gray-100"
                >
                    {show ? "Hide" : "Show"}
                </button>
            )}

            {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        </div>
    );
}
