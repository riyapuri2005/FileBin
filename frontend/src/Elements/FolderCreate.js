import {useState} from "react"
import axios from "axios";

export const FolderCreate = ({closePopup, fetchStructure, location}) => {
    const [successNotification, setSuccessNotification] = useState("");
    const [failureNotification, setFailureNotification] = useState("");
    const [newFolderName, setNewFolderName] = useState("");

    function handleCreate() {
        setSuccessNotification("");
        setFailureNotification("");

        const formData = new FormData();
        formData.append("location", location);
        formData.append("folder_name", newFolderName);

        axios.post('/api/create-folder', formData)
            .then(async response => {
                const data = response.data;
                if (data.allowed) {
                    setSuccessNotification("Folder created successfully");
                    await fetchStructure()
                    closePopup()
                } else {
                    setFailureNotification(data.notification);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="bg-white w-[90%] max-w-[400px] h-auto p-6 rounded-lg shadow-lg relative flex flex-col items-center shadow-gray-800 shadow-xl border border-gray-200">
                <div className="cursor-pointer self-end mb-4 bg-gray-200 text-gray-500 font-bold border border-gray-500 px-3 py-1 rounded-lg" onClick={closePopup}>X</div>
                <div className="w-full">
                    <p className="green text-sm text-center mb-2">{successNotification}</p>
                    <p className="text-red-500 text-sm text-center mb-2">{failureNotification}</p>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Create Folder</h2>
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        name="folderName"
                        placeholder="Enter folder name"
                        required
                        type="text"
                        value={newFolderName}
                        onChange={e => setNewFolderName(e.target.value)}
                    />

                    <button
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                        type="submit"
                        onClick={handleCreate}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}