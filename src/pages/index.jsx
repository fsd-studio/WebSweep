import HeadComponent from "components/config/HeadComponent";
import HeroMinimalist from "components/sections/hero/HeroMinimalist";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from "next/head";

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

      <div>
        <HeroMinimalist />
      </div>
    </>
  );
}
