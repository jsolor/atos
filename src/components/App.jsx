import './App.css'
import NavBar from './NavBar';
import LogIn from './LogIn';
import Lifts from './Lifts';
import Profile from './Profile';
import Settings from './Settings';
import { useCallback, useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import debounce from '../debounce';

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
  const [week, setWeek] = useState(null);
  const [day, setDay] = useState(null);

  useEffect(() => {
    if (!user) setUid(null);
    if (user && 'uid' in user) setUid(user.uid);
  }, [user]);

const savePos = (w, d) => {
    const dbRef = ref(db);

    const updates = {};
    updates[`/users/${uid}/pos/`] = { week: w, day: d };
    
    update(dbRef, updates)
      .then(() => console.log('updated successfully'))
      .catch((error) => console.log(error));
  };

  const debouncedSavePos = debounce(savePos, 4000);

  const setWeekDay = useCallback((w, d = day) => {
    setWeek(w);
    setDay(d);

    debouncedSavePos(w, d);
  }, []);

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
