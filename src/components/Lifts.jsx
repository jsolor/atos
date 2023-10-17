import axios from 'axios';
import { useEffect, useState } from 'react';

import sampleRoutine from '../../sampleData/routine.json';

function SetButton({ reps }) {
  const [classes, setClasses] = useState('btn btn-active w-12');

  const onClick = (e) => {
    e.preventDefault();
    if (classes === 'btn btn-active w-12') {
      setClasses('btn btn-success w-12');
    } else {
      setClasses('btn btn-active w-12')
    }
  }

  return (
    <button className={classes} onClick={onClick}>
      {reps}
    </button>
  )
}

function Lift({ name, weight, reps, lastSet }) {
  return (
    <div className="mb-6">
      <div>
        <div className="flex justify-between mb-1">
          <p className="text-xl italic">{name}</p>
          <p className="text-xl">{weight}</p>
        </div>
        <div>
          <div className="flex justify-center space-x-1">
            {([0, 1, 2, 3]).map(() => <SetButton reps={reps} />)}
            <input type="number" className="input w-20" placeholder={lastSet} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Lifts({ userId }) {
  const [routine, setRoutine] = useState([]);
  const [format, setFormat] = useState(3);
  const [day, setDay] = useState(0);
  const [week, setWeek] = useState(0);
  const [primaryLifts, setPrimaryLifts] = useState([]);
  const [auxiliaryLifts, setAuxiliaryLifts] = useState([]);

  // useEffect(() => {
  //   axios.get(`/users/${userId}/routine`)
  //     .then(({ data }) => setRoutine(data))
  //     .catch((err) => console.log(err))
  // }, [userId]);

  useEffect(() => {
    setRoutine(sampleRoutine);
  }, []);
  
  useEffect(() => {
    if (routine.length) {
      if ('primary' in routine[week][day]) {
      setPrimaryLifts(routine[week][day].primary);
      } else {
        setPrimaryLifts([]);
      }
      if ('auxiliary' in routine[week][day]) {
        setAuxiliaryLifts(routine[week][day].auxiliary);
      } else {
        setAuxiliaryLifts([]);
      }
    }
  }, [routine, week, day]);

  useEffect(() => {
    console.log('day: ' + day);
  }, [day]);

  useEffect(() => {
    console.log('week: ' + week);
  }, [week]);

  const changeWeek = (change) => {
    if (week + change >= 18) {
      setWeek(18);
    } else if (week + change < 0) {
      setWeek(0);
    } else {
      setWeek(week + change);
    }
  };

  const changeDay = (change) => {
    if (day + change >= format) {
      setDay(0);
      changeWeek(1);
    } else if (day + change < 0) {
      if (day === 0 && week === 0) {
        setDay(0);
      } else {
        setDay(format - 1);
        changeWeek(-1);
      }
    } else {
      setDay(day + change);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="divider">primary</div> 
      {primaryLifts.map(({ name, reps, weight, lastSet }) => 
        <Lift name={name} reps={reps} weight={weight} lastSet={lastSet}/>
      )}
      <div className="divider">auxiliary</div> 
      {auxiliaryLifts.map(({ name, reps, weight, lastSet }) => 
        <Lift name={name} reps={reps} weight={weight} lastSet={lastSet}/>
      )}
      
      <div className="flex justify-between items-end fixed bottom-0 left-0 right-0 p-4">
        <div>
          <button className="btn" onClick={() => changeWeek(-1)}>{'<<'}</button>
          <button className="btn" onClick={() => changeDay(-1)}>{'<'}</button>
        </div>
        <div>
          <button className="btn" onClick={() => changeDay(1)}>{'>'}</button>
          <button className="btn" onClick={() => changeWeek(1)}>{'>>'}</button>
        </div>
      </div>
    </div>
  );
}

export default Lifts;
