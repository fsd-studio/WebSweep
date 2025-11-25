import { useDataCollection } from "context/DataCollectionContext";
import Link from "next/link";
import { useEffect } from "react";
import Loading from "./Loading";
import ScoreRing from "./ScoreRing";
import { getGeo, getPerformance, getSeo } from "lib/universal/metricInitiators";

function ListItem({ item, href}) {
    const { computedData, updateData } = useDataCollection();
    const mobileSeo = computedData[item.id]?.MOBILE?.SEO;
    const desktopPerformance = computedData[item.id]?.DESKTOP?.PERFORMANCE;
    const geo = computedData[item.id]?.GLOBAL?.GEO; 

    useEffect(() => {
        if (computedData[item.id]) return;

        getGeo([item]).then(result => {
            updateData(item.id, "GLOBAL", "GEO", result);

            console.log("result = ", result)
            console.log(computedData)
        });

        getSeo(href).then(result => {
            console.log(result)

            updateData(item.id, "MOBILE", "SEO", result);
        });

        getPerformance(href).then(result => {
            updateData(item.id, "DESKTOP", "PERFORMANCE", result);
        });
      
    }
    , [])
  
    return (
      <Link href={`/item/${item.id}`}>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-lg truncate w-90 font-semibold capitalize">{item.title || 'Untitled'}</div>
                    <div className="mt-0.5 text-sm text-gray-600">{item.city || '—'}{item.canton ? `, ${item.canton}` : ''}</div>
                </div>

                <div className="flex">
                    <div className="flex me-11.5">
                        <div className="w-20">
                            {geo?.composite?.score != null ? <ScoreRing score={geo?.composite?.score} /> : <Loading />}
                        </div>

                        <div className="w-20">
                            {mobileSeo?.score != null ? <ScoreRing score={mobileSeo.score * 100} /> : <Loading />}
                        </div>

                        <div className="w-20">
                            {desktopPerformance?.score != null ? <ScoreRing score={desktopPerformance.score * 100} /> : <Loading />}
                        </div>

                    </div>
                </div>


                {/* {href && (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                >
                    Visit site
                </a>
                )} */}
            </div>
        </div>
      </Link>
    );
}

export default ListItem;