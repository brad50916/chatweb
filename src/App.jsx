import Dashboard from "./component/Dashboard";
import Signup from "./component/Signup";
import Signin from "./component/Signin";
import NoPage from "./component/NoPage";
import Profile from "./component/Profile";
import Modify from "./component/Modify";
import { HashRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./component/SocketContext";
import { useState } from "react";

function App() {
  return (
    <SocketProvider>
      <HashRouter basename="/chatweb">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Signin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/modify" element={<Modify />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </HashRouter>
    </SocketProvider>
  );
}

export default App;
