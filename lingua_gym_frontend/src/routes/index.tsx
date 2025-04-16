import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NewMaterials from '../pages/NewMaterialsPage';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/materials" element={<NewMaterials />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;