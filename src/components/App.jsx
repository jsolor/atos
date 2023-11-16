import './App.css'
import NavBar from './NavBar';
import LogIn from './LogIn';
import Lifts from './Lifts';
import Profile from './Profile';
import Settings from './Settings';
import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, set } from "firebase/database";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  databaseURL: import.meta.env.VITE_FIREBASE_URL
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();

(async () => {
  await setPersistence(auth, browserLocalPersistence);
})();

function App() {
  const [pageBody, setPageBody] = useState('LogIn');
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const [week, setWeek] = useState(0);
  const [day, setDay] = useState(0);

  useEffect(() => {
    if (!user) setUid(null);
    if (user && 'uid' in user) setUid(user.uid);
  }, [user]);

  const setWeekDay = (w, d = day) => {
    setWeek(w);
    setDay(d);
  };

  return (
    <div>
      {user && (<NavBar auth={auth} setUser={setUser} pageBody={pageBody} setPageBody={setPageBody} week={week} day={day} />)}

      {
        (pageBody === 'LogIn' && <LogIn auth={auth} setUser={setUser} setPageBody={setPageBody} />) ||
        (pageBody === 'Lifts' && <Lifts db={db} uid={uid} week={week} day={day} setWeekDay={setWeekDay} />) ||
        (pageBody === 'Profile' && <Profile db={db} uid={uid} />) ||
        (pageBody === 'Settings' && <Settings db={db} uid={uid} />)
      }
    </div>
  );
}

export default App
