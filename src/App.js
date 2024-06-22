import { useEffect } from 'react';
import './App.css';
import './assets/styles/constans.css';
import { Button, NextUIProvider, Spinner } from "@nextui-org/react";
import { useDispatch, useSelector } from 'react-redux';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header';
import Clicker from './components/Clicker/Clicker';
import axios from 'axios';
import { getUsers, getUser, } from './store/slices/users.jsx'

export const updateAutofarmStatus = (username, autofarmStatus) => {
  axios.put(`https://eco.almazor.co/users/${username}/update/autofarm/status`, {
    "new_status": autofarmStatus
  })
  .then((response) => {
    console.log(response.data, autofarmStatus);
  })
  .catch((error) => {
    console.log(error, autofarmStatus)
  })
}

export const putEnergyStatus = (username, energyStatus) => {
  axios.put(`https://eco.almazor.co/users/${username}/update/energy/status`, {
    "new_status": energyStatus
  })
  .then((response) => {
    console.log(response.data, energyStatus);
  })
  .catch((error) => {
    console.log(error, energyStatus)
  })
}

export const putPoints = (username, points, energy) => {
  axios.put(`https://eco.almazor.co/users/${username}/update/points`, {
    "points": points,
    "energy": energy
  })
  // .then((response) => {
  //   console.log(response.data);
  // })
  .catch((error) => {
    console.log(error)
  })
}

const addUser = (username) => {
  axios.post('https://eco.almazor.co/users', {
    "username": username
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error)
  })
}

function App() {
  const { tg, user } = useTelegram();
  const dispatch = useDispatch();

  const {users, loadingUsers, currentUser, loadingUser} = useSelector((state) => state.users);

  // const existingUser = users.find(user => user.username === user.username);
  loadingUser === 'failed' && addUser(user?.username);

  useEffect(() => {
    tg.ready();
    dispatch(getUsers());

    user ? dispatch(getUser(user?.username)) : dispatch(getUser(currentUser.username));
  }, []);

  const onClose = () => {
    tg.close()
  }
  
  return (
    <NextUIProvider>
      <div className="app_container">
        <Button 
          color="primary" 
          variant="light" 
          size='sm' 
          onClick={onClose}
          style={{alignSelf: 'flex-start', color: 'hsl(var(--nextui-warning-200))'}}
        >
          Close
        </Button>  
        {loadingUsers === 'loading' &&
          <Spinner label="Loading" color="warning" labelColor="warning" size="lg"/>
        }
        {loadingUser === 'success' &&
          <>
          <Header />
          <Clicker />
          </>
        }
      </div>
    </NextUIProvider>
  );
}

export default App;
