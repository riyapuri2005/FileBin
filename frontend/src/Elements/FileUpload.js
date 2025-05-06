import {useState} from "react";
import axios from "axios";

export const FileUpload = ({closePopup, fetchStructure, location}) => {
    const [successNotification, setSuccessNotification] = useState("");
    const [failureNotification, setFailureNotification] = useState("");
    const [failedFiles, setFailedFiles] = useState([]);
    const [files, setFiles] = useState([]);
    const [progress, setProgress] = useState(0);

    function handleUpload() {
        setProgress(0);
        setSuccessNotification("");
        setFailureNotification("");
        setFailedFiles([]);

        const formData = new FormData();
        formData.append("location", location);

        Object.values(files).forEach(file => {
            formData.append("uploaded_files", file);
        })

        axios.post('/api/upload', formData, {
            onUploadProgress: (progressEvent) => {
                setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            }
        })
            .then(async response => {
                setProgress(0);
                const data = response.data;
                if (data.length === 0) {
                    setSuccessNotification("All files uploaded successfully");
                    await fetchStructure()
                    closePopup()
                } else {
                    setFailureNotification("Some files failed to upload");
                    await fetchStructure()
                    setFailedFiles(data);
                }
            })
            .catch(error => {
                setProgress(0);
                console.error(error);
            });
        setFiles([]);
    }


    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
        <div className="bg-white w-[90%] max-w-[400px] h-auto p-6 rounded-lg shadow-lg relative flex flex-col items-center shadow-gray-800 shadow-xl border border-gray-200">
            <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-t-lg overflow-hidden">
                <div
                    id="uploadProgressBar"
                    className="h-full bg-blue-500 transition-all duration-300 ease-linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="cursor-pointer self-end mb-4 bg-gray-200 text-gray-500 font-bold border border-gray-500 px-3 py-1 rounded-lg" data-discover="true" onClick={() => {
                if (progress===0) closePopup()
            }}>X
            </div>

            <div className="max-w-xl mx-auto bg-white shadow-md rounded-md p-6">
                <p className="green text-sm text-center mb-2">{successNotification}</p>
                <p className="text-red-500 text-sm text-center mb-2">{failureNotification}</p>
                {failedFiles.map(file => (<li className="text-red-500 text-sm text-center mb-2" key={file.filename}>📄{file.filename}: {file.notification}</li>))}
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload Files</h2>

                <label className="block border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition" htmlFor="fileInput">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M7 16V4m0 0L3.5 7.5M7 4l3.5 3.5M17 20v-8m0 0l-3.5 3.5M17 12l3.5 3.5" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2"/>
                    </svg>
                    <p className="text-sm text-gray-600">Click to upload or drag files here</p>
                    <input className="hidden" id="fileInput" multiple type="file" required
                           onChange={(e) => setFiles(Array.from(e.target.files))}
                    />
                </label>

                <ul className="mt-4 space-y-1 text-sm text-gray-700" id="fileList">
                    {files.length === 0 ? (<li className="text-gray-400 italic">No files selected.</li>) : (files.map((file) => <li key={file.name}>📄 {file.name}</li>))}
                </ul>

                <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition" onClick={handleUpload} disabled={files.length === 0}>
                    Upload
                </button>

                <div className="mt-4 text-sm text-gray-600" id="uploadStatus"></div>
            </div>
        </div>
    </div>)
}