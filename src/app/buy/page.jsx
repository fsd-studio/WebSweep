const plans = [
  {
    name: "Starter",
    price: "$19",
    cadence: "/mo",
    highlights: ["Up to 200 websites", "Basic GEO/SEO/Performance", "Email support"],
    accent: "from-blue-50 via-blue-100 to-white",
  },
  {
    name: "Pro",
    price: "$49",
    cadence: "/mo",
    highlights: ["Up to 1,000 websites", "General score blending", "Team sharing", "Priority support"],
    accent: "from-purple-50 via-pink-50 to-white",
  },
  {
    name: "Scale",
    price: "$99",
    cadence: "/mo",
    highlights: ["Unlimited websites", "Custom weighting", "Exports & webhooks", "Dedicated success"],
    accent: "from-amber-50 via-orange-50 to-white",
  },
];

export default function BuyPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Plans</p>
        <h1 className="text-4xl font-black text-gray-900">Pick a WebSweep subscription</h1>
        <p className="text-lg text-gray-700">
          Choose a visual tier to see how your data would look at different volumes. This is a static preview.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl border border-gray-100 bg-gradient-to-br ${plan.accent} shadow-xl p-6 flex flex-col gap-5`}
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-600">{plan.name}</p>
              <div className="flex items-baseline gap-1">
                <div className="text-4xl font-black text-gray-900">{plan.price}</div>
                <div className="text-sm text-gray-600">{plan.cadence}</div>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-800">
              {plan.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-gray-900" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
            >
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
