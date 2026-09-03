import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./PAGES/Home";
import Login from "./PAGES/Login";
import Register from "./PAGES/Register";
import Dashboard from "./PAGES/Dashboard";
import Profile from "./PAGES/Profile";
import Matches from "./PAGES/Matches";
import StudentProfile from "./PAGES/studentProfile";
import Navbar from "./COMPONENTS/Navbar";
import ExploreSkills from "./PAGES/ExploreSkills";
import Requests from "./PAGES/Requests";
import ResetPassword from "./PAGES/ResetPassword";


function AppContent() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" &&
       location.pathname !== "/register" && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" 
        element={<ResetPassword/>}></Route>

        <Route path="/Dashboard" element={<Dashboard />} />

        <Route path="/Profile" element={<Profile />} />

        <Route path="/Matches" element={<Matches />} />

        <Route
          path="/student/:id"
          element={<StudentProfile />}
        />

        <Route
          path="/explore-skills"
          element={<ExploreSkills />}
        />

        <Route
          path="/requests"
          element={<Requests />}
        />
      </Routes>
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}


export default App;
