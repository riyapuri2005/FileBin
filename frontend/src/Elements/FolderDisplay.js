import { useNavigate } from "react-router-dom";
import { useState } from 'react';

export const FolderDisplay = ({ item }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/${item.path}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/${item.path}`)} className="flex justify-between items-center bg-yellow-50 hover:bg-yellow-100 shadow rounded-md p-4 transition cursor-pointer">
            <div className="flex items-center space-x-2">
                <span className="text-green-500">📁</span>
                <div>
                    <div className="font-medium text-gray-700">{item.name}</div>
                </div>
            </div>
            <div className="text-xs text-gray-600 flex space-x-4 text-right">
                <span>Created: {new Date(item.created*1000).toLocaleString()}</span>
                <span>Modified: {new Date(item.created*1000).toLocaleString()}</span>
                <span>Accessed: {new Date(item.created*1000).toLocaleString()}</span>
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
    )
}