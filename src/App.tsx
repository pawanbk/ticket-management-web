import React from "react";
import "./App.css";
import Forget from "./component/auth/Forget.tsx";
import Reset from "./component/auth/ResetPassword.jsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import Landing from "./pages/Landing.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./component/protected-route/PrivateRoute.js";
import GuestRoute from "./component/protected-route/GuestRoute.js";
import TicketList from "./pages/TicketList.tsx";
import Profile from "./pages/Profile.tsx";
import TicketDetail from "./pages/ticket/id.jsx";
import PageNotFound from "./pages/404/404.tsx";
import EmailVerified from "./component/email-verified.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GuestRoute />}>
          <Route path="/" element={<Landing />} />
        </Route>
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/tickets" element={<PrivateRoute />}>
          <Route path="/tickets" element={<TicketList />} />
        </Route>
        <Route path="/tickets/edit/:id" element={<PrivateRoute />}>
          <Route path="/tickets/edit/:id" element={<TicketDetail />} />
        </Route>
        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/email-verified" element={<PrivateRoute />}>
          <Route path="/email-verified" element={<EmailVerified />} />
        </Route>
        <Route path="/forget-password" element={<Forget />} />
        <Route path="/reset-password" element={<Reset />} />
        <Route path="/404" element={<PageNotFound />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
