import NavBar from './NavBar';
import Lifts from './Lifts';
import Profile from './Profile';
import Settings from './Settings';
import { useState, useEffect } from 'react';
import './App.css'

function App() {
  const [pageBody, setPageBody] = useState('Lifts');

  useEffect(() => {
    console.log(pageBody);
  }, [pageBody]);

  return (
    <>
      <NavBar setPageBody={setPageBody} />

      {
        (pageBody === 'Lifts' && <Lifts />) ||
        (pageBody === 'Profile' && <Profile />) ||
        (pageBody === 'Settings' && <Settings />)
      }
    </>
  );
}

export default App
