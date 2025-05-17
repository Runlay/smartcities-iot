import { ThemeProvider } from '../components/theme-provider';
import Navbar from '../components/navbar';

const PlanExecution = () => {
  return (
    <ThemeProvider>
      <div className='container mx-auto px-6'>
        <Navbar />
      </div>
    </ThemeProvider>
  );
};

export default PlanExecution;
