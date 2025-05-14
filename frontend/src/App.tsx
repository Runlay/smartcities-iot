import './App.css'
import { ThemeProvider } from './components/theme-provider'
import { Button } from "@/components/ui/button"
import { ModeToggle } from './components/mode-toggle'

import { Warehouse } from 'lucide-react'

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className="flex flex-col items-center justify-center min-h-svh">
        <ModeToggle></ModeToggle>

        <Button>
          <Warehouse></Warehouse>
          SmartStore</Button>
      </div>
    </ThemeProvider>
  )
}

export default App
