import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";

import AppRoutes from "./routes";
import { AppProviders } from "./providers";

function App() {

  useEffect(() => {
    fetch("https://eventra-j1tj.onrender.com/health")
      .catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;