import { createTheme } from "@mui/material/styles"
import { useMemo, useState } from "react"
import { themeSettings } from "./theme"
import { ThemeProvider } from "@mui/system"
import { Box, CssBaseline } from "@mui/material"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./scenes/navbar/Navbar"
import Dashboard from "./scenes/dashboard/Dashboard"
import LoadingScreen from "./components/LoadingScreen"

import Predictions from './scenes/predictions/Predictions';

import './index.css'
function App() {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const theme = useMemo(() => createTheme(themeSettings), []);

  const handleBackendReady = () => {
    setIsBackendReady(true);
  };

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {!isBackendReady ? (
            <LoadingScreen onBackendReady={handleBackendReady} />
          ) : (
            <Box width='100%' height='100%' padding="1rem 2rem 4rem 2rem">
              <Navbar />  
              <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/predictions' element={<Predictions />} />
              </Routes>
            </Box>
          )}
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
