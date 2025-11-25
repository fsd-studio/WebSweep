import GeoSummary from "./evaluations/GeoSummary";
import PerformanceSummary from "./evaluations/PerformanceSummary";
import SeoSummary from "./evaluations/SeoSummary";
import Panel from "./Panel";

function LeftPanel({ item, geo, seo }) {
  return (
    <Panel>
      <div className="space-y-4">
        <GeoSummary item={item} geo={geo}></GeoSummary>
        <SeoSummary seo={seo}></SeoSummary>
        <PerformanceSummary></PerformanceSummary>
      </div>
    </Panel>
  );
}

export default LeftPanel;
