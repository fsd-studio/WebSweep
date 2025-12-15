import ScoreRing from "components/modules/dataCollectionModule/ScoreRing";

export default function MainScoreCard({ title, description, score, multiplier = 1 }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 flex items-center gap-3">
      <div className="w-16">
        {score != null ? (
          <ScoreRing score={score * multiplier} />
        ) : (
          <div className="text-sm text-gray-500">Loading...</div>
        )}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {title}
        </div>
        <div className="text-sm text-gray-700">{description}</div>
      </div>
    </div>
  );
}
