export default function WelcomePage() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr,1fr] items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-3 rounded-full bg-gray-900 text-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] shadow-md">
          WebSweep
          <span className="h-1 w-1 rounded-full bg-pink-400"></span>
          Better websites, faster
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            Discover, grade, and elevate <span className="text-blue-700">web experiences</span>.
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            WebSweep surfaces site quality at a glance - GEO, SEO, performance, and a combined score - so you can focus on the next improvement or the next lead.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-blue-700 text-white px-5 py-3 font-semibold shadow-md hover:bg-blue-800 transition"
          >
            Go to search
          </a>
          <a
            href="/buy"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-800 px-5 py-3 font-semibold shadow-sm hover:bg-gray-50 transition"
          >
            View plans
          </a>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-pink-200 blur-2xl opacity-70" />
        <div className="absolute right-4 top-10 h-16 w-16 rounded-full bg-blue-200 blur-xl opacity-70" />
        <div className="relative rounded-3xl bg-white border border-gray-100 shadow-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-900">Example score snapshot</div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>Live</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl border border-gray-100 bg-blue-50 p-4">
              <div className="text-xs font-semibold text-blue-800 uppercase tracking-[0.12em]">Geo</div>
              <div className="text-2xl font-bold text-blue-900">82</div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-green-50 p-4">
              <div className="text-xs font-semibold text-green-800 uppercase tracking-[0.12em]">SEO</div>
              <div className="text-2xl font-bold text-green-900">91</div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-orange-50 p-4">
              <div className="text-xs font-semibold text-orange-800 uppercase tracking-[0.12em]">Performance</div>
              <div className="text-2xl font-bold text-orange-900">78</div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-purple-50 p-4">
              <div className="text-xs font-semibold text-purple-800 uppercase tracking-[0.12em]">General Score</div>
              <div className="text-2xl font-bold text-purple-900">84</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-center">
            Scores auto-update as you explore datasets.
          </div>
        </div>
      </div>
    </div>
  );
}
