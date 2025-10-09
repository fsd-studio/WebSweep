import HeadComponent from "components/config/HeadComponent";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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

    </>
  );
}
