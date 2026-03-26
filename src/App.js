import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from './GlobalJS/Login';
import Layout from './GlobalJS/Layout';

function App() {
  return ( 
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Layout" element={<Layout />} />
      </Routes>
    </Router>
  );
}

export default App;
