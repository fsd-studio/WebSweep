import Button from "components/ui/Button";
import Input from "components/ui/Input";
import { useState } from "react";
import { toast } from "sonner";

function WebScrapingModule() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [url, setUrl] = useState('https://example.com');
    
    
    
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

export default WebScrapingModule;