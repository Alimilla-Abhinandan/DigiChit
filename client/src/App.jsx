import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landingpage/LandingPage';
import Signup from './components/signup/Signup';
import Signin from './components/signin/Signin';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import GroupDetails from './components/groups/GroupDetails';
import Contact from './components/contact/Contact';
import PrivateRoute from './components/common/PrivateRoute'
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/group/:groupId" element={<PrivateRoute><GroupDetails /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
