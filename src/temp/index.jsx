import HeadComponent from "components/config/HeadComponent";
import HTMLValidationModule from "components/modules/HTMLValidationModule/HTMLValidationModule";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import GeoData from "components/modules/geoModule/geoScrapedData";
import GeoMetrics from "components/modules/geoModule/GeoMetrics";
import DataCollectionModule from "components/modules/dataCollectionModule/DataCollectionModule";

export async function getServerSideProps({ locale }) {
  const translations = await serverSideTranslations(locale, ['common', 'nav']);
  return {
    props: {
      ...translations,
    },
  };
}


export default function Home() {
  return (
    <>
      <HeadComponent
      />
      {/* <HTMLValidationModule></HTMLValidationModule> */}
      <DataCollectionModule />
      {/* <GeoData></GeoData> */}
      <GeoMetrics />
    </>
  );
}
