import { useEffect, useState } from 'react';
import { child, get, ref } from 'firebase/database';
import { formatWeek } from '../routine';
import Lift from './Lift';

function Lifts({ db, uid, week, day, setWeekDay }) {
  const [data, setData] = useState(null);
  const [formattedRoutine, setFormattedRoutine] = useState([]);
  const [format, setFormat] = useState(3);
  const [primaryLifts, setPrimaryLifts] = useState([]);
  const [auxiliaryLifts, setAuxiliaryLifts] = useState([]);
  const [roundBy, setRoundBy] = useState(5);
  
  useEffect(() => {
    if (uid) {
      const dbRef = ref(db);
      get(child(dbRef, `users/${uid}`))
        .then((snapshot) => {
          setData(snapshot.val());
        })
        .catch((error) => console.log(error));
    }
  }, [db, uid]);

  useEffect(() => {
    if (data) {
      const routine = [];

      for (let i = 0; i < data.routine.length; i++) {
        routine.push(formatWeek(data.days + 'x', data.routine[i]));
      }

      setFormat(data.days);
      setFormattedRoutine(routine);
      setRoundBy(data.roundBy);
      setWeekDay(data.pos.week, data.pos.day);
    }
  }, [data]);

  useEffect(() => {
    if ((week !== null) && (day !== null)) {
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
    }
  }, [formattedRoutine, week, day]);

  const changeWeek = (change) => {
    setWeekDay(Math.max(0, Math.min(week + change, 18)));
  };

  const changeDay = (change) => {
    if (day + change >= format) {
      setWeekDay(week + 1, 0);
    } else if (day + change < 0) {
      if (day === 0 && week === 0) {
        setWeekDay(week, 0);
      } else {
        setWeekDay(week - 1, format - 1);
      }
    } else {
      setWeekDay(week, day + change);
    }
  };

  const jumpTo = (e) => {
    const w = Number(e.target.ariaRowIndex);
    const d = Number(e.target.ariaColIndex);

    setWeekDay(w, d);
  };

  return (
    <div className="overflow-x-auto">
      {primaryLifts.length > 0 && (<div className="divider">primary</div>)}
      {primaryLifts.map(({ name, reps, weight, lastSet, lastSetActual }) => 
        <Lift 
          name={name}
          reps={reps}
          weight={weight}
          roundBy={roundBy}
          lastSet={lastSet}
          lastSetActual={lastSetActual}
          category="primary"
          week={week}
          day={day}
          format={format}
          db={db}
          uid={uid}
        />
      )}
      {auxiliaryLifts.length > 0 && (<div className="divider">auxiliary</div>)}
      {auxiliaryLifts.map(({ name, reps, weight, lastSet, lastSetActual }) => 
        <Lift 
          name={name}
          reps={reps}
          weight={weight}
          roundBy={roundBy}
          lastSet={lastSet}
          lastSetActual={lastSetActual}
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
        <button className="btn" onClick={()=>document.getElementById('jump_modal').showModal()}>jump</button>
        <dialog id="jump_modal" className="modal w-auto">
          <div className="modal-box">
            <form method="dialog">
              <div className="mt-4">
                {((Array.from({ length: 19 }, (_, index) => index))).map((i) => (
                  <div className="flex join mb-1">
                    <button className="btn btn-disabled mr-1 join-item flex-1">W{i}</button>
                    {((Array.from({ length: format }, (_, index) => index))).map((j) => 
                      (i === week && j === day) 
                        ? <button className="btn btn-active join-item flex-1" onClick={jumpTo} aria-rowindex={i} aria-colindex={j}>{j}</button> 
                        : <button className="btn join-item flex-1" onClick={jumpTo} aria-rowindex={i} aria-colindex={j}>{j}</button>
                      )}
                  </div>)
                )}
              </div>
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
          </div>
        </dialog>
        <div>
          <button className="btn" onClick={() => changeDay(1)}>{'>'}</button>
          <button className="btn" onClick={() => changeWeek(1)}>{'>>'}</button>
        </div>
      </div>
    </div>
  );
}

export default Lifts;
