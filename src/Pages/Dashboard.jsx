import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const nav = useNavigate();
    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-900 flex items-center justify-center p-8">
            <div className="w-full max-w-xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    (No auth yet) This is a placeholder dashboard. Wire this to your API when ready.
                </p>
                <button
                    onClick={() => nav("/login")}
                    className="rounded-md bg-gray-900 text-white px-4 py-2 hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}
