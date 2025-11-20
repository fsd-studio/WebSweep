import HeadComponent from "components/config/HeadComponent";
import DataCollectionModule from "components/modules/dataCollectionModule/DataCollectionModule";

export default async function Page() {
  return (
    <>
      <HeadComponent />
      <DataCollectionModule />
    </>
  );
}
