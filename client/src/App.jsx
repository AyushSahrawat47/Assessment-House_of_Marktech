import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'

function App() {

  return (
    <Router>
    <h1>Hello world!</h1>
    <Routes>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' element={<AdminDashboard/>}/>

    </Routes>

    </Router>
  )
}

export default App
