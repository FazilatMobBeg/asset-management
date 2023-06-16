import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import OutputPage from "./pages/Output";
import Navbar from "./components/Navbar";
import UploadPage from "./pages/Upload";
import AssetDetailsPage from "./pages/AssetDetails";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/output" element={<OutputPage />} />
        <Route path="/assets/:invoice_id" element={<AssetDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;
