import NavBar from './NavBar';
import LogIn from './LogIn';
import Lifts from './Lifts';
import Profile from './Profile';
import Settings from './Settings';
import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { child, get, getDatabase, ref, update } from "firebase/database";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import debounce from '../debounce';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  databaseURL: import.meta.env.VITE_FIREBASE_URL
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();
const dbRef = ref(db);

(async () => {
  await setPersistence(auth, browserLocalPersistence);
})();

function savePos (w, d, uid) {
  const updates = {};
  updates[`/users/${uid}/week/`] = w;
  updates[`/users/${uid}/day/`] = d;

  update(dbRef, updates)
    .then(() => console.log('updated w,d'))
    .catch((error) => console.log(error));
}

const debouncedSavePos = debounce(savePos, 3000);

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

  useEffect(() => {
    if (uid) {
      get(child(dbRef, `users/${uid}`))
        .then((snapshot) => {
          const userData = snapshot.val();

          for (const key in userData) {
            localStorage.setItem(key, JSON.stringify(userData[key]));
          }
          
          setWeek(userData.week);
          setDay(userData.day);
        })
        .then(() => console.log('data loaded'))
        .catch((error) => console.log(error));
    }
  }, [uid]);

  const setWeekDay = (w, d = day) => {
    setWeek(w);
    setDay(d);

    localStorage.setItem('week', w);
    localStorage.setItem('day', d);

    debouncedSavePos(w, d, uid);
  };

  return (
    <div className="w-screen h-screen bg-primary">
      {user && (<NavBar auth={auth} setUser={setUser} pageBody={pageBody} setPageBody={setPageBody} week={week} day={day} />)}

      <div className="bg-primary">
        {
          (pageBody === 'LogIn' && <LogIn auth={auth} setUser={setUser} setPageBody={setPageBody} />) ||
          (pageBody === 'Lifts' && <Lifts dbRef={dbRef} uid={uid} week={week} day={day} setWeekDay={setWeekDay} redirect={() => setPageBody('Profile')} />) ||
          (pageBody === 'Profile' && <Profile dbRef={dbRef} uid={uid} />) ||
          (pageBody === 'Settings' && <Settings db={db} uid={uid} redirect={() => setPageBody('Lifts')} />)
        }
      </div>
    </div>
  );
}

export default App
