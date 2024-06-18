import { useEffect } from 'react';
import './App.css';
import './assets/styles/constans.css';
import { NextUIProvider } from "@nextui-org/react";
import { useDispatch, useSelector } from 'react-redux';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header';
import Clicker from './components/Clicker/Clicker';
import axios from 'axios';
import { getUsers, getUser, } from './store/slices/users.jsx'
import {Button} from "@nextui-org/react";

export const updateAutofarmStatus = (username, autofarmStatus) => {
  axios.put(process.env.REACT_APP_API + `users/${username}/update/autofarm/status`, {
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
  axios.put(process.env.REACT_APP_API + `users/${username}/update/energy/status`, {
    "new_status": energyStatus
  })
  .then((response) => {
    console.log(response.data, energyStatus);
  })
  .catch((error) => {
    console.log(error, energyStatus)
  })
}

function App() {
  const { tg, user } = useTelegram();
  const dispatch = useDispatch();

  useEffect(() => {
  tg.ready();
  dispatch(getUsers());
  user && dispatch(getUser(user?.username));

  if (!currentUser && !users.find(user => user.username === currentUser?.username)) {
    addUser(currentUser.username)
  } 
  }, []);

  const {users, loadingUsers} = useSelector((state) => state.users);
  const {currentUser, loadingUser} = useSelector((state) => state.users);

  const addUser = (username) => {
    axios.post(process.env.REACT_APP_API + 'users', {
      "username": username
    })
    // .then((response) => {
    //   console.log(response.data);
    // })
    .catch((error) => {
      console.log(error)
    })
  }

  const putPoints = (username, points, energy) => {
    axios.put(process.env.REACT_APP_API + `users/${username}/update/points`, {
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

  useEffect(() => {
    currentUser.points && putPoints(currentUser.username, currentUser.points, currentUser.farm_params.energy);
  }, [currentUser.points, currentUser.farm_params.energy])

  useEffect(() => {
    const handleBeforeUnload = () => {
      putPoints(currentUser.username, currentUser.points, currentUser.farm_params.energy);
    }

    window.addEventListener('beforeunload', handleBeforeUnload)  

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [currentUser.farm_params.status, currentUser.autofarm_params.status])

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
        {loadingUser === 'success' &&
          <><Header />
          <Clicker /></>
        }
      </div>
    </NextUIProvider>
  );
}

export default App;
