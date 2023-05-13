import BookingForm from './Components/BookingForm.js';
import Logo from './Images/Logo.PNG';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={Logo} alt="" className="Logo-Image"/>
      </header>
      <BookingForm></BookingForm>
    </div>
  );
}

export default App;
