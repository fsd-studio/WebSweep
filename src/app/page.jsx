import HeadComponent from "components/config/HeadComponent";
import GeoMetrics from "components/modules/geoModule/GeoMetrics";
import DataCollectionModule from "components/modules/dataCollectionModule/DataCollectionModule";
import GeoData from "components/modules/geoModule/geoScrapedData";

export default async function Page() {
  return (
    <>
      <HeadComponent />
      <DataCollectionModule />
      {/* <GeoData></GeoData> */}
      <GeoMetrics />
    </>
  );
}
