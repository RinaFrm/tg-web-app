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

function App() {
  const { tg, user } = useTelegram();
  const dispatch = useDispatch();

  const {users, loadingUsers, currentUser, loadingUser} = useSelector((state) => state.users);

  useEffect(() => {
    tg.ready();

    dispatch(getUsers());
    if (currentUser?.username === '' && users.find(user => user.username === currentUser?.username)) {
      user ? addUser(user.username) : addUser('test_user');
    } else {
      user ? dispatch(getUser(user?.username)) : dispatch(getUser('test_user'));
    }
  }, []);

  const addUser = (username) => {
    axios.post('https://eco.almazor.co/users', {
      "username": username
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error)
    })
  }

  // useEffect(() => {
  //   putPoints(currentUser.username, currentUser.points, currentUser.farm_params.energy);
  // }, [currentUser.points])

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
          <p style={{color: 'hsl(var(--nextui-warning-200))'}}>{[loadingUser, currentUser, user.username]}</p>
          <Header />
          <Clicker />
          </>
        }
      </div>
    </NextUIProvider>
  );
}

export default App;
