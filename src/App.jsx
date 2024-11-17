import './App.scss';
import { Test } from './components/Test/Test';

import { PersonalDashboard } from './Pages/PersonalDashboard';

function App() {
  return (
    <div className="App">
      <PersonalDashboard />
      <Test />
    </div>
  );
}

export default App;
