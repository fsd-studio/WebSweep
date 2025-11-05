import Button from "components/ui/Button";
import Input from "components/ui/Input";
import { useState } from "react";
import { toast } from "sonner";

function WebScrapingModule() {
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
                    description: `Score: ${result.data}`
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

    console.log(data)
    
    return (
        <div className="h-full overflow-y-auto flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Performance Metrics</h2>
            <div className="w-30 space-y-2">
                <Input onChange={(e) => setUrl(e.target.value)}></Input>
                <Button disabled={loading} onClick={runLighthouse}>Get metrics</Button>
            </div>
            <p>{JSON.stringify(data)}</p>
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

export default WebScrapingModule;