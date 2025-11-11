import HeadComponent from "components/config/HeadComponent";
import GeoMetrics from "components/modules/geoModule/GeoMetrics";
import DataCollectionModule from "components/modules/dataCollectionModule/DataCollectionModule";

export default async function Page() {
  return (
    <>
      <HeadComponent />
      <DataCollectionModule />
      <GeoMetrics />
    </>
  );
}
