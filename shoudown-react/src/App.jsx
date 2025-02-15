import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/Auth";
import WomenList from "./components/WomenList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/womenList" element={<WomenList />} />
      </Routes>
    </Router>
  );
}

export default App;
