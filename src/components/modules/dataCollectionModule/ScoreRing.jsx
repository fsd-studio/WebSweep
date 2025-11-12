function ScoreRing({ score }) {
  const radius = 25;
  const stroke = 3;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = "stroke-red-500";
  if (score >= 90) color = "stroke-green-500";
  else if (score >= 50) color = "stroke-yellow-500";

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#E3E5E6"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        className={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + " " + circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="text-sm font-semibold fill-gray-800"
      >
        {score}
      </text>
    </svg>
  );
}

export default ScoreRing;
