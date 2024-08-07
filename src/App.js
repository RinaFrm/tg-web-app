import { useEffect } from 'react';
import './App.css';
import './assets/styles/constans.css';
import { Button, Modal, ModalBody, ModalContent, NextUIProvider, Spinner, useDisclosure } from "@nextui-org/react";
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

  const addUser = (id) => {
    axios.post('https://eco.almazor.co/users', {
      "username": id.toString()
    })
    .then((response) => {
      console.log(response);
      dispatch(getUser(id));
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const {users, loadingUsers, currentUser, loadingUser} = useSelector((state) => state.users);

  useEffect(() => {
    tg.ready();
    tg.expand();
    dispatch(getUsers());

    user ? dispatch(getUser((user?.id).toString())) : dispatch(getUser('test_user'));
  }, []);

  const onCloseApp = () => {
    tg.close()
  }

  const {onClose} = useDisclosure();

  const handleAddUser = () => {
    addUser(user ? user.id : 'test_user');
    onClose();
  }
  
  return (
    <NextUIProvider>
      <div className="app_container">
        <Button 
          color="primary" 
          variant="light" 
          size='sm' 
          onClick={onCloseApp}
          style={{alignSelf: 'flex-start', color: 'hsl(var(--nextui-warning-200))'}}
        >
          Close
        </Button>  
        {loadingUsers === 'loading' &&
          <Spinner label="Loading" color="warning" labelColor="warning" size="lg"/>
        }
        {loadingUser === 'failed' &&
          <Modal
            size="sm" 
            isOpen={loadingUser === 'failed'} 
            onClose={handleAddUser}
            backdrop='blur'
            placement='center'
            classNames={{
                body: 'py-10',
                base: "bg-[#CCE3FD] text-[#001731]",
            }}          
          >
            <ModalContent>
              {(onClose) => (
                  <ModalBody>
                    <Button
                      color="primary" 
                      size='lg' 
                      onClick={() => {
                        handleAddUser();
                        onClose();
                      }}
                    >
                      Welcome! Let's go!
                    </Button>
                  </ModalBody>
              )}
            </ModalContent>
          </Modal>
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

