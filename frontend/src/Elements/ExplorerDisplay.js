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

    const [showFileUpload, setShowFileUpload] = useState(true);
    const [showFolderCreate, setShowFolderCreate] = useState(false);

    const [structure, setStructure] = useState([]);
    const [currentNode, setCurrentNode] = useState(null);


    const fetchStructure = async () => {
        await axios
            .get(`http://localhost/api/all-files`)
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
        console.log("urlSegments", urlSegments);
        let current = structure;

        for (let segment of urlSegments) {
            console.log("segment", segment)
            current = current.children.find(item => item.name === segment);
            if (!current) {
                console.error('Path not found');
                navigate("/");
                return;
            } else {
                if (current.is_file) {
                    window.location.href = `http://localhost/api/download/${current.path}`;
                    navigate("/" + current.parent);
                } else {
                    setCurrentNode(current);
                    console.log("currentNode", current);
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
