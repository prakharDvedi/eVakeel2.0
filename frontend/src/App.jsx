import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import FeaturesPage from "./pages/FeaturesPage.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import LegalAdvisorPage from "./pages/LegalAdvisorPage.jsx";
import DocumentParserPage from "./pages/DocumentParserPage.jsx";
import LegalScorePage from "./pages/LegalScorePage.jsx";
import "./App.css";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="advisor" element={<LegalAdvisorPage />} />
        <Route path="parser" element={<DocumentParserPage />} />
        <Route path="score" element={<LegalScorePage />} />
        <Route path="features" element={<FeaturesPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}

export default App;
