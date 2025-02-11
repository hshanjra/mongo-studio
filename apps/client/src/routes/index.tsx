import { Routes, Route, Navigate } from "react-router-dom";
import ModelList from "../pages/model-list";
import ModelView from "../pages/model-view";
import CollectionList from "../pages/collection-list";
import ModelCreate from "../pages/model-create";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/models" replace />} />
      <Route path="/models" element={<ModelList />} />
      <Route path="/models/builder" element={<ModelCreate />} />
      <Route path="/models/:modelName/view" element={<ModelView />} />
      {/* <Route path="/models/:modelName/edit" element={<ModelEdit />} /> */}
      <Route path="/collections" element={<CollectionList />} />
    </Routes>
  );
}
