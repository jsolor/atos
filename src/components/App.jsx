import NavBar from './NavBar';
import Lifts from './Lifts';
import Profile from './Profile';
import Settings from './Settings';
import { useState } from 'react';
import './App.css'

function App() {
  const [pageBody, setPageBody] = useState('Lifts');

  return (
    <>
      <NavBar setPageBody={setPageBody} />
    </>
  );
}

export default App
