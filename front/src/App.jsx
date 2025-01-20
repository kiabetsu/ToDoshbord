import './App.scss';
import AuthCard from './components/Test/AuthCard';
import { Test } from './components/Test/Test';
import { Tiptap } from './components/Tiptap/';

import { PersonalDashboard } from './Pages/PersonalDashboard';

function App() {
  return (
    <div className="App">
      <PersonalDashboard />
      {/* <Test /> */}
      {/* <AuthCard /> */}
      {/* <Tiptap content="111" type="Description" /> */}
    </div>
  );
}

export default App;
