import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "@/components/Header";
import { Dashboard } from "@/pages/Dashboard";
import { CityDetail } from "@/pages/CityDetail";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/city/:lat/:lon" element={<CityDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
