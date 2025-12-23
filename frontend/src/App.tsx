import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import Home from "./pages/Home";
import Lines from "./pages/Lines";
import Status from "./pages/Status";

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lines" element={<Lines />} />
          <Route path="/status" element={<Status />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
