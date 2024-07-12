import Button from "@mui/material/Button";
import Dashboard from "./component/Dashboard";
import Signup from "./component/Signup";
import Signin from "./component/Signin";
import NoPage from "./component/NoPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./component/SocketContext";

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
