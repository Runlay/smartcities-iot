import "./App.css";
import { ThemeProvider } from "./components/theme-provider";

import { NavigationBar } from "./components/navbar";
import { SensorReadingTable } from "./components/sensor-reading-table";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex justify-between items-center">
        <NavigationBar></NavigationBar>
      </div>

      <section>
        <SensorReadingTable></SensorReadingTable>
      </section>
    </ThemeProvider>
  );
}

export default App;
