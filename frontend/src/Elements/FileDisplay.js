import { useState } from 'react';

export const FileDisplay = ({ item }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/api/download/${item.path}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div
            onClick={() => window.open(`/api/download/${item.path}`)}
            className="flex justify-between items-center bg-green-50 hover:bg-green-100 shadow rounded-md p-4 transition cursor-pointer"
        >
            <div className="flex items-center space-x-2">
                <span className="text-green-500">📄</span>
                <div>
                    <div className="font-medium text-gray-700">{item.name}</div>
                </div>
            </div>
            <div className="text-xs text-gray-600 flex items-center space-x-4 text-right">
                <span>Created: {new Date(item.created * 1000).toLocaleString()}</span>
                <span>Modified: {new Date(item.created * 1000).toLocaleString()}</span>
                <span>Accessed: {new Date(item.created * 1000).toLocaleString()}</span>
                <span>Size: {formatBytes(item.size)}</span>
                <span>Perm: {item.permission}</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCopy();
                    }}
                    className="ml-2 px-2 py-1 bg-transparent cursor-pointer rounded text-graye-700 font-bold text-sm transition"
                >
                    {copied ? "Copied!" : "🔗 Share"}
                </button>
            </div>
        </div>
    );
};
