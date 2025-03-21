import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Books from './pages/Books';
import Members from './pages/Members';
import Loans from './pages/Loans';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/books" element={<Books />} />
        <Route path="/members" element={<Members />} />
        <Route path="/loans" element={<Loans />} />
      </Routes>
    </Router>
  );
}

export default App;
