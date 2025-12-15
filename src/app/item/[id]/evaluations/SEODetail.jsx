import LightHouseDetail from "./LIghthouseSummary";
import Loading from "./Loading";

function SEODetail({seo}) {
  return (
    <>
        { seo ? <LightHouseDetail title="SEO" description="Aggregate Lighthouse SEO score" audits={seo.audits} score={seo.score} /> :
            <Loading>
            SEO is loading.
            </Loading>
        }
    </>
  );
}

export default SEODetail;