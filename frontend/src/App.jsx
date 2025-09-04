import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import UpdatePassword from './components/Auth/UpdatePassword';
import Account from './pages/Account';
import Budget from './pages/Budget';

function App() {

  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path='/dashboard'element={
          // <ProtectedRoute>
            <Dashboard />
          // </ProtectedRoute>
        } />
        <Route path='/account' element={<Account />} />
        <Route path='/budget' element={<Budget />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
