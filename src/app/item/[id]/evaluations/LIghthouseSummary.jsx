import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from "react-icons/fa";
import SummaryMetric from "./SummaryMetric";
import ScoreRing from "components/modules/dataCollectionModule/ScoreRing";
import MainScoreCard from "./MainScoreCard";


export default function LightHouseDetail({ title, description, audits, score }) {
  const renderValue = (audit) => {
    if (audit.score === 1) return "Pass";
    if (audit.score === 0) return "Fail";
    return "Manual";
  };

  const renderIcon = (audit) => {
    if (audit.score === 1) return FaCheckCircle;
    if (audit.score === 0) return FaTimesCircle;
    return FaExclamationCircle;
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="col-span-2">
        <MainScoreCard title={title} description={description} score={score} multiplier={100} />
      </div>
      {Object.values(audits).map((audit) => (
        <SummaryMetric
          key={audit.id}
          label={audit.title}
          value={renderValue(audit)}
          description={audit.description}
          icon={renderIcon(audit)}
        />
      ))}
    </div>
  );
}
