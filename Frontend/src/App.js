import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Auth/Login';
import SignupPage from './components/Auth/Register';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import ProtectAdmin from './components/Auth/ProtectAdmin';
import ProtectUser from './components/Auth/ProtectUser';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path='/register' element={<SignupPage />} />
        <Route path='/admin/dashboard' element={<ProtectAdmin Component={AdminDashboard} />} />
        <Route path='/user/dashboard' element={<ProtectUser Component={UserDashboard} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
