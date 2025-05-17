import { Routes, Route } from 'react-router';
import Overview from './pages/Overview';
import EnvironmentState from './pages/EnvironmentState';
import PlanExecution from './pages/PlanExecution';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Overview />} />
      <Route path='/environment-state' element={<EnvironmentState />} />
      <Route path='/plan-execution' element={<PlanExecution />} />
    </Routes>
  );
};

export default App;
