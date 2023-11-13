import NavBar from './NavBar';
import LogIn from './LogIn';
import Lifts from './Lifts';
import Profile from './Profile';
import Settings from './Settings';
import { useState } from 'react';
import './App.css'

import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  databaseURL: import.meta.env.VITE_FIREBASE_URL
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();

(async () => {
  await setPersistence(auth, browserLocalPersistence);
})();

function App() {
  const [pageBody, setPageBody] = useState('LogIn');
  const [user, setUser] = useState(null);

  return (
    <div>
      {user && (<NavBar auth={auth} setUser={setUser} setPageBody={setPageBody} />)}

      {
        (pageBody === 'LogIn' && <LogIn auth={auth} setUser={setUser} setPageBody={setPageBody} />) ||
        (pageBody === 'Lifts' && <Lifts />) ||
        (pageBody === 'Profile' && <Profile />) ||
        (pageBody === 'Settings' && <Settings />)
      }
    </div>
  );
}

export default App
