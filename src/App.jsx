import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MainLayout from './layouts/MainLayout';
import PurchaseReq from './pages/PurchaseReq';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <MainLayout>
            <Dashboard />
          </MainLayout>} />
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="purchase-requisitions" element={
          <MainLayout>
            <PurchaseReq />
          </MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;