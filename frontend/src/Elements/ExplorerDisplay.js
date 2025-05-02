import React from "react"
import {FolderDisplay} from "./FolderDisplay"
import {FileDisplay} from "./FileDisplay"
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

import {FileUpload} from "./FileUpload";
import {FolderCreate} from "./FolderCreate";

export const ExplorerDisplay = () => {
    const {'*': wildcardPath} = useParams();
    const navigate = useNavigate();

    const [showFileUpload, setShowFileUpload] = useState(false);
    const [showFolderCreate, setShowFolderCreate] = useState(false);

    const [structure, setStructure] = useState([]);
    const [currentNode, setCurrentNode] = useState(null);


    const fetchStructure = async () => {
        await axios.get(`/api/all-files`)
            .then(response => {
                setStructure(response.data);
            })
            .catch(error => console.error("Error fetching structure:", error));
    }

    useEffect(async () => {
        await fetchStructure()
    }, []);


    useEffect(() => {
        if (!structure || structure.length === 0) return;

        const urlSegments = wildcardPath ? wildcardPath.split('/') : [];
        let current = structure;

        for (let segment of urlSegments) {
            current = current.children.find(item => item.name === segment);
            if (!current) {
                console.error('Path not found');
                navigate("/");
                return;
            } else {
                if (current.is_file) {
                    window.location.href = `/api/download/${current.path}`;
                    navigate("/" + current.parent);
                } else {
                    setCurrentNode(current);
                }
            }
        }
        if (urlSegments.length === 0) {
            setCurrentNode(structure);
        }

    }, [structure, wildcardPath, navigate]);


    return (<div>
        {showFileUpload && <FileUpload closePopup={() => setShowFileUpload(false)} fetchStructure={fetchStructure} location={wildcardPath}/>}
        {showFolderCreate && <FolderCreate closePopup={() => setShowFolderCreate(false)} fetchStructure={fetchStructure} location={wildcardPath}/>}
        <div id="breadcrumb" className="text-sm text-gray-600 mb-4">
    <span key={-1} onClick={() => navigate(`/`)} className="cursor-pointer">
        Home
    </span>
            {wildcardPath ? wildcardPath.split('/').map((segment, index) => (<React.Fragment key={index}>
                    {' > '}
                    <span
                        onClick={() => navigate(`/${wildcardPath.split('/').slice(0, index + 1).join('/')}`)}
                        className="cursor-pointer"
                    >
                {segment}
            </span>
                </React.Fragment>)) : null}
        </div>


        <div className="w-full flex justify-end mb-4 space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setShowFileUpload(true)}>Upload File</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => setShowFolderCreate(true)}>Create Folder</button>
        </div>

        <div id="folderSection" className="mb-6">
            <div id="folders" className="space-y-2">
                {currentNode?.children
                    ?.filter(item => item.is_dir)
                    .map(item => (<FolderDisplay key={item.path} item={item}/>))}
            </div>
        </div>

        <div id="fileSection">
            <div id="files" className="space-y-2">
                {currentNode?.children
                    ?.filter(item => item.is_file)
                    .map(item => (<FileDisplay key={item.path} item={item}/>))}
            </div>
        </div>
    </div>)
}
