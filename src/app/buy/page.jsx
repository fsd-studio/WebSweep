const plans = [
  {
    name: "Option A - Scout",
    license: "Basic License",
    price: "CHF 19",
    cadence: "/month",
    details: [
      { label: "Target users", text: "Solo freelancers and solopreneurs." },
      { label: "Access", text: "250 unlock credits; see scores on any site and spend credits to reveal org, URL, and contacts." },
      { label: "Purpose", text: "Light, affordable lead fuel without enterprise overhead." },
    ],
    accent: "from-blue-50 via-blue-100 to-white",
    cta: "Choose Scout",
  },
  {
    name: "Option B - Professional",
    license: "Pro License",
    price: "CHF 49",
    cadence: "/month",
    details: [
      { label: "Target users", text: "High-volume freelancers and small studios." },
      { label: "Access", text: "1,000 unlock credits plus full diagnostics—GEO, SEO logs, and performance (e.g., LCP 4.2s)." },
      { label: "Purpose", text: "Find leads and email prospects with specific fixes in hand." },
    ],
    accent: "from-purple-50 via-pink-50 to-white",
    cta: "Upgrade to Professional",
  },
  {
    name: "Option C - Enterprise",
    license: "Future Tier",
    price: "from CHF 299",
    cadence: "/month + API usage",
    details: [
      { label: "Target users", text: "Lead-gen agencies and B2B sales platforms." },
      { label: "Status", text: "Future tier once scoring and dataset scale." },
      { label: "Access", text: "API access to stream WebSweep scores into your own systems." },
      { label: "Purpose", text: "Shifts WebSweep from tool to data infrastructure for recurring, higher-margin deals." },
    ],
    accent: "from-amber-50 via-orange-50 to-white",
    cta: "Talk to us",
  },
];

export default function BuyPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Subscriptions</p>
        <h1 className="text-4xl font-black text-gray-900">WebSweep licensing options</h1>
        <p className="text-lg text-gray-700">
          Choose the level of lead volume and diagnostic depth that matches how you prospect with WebSweep.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl border border-gray-100 bg-gradient-to-br ${plan.accent} shadow-xl p-6 flex flex-col gap-5`}
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-600">{plan.name}</p>
              <p className="text-sm font-semibold text-gray-800">{plan.license}</p>
              <div className="flex items-baseline gap-1">
                <div className="text-4xl font-black text-gray-900">{plan.price}</div>
                <div className="text-sm text-gray-600">{plan.cadence}</div>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-gray-800">
              {plan.details.map((detail) => (
                <li key={detail.label} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-900" />
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">{detail.label}</p>
                    <p>{detail.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
