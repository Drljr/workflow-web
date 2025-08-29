import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}
