import HeadComponent from "components/config/HeadComponent";
import Lighthouse from "components/modules/webScrapingModule/webScrapingModule";

function index() {
  return (
    <div className="h-full w-full">
      <HeadComponent
        title="Metrics"
        description="View and analyze your web scraping metrics"
      />
      
      {/* Data metric collection with lighthouse js */}
      <Lighthouse></Lighthouse>
    </div>
  );
}

export default index;