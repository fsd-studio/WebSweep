
import LightHouseSummary from "./LIghthouseSummary";
import Loading from "./Loading";

function Lighthouse({ seo, performance }) {
  if (seo) console.log(seo)

  return (
    <>
    { seo ? <LightHouseSummary title="SEO" audits={seo.audits} score={seo.score} /> :
        <Loading>
          SEO is loading.
        </Loading>
    }

    { performance ? <LightHouseSummary title="performance" audits={performance.audits} score={performance.score} /> :
        <Loading>
          Performance is loading.
        </Loading>
    }
    </>
  );
}

export default Lighthouse;