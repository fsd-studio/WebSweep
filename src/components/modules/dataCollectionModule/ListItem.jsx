import { Suspense, useEffect, useState } from "react";
import Loading from "./Loading";
import ScoreRing from "./ScoreRing";
import { useDataCollection } from "context/DataCollectionContext";

function ListItem({ item, href}) {
    const { computedData, setComputedData, updateScore } = useDataCollection();
    const { geo, seo, performance } = computedData[item.id] || {};

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getGeo() {
        const wait = Math.random() * 3000;
        await delay(wait);
        console.log("test")
        return Math.floor(Math.random() * 101); 
    }

    async function getSeo() {
        const wait = Math.random() * 3000;
        await delay(wait);
        return Math.floor(Math.random() * 101);
    }

    async function getPerformance() {
        const wait = Math.random() * 3000;
        await delay(wait);
        return Math.floor(Math.random() * 101);
    }

    useEffect(() => {
        if (computedData[item.id]) return;

        getGeo().then(value => updateScore(item.id, "geo", { "score": value}));
        getSeo().then(value => updateScore(item.id, "seo", { "score": value}));
        getPerformance().then(value => updateScore(item.id, "performance", { "score": value}));        
    }
    , [])
  

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-lg truncate w-90 font-semibold capitalize">{item.title || 'Untitled'}</div>
                    <div className="mt-0.5 text-sm text-gray-600">{item.city || '—'}{item.canton ? `, ${item.canton}` : ''}</div>
                </div>

                <div className="flex">
                    <div className="flex me-11.5">
                        <div className="w-20">
                            {geo?.score != null ? <ScoreRing score={geo.score} /> : <Loading />}
                        </div>

                        <div className="w-20">
                            {seo?.score != null ? <ScoreRing score={seo.score} /> : <Loading />}
                        </div>

                        <div className="w-20">
                            {performance?.score != null ? <ScoreRing score={performance.score} /> : <Loading />}
                        </div>
                    </div>
                </div>


                {href && (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                >
                    Visit site
                </a>
                )}
            </div>
        </div>
    );
}

export default ListItem;