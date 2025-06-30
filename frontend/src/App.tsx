import { BrowserRouter, Routes, Route } from 'react-router';
import DashboardPage from './pages/DashboardPage.tsx';
import ConfigurationPage from './pages/ConfigurationPage.tsx';
import PlanExecutionPage from './pages/PlanExecutionPage.tsx';
import RawDataPage from './pages/RawDataPage.tsx';
import RootLayout from './pages/RootLayout.tsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path='configuration' element={<ConfigurationPage />} />
          <Route path='plan-execution' element={<PlanExecutionPage />} />
          <Route path='raw-data' element={<RawDataPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
