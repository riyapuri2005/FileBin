import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {ExplorerDisplay} from "./Elements/ExplorerDisplay";


ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
        <Routes>
            <Route path="*" element={<ExplorerDisplay />} />
        </Routes>
    </Router>
);
