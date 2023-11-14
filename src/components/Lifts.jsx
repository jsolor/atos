import { useEffect, useState } from 'react';
import { child, get, ref } from 'firebase/database';
import Lift from './Lift';
import { formatWeek } from '../routine';

function Lifts({ db, uid }) {
  const [data, setData] = useState(null);
  const [formattedRoutine, setFormattedRoutine] = useState([]);
  const [format, setFormat] = useState(3);
  const [day, setDay] = useState(0);
  const [week, setWeek] = useState(0);
  const [primaryLifts, setPrimaryLifts] = useState([]);
  const [auxiliaryLifts, setAuxiliaryLifts] = useState([]);
  
  useEffect(() => {
    const dbRef = ref(db);
    get(child(dbRef, `users/${uid}`))
      .then((snapshot) => {
        setData(snapshot.val());
      })
      .catch((error) => console.log(error));
  }, [db, uid]);

  useEffect(() => {
    if (data) {
      const routine = [];

      for (let i = 0; i < data.routine.length; i++) {
        routine.push(formatWeek(data.days + 'x', data.routine[i]));
      }

      setFormat(Number(data.days));
      setFormattedRoutine(routine);
    }
  }, [data]);

  useEffect(() => {
    if (formattedRoutine.length) {
      if ('primary' in formattedRoutine[week][day]) {
        setPrimaryLifts(formattedRoutine[week][day].primary);
      } else {
        setPrimaryLifts([]);
      }
      if ('auxiliary' in formattedRoutine[week][day]) {
        setAuxiliaryLifts(formattedRoutine[week][day].auxiliary);
      } else {
        setAuxiliaryLifts([]);
      }
    }
  }, [formattedRoutine, week, day]);

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
      <h1>W{week} D{day}</h1>
      <div className="divider">primary</div> 
      {primaryLifts.map(({ name, reps, weight, lastSet }) => 
        <Lift 
          name={name}
          reps={reps}
          weight={weight}
          lastSet={lastSet}
          category="primary"
          week={week}
          day={day}
          format={format}
          db={db}
          uid={uid}
        />
      )}
      <div className="divider">auxiliary</div> 
      {auxiliaryLifts.map(({ name, reps, weight, lastSet }) => 
        <Lift 
          name={name}
          reps={reps}
          weight={weight}
          lastSet={lastSet}
          category="auxiliary"
          week={week}
          day={day}
          format={format}
          db={db}
          uid={uid}
        />
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
