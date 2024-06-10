import { useEffect } from 'react';
import './App.css';
import './assets/styles/constans.css';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header';
import Clicker from './components/Clicker/Clicker';


function App() {
  const { tg } = useTelegram();

  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <div className="app_container">
      <Header />
      <Clicker />
    </div>
  );
}

export default App;
