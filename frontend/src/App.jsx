import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AudienceProvider } from './context/AudienceContext';
import AppLayout from './layouts/AppLayout';
import Analytics from './pages/Analytics';
import AudienceBuilder from './pages/AudienceBuilder';
import CampaignBuilder from './pages/CampaignBuilder';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AudienceProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="audience" element={<AudienceBuilder />} />
            <Route path="campaigns" element={<CampaignBuilder />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AudienceProvider>
  );
}
