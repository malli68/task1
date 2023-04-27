import './App.css';
import 'primereact/resources/themes/lara-light-blue/theme.css'
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";                                         
import ContinentalList from './ContinentalList';

function App() {
  return (
    <div className="App">
      <ContinentalList/>
    </div>
  );
}

export default App;