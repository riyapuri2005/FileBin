import { useNavigate } from "react-router-dom";

export const FolderDisplay = ({ item }) => {
    console.log("folder item", item);
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/${item.path}`)} className="flex justify-between items-center bg-yellow-50 hover:bg-yellow-100 shadow rounded-md p-4 transition cursor-pointer">
            <div className="flex items-center space-x-2">
                <span className="text-green-500">📄</span>
                <div>
                    <div className="font-medium text-gray-700">{item.name}</div>
                    <div className="text-xs text-gray-500">File</div>
                </div>
            </div>
            <div className="text-xs text-gray-600 flex space-x-4 text-right">
                <span>Created: {new Date(item.created*1000).toLocaleString()}</span>
                <span>Modified: {new Date(item.created*1000).toLocaleString()}</span>
                <span>Accessed: {new Date(item.created*1000).toLocaleString()}</span>
                <span>Size: {item.size}</span>
                <span>Perm: {item.permission}</span>
            </div>
        </div>
    )
}