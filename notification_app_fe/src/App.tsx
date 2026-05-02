import { Routes, Route } from "react-router-dom";
import AllNotifications from "./pages/AllNotifications.tsx";
import PriorityInbox from "./pages/PriorityInbox.tsx";
import Navbar from "./components/Navbar.tsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<AllNotifications />} />
        <Route path="/priority" element={<PriorityInbox />} />
      </Routes>
    </>
  );
}

export default App;