import { Routes, Route, Navigate } from "react-router-dom";
import ModelList from "../pages/model-list";
import ModelView from "../pages/model-view";
import CollectionList from "../pages/collection-list";
import ModelCreate from "../pages/model-create";
import HomePage from "@/pages/home";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/models" element={<ModelList />} /> */}
      <Route path="/create" element={<ModelCreate />} />
      {/* <Route path="/models/:modelName/view" element={<ModelView />} /> */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
