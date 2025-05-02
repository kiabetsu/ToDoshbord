import { useDispatch, useSelector } from 'react-redux';

import './App.scss';
import { LoginModal } from './components/LoginModal';
import { PersonalDashboard } from './Pages/PersonalDashboard';
import React from 'react';
import { checkAuth } from './redux/authSlice';
import { getTasks } from './redux/taskSlice';
import { Alert, AlertList } from './components/Alert';

function App() {
  const { isLoading, isAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(checkAuth());
    if (isAuth) dispatch(getTasks());
  }, [isAuth]);

  return (
    <div className="App">
      <AlertList />
      <LoginModal />
      <PersonalDashboard />
    </div>
  );
}

export default App;
