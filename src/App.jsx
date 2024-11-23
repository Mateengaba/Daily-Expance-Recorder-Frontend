import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Transaction from './components/Transaction,';
import AuthRoute from './Authsrout/AuthRoute'
import ProtectedRoutes from './Authsrout/ProtectedRoutes'


function App() {
  return (
    <Routes>

      <Route element={<AuthRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>


      <Route element={<ProtectedRoutes />}>
        <Route path="/transaction" element={<Transaction />} />
      </Route>

    </Routes>
  );
}

export default App;
