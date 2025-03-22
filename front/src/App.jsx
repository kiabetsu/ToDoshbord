import { useDispatch, useSelector } from 'react-redux';

import './App.scss';
import { LoginModal } from './components/LoginModal';
import { PersonalDashboard } from './Pages/PersonalDashboard';
import React from 'react';
import { checkAuth } from './redux/authSlice';

function App() {
  const { isLoading, isAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(checkAuth());
  }, []);

  return (
    <div className="App">
      <LoginModal />
      <PersonalDashboard />
    </div>
  );
}

export default App;
