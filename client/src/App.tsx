import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Home,
  ElectricityBillData,
  GasBillData,
  WaterBillData
} from './views';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/water-bill-data" element={<WaterBillData />} />
        <Route path="/gas-bill-data" element={<GasBillData />} />
        <Route path="/electricity-bill-data" element={<ElectricityBillData />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
