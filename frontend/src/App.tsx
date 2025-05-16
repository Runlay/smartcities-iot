import { ThemeProvider } from './components/theme-provider';
import { Button } from './components/ui/button';

const App = () => {
  return (
    <ThemeProvider>
      <Button>SmartStore</Button>
    </ThemeProvider>
  );
};
export default App;
