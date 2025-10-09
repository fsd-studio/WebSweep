import Button from "components/ui/Button";
import { useState } from "react";
import { toast } from "sonner";

function Lighthouse() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [url, setUrl] = useState('https://example.com');

    const runLighthouse = async () => {
        const loadingToast = toast.loading('Analyzing performance...');
        setLoading(true);

        try {
            const response = await fetch('/api/lighthouse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });

            const result = await response.json();
            
            if (result.success) {
                setData(result.data);
                toast.success('Performance analysis completed!', {
                    id: loadingToast,
                    description: `Score: ${result.data.performanceScore.toFixed(0)}/100`
                });
            } else {
                toast.error('Analysis failed', {
                    id: loadingToast,
                    description: result.error
                });
            }
        } catch (error) {
            toast.error('Network error', {
                id: loadingToast,
                description: error.message
            });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="h-full overflow-y-auto flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Performance Metrics</h2>
            
            <div className="mb-4">
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL to test"
                    className="border p-2 rounded mr-2 w-96"
                />
                <Button onClick={runLighthouse} disabled={loading}>
                    {loading ? "Analyzing..." : "Run Test"}
                </Button>
            </div>
            
            <div className="overflow-auto">
                {data && (
                    <div className="grid grid-cols-2 gap-4">
                        <MetricCard title="Performance Score" value={`${data.performanceScore.toFixed(0)}/100`} />
                        <MetricCard title="Page Load Time" value={`${(data.pageLoadTime / 1000).toFixed(2)}s`} />
                        <MetricCard title="Response Time" value={`${data.responseTime.toFixed(0)}ms`} />
                        <MetricCard title="HTTP Requests" value={data.numberOfRequests} />
                        <MetricCard title="Total Page Size" value={`${(data.totalPageSize / 1024 / 1024).toFixed(2)} MB`} />
                        <MetricCard title="Time to Interactive" value={`${(data.timeToInteractive / 1000).toFixed(2)}s`} />
                        <MetricCard title="First Contentful Paint" value={`${(data.firstContentfulPaint / 1000).toFixed(2)}s`} />
                        <MetricCard title="Largest Contentful Paint" value={`${(data.largestContentfulPaint / 1000).toFixed(2)}s`} />
                        <MetricCard title="Cumulative Layout Shift" value={data.cumulativeLayoutShift.toFixed(3)} />
                    </div>
                )}
            </div>
        </div>
    );
}

function MetricCard({ title, value }) {
    return (
        <div className="border rounded p-4 bg-white shadow-sm">
            <div className="text-sm text-gray-600">{title}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
    );
}

export default Lighthouse;