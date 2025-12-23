import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import Home from "./pages/Home";
import Lines from "./pages/Lines";
import Status from "./pages/Status";
import StationDetail from "./pages/StationDetail";
import LineDetail from "./pages/LineDetail";

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lines" element={<Lines />} />
          <Route path="/lines/:id" element={<LineDetail />} />
          <Route path="/status" element={<Status />} />
          <Route path="/stations/:id" element={<StationDetail />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}