import Link from "next/link";
import { FiLogIn, FiUser } from "react-icons/fi";

export default function Layout({ children, fonts }) {
  return (
    <div className={`${fonts} min-h-screen bg-transparent text-gray-900`}>
      <div className="relative overflow-hidden min-h-screen">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-200 to-pink-200 opacity-70 blur-3xl" />
        <div className="pointer-events-none absolute right-[-120px] top-32 h-96 w-96 rounded-full bg-gradient-to-br from-blue-100 to-white opacity-70 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-10 h-10 w-10 rounded-full bg-pink-400 opacity-70" />
        <div className="pointer-events-none absolute bottom-16 left-28 h-6 w-6 rounded-full bg-blue-600 opacity-80" />
        <div className="pointer-events-none absolute bottom-20 left-40 h-4 w-4 rounded-full bg-black opacity-80" />

        {/* Top navigation */}
        <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-6">
          <div className="flex items-center gap-4">
            <Link href="/welcome" className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-900 flex items-center justify-center shadow-md overflow-hidden">
                <img src="/template/logo1.png" alt="WebSweep logo" className="h-8 w-8 object-contain" />
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-[0.2em] text-gray-800">
              <Link href="/welcome" className="hover:text-black">WebSweep</Link>
              <Link href="/" className="hover:text-black">Websites</Link>
              <Link href="/buy" className="hover:text-black">Plans</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-gray-900/10 bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md"
            >
              <FiLogIn className="h-4 w-4" />
              Login
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-md"
            >
              <FiUser className="h-4 w-4" />
              Profile
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 px-4 md:px-8 pb-12">
          <div className="w-full max-w-[92rem] mx-auto rounded-[28px] bg-white/85 backdrop-blur border border-gray-100 shadow-2xl p-6 md:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
