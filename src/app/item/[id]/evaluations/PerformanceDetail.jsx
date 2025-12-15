import LightHouseDetail from "./LIghthouseSummary";
import Loading from "./Loading";

function PerformanceDetail({performance}) {
  return (
    <>
        { performance ? <LightHouseDetail title="Performance" description="Aggregate Lighthouse performance score" audits={performance.audits} score={performance.score} /> :
            <Loading>
            Performance is loading.
            </Loading>
        }
    </>
  );
}

export default PerformanceDetail;