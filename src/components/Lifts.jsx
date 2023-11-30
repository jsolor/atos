import { useEffect, useState } from 'react';
import { child, get, ref, update } from 'firebase/database';
import { formatWeek, getIndices } from '../routine';
import Lift from './Lift';

function JumpButton({ week, day, i, j, jumpTo }) {
  const isCurrentDay = week === i && day === j;
  const buttonClasses = `btn ${isCurrentDay ? 'btn-active' : ''} join-item flex-1`;
  return (
    <button 
      className={buttonClasses}
      onClick={jumpTo}
      aria-rowindex={i}
      aria-colindex={j}
    >
      {j}
    </button>
  );
}

function Lifts({ db, uid, week, day, setWeekDay }) {
  const [data, setData] = useState(null);
  const [formattedRoutine, setFormattedRoutine] = useState([]);
  const [format, setFormat] = useState(3);
  const [roundBy, setRoundBy] = useState(5);
  const [primaryLifts, setPrimaryLifts] = useState([]);
  const [auxiliaryLifts, setAuxiliaryLifts] = useState([]);
  const [accessoryLifts, setAccessoryLifts] = useState([]);
  const [addAccessoryLift, setAddAccessoryLift] = useState(false);
  const [primaryIndices, setPrimaryIndices] = useState([]);
  const [auxiliaryIndices, setAuxiliaryIndices] = useState([]);

  useEffect(() => {
    if (uid) {
      const dbRef = ref(db);
      get(child(dbRef, `users/${uid}`))
        .then((snapshot) => {
          setData(snapshot.val());
        })
        .then(() => console.log('data refreshed'))
        .catch((error) => console.log(error));
    }
  }, [db, uid]);

  useEffect(() => {
    if (data && 'routine' in data) {
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
          setPrimaryIndices(getIndices(format + 'x', day, 'primary'))
        } else {
          setPrimaryLifts([]);
        }9
        if ('auxiliary' in formattedRoutine[week][day]) {
          setAuxiliaryLifts(formattedRoutine[week][day].auxiliary);
          setAuxiliaryIndices(getIndices(format + 'x', day, 'auxiliary'));
        } else {
          setAuxiliaryLifts([]);
        }
        if ('accessory' in data['routine'][week] && day in data['routine'][week]['accessory']) {
          setAccessoryLifts(data['routine'][week]['accessory'][day]);
        } else setAccessoryLifts([]);
      }
    }
  }, [formattedRoutine, week, day]);

  const cancelAccessoryLift = (e) => {
    e.preventDefault();

    setAddAccessoryLift(false);
  };

  const submitAccessoryLift = (e) => {
    e.preventDefault();

    const accessoryName = e.target['acc-name'].value;
    const accessoryWeight = Number(e.target['acc-weight'].value);
    const accessorySets = Number(e.target['acc-sets'].value);
    const accessoryReps = Number(e.target['acc-reps'].value);
    const accessory = {
      name: accessoryName,
      weight: accessoryWeight,
      sets: accessorySets,
      setsCompleted: 0,
      reps: accessoryReps
    };
    
    setData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const accessoryCheck = newData.routine[week].accessory;
      
      if (accessoryCheck) {
        newData.routine[week].accessory[day] = [...accessoryCheck[day], accessory];
      } else {
        const daysAccesories = {};
        daysAccesories[day] = [accessory];
        newData.routine[week].accessory = daysAccesories;
      }

      const dbRef = ref(db);
      const updates = {};

      updates[`/users/${uid}/routine/${week}/accessory/${day}`] = newData.routine[week].accessory[day];
      updates[`/users/${uid}/lifts/accessory/${accessoryName}`] = true;

      update(dbRef, updates)
        .then(() => console.log('updated successfully'))
        .catch((error) => console.log(error));
      
      return newData;
    });
    
    setAddAccessoryLift(false);
  };

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

  const updateSetsCompleted = (category, index, count) => {
    const endPoint = category === 'accessory' ? `/${day}/${index}/setsCompleted` : `/${index}/setsCompleted`;
    const path = `/users/${uid}/routine/${week}/${category}` + endPoint;

    const dbRef = ref(db);
  
    const updates = {};
    updates[path] = count;
    
    update(dbRef, updates)
      .then(() => console.log('updated sets completed'))
      .then(() => setData((oldData) => {
        const newData = { ...oldData };
        
        if (category === 'accessory' ) newData.routine[week][category][day][index]['setsCompleted'] = count;
        else newData.routine[week][category][index]['setsCompleted'] = count;

        return newData;
      }))
      .catch((error) => console.log(error));
  };

  const updateLastSetActual = (category, index, val) => {
    setData((oldData) => {
      const newData = JSON.parse(JSON.stringify(oldData));
      newData.routine[week][category][index]['lastSetActual'] = val;

      return newData;
    });
  };

  return (
    <div className="w-10/12 lg:w-9/12 mx-auto">
      {primaryLifts.length > 0 && (<div className="divider">primary</div>)}
      {primaryLifts.map(({ name, weight, reps, setsCompleted, lastSet, lastSetActual }, index) => 
        <Lift 
          key={index + '-primary-' + name + '-' + week + '-' + day}
          index={primaryIndices[index]}
          name={name}
          weight={weight}
          roundBy={roundBy}
          reps={reps}
          setsCompleted={setsCompleted}
          updateSetsCompleted={updateSetsCompleted}
          lastSet={lastSet}
          lastSetActual={lastSetActual}
          updateLastSetActual={updateLastSetActual}
          category="primary"
          week={week}
          day={day}
          format={format}
          db={db}
          uid={uid}
        />
      )}
      {auxiliaryLifts.length > 0 && (<div className="divider">auxiliary</div>)}
      {auxiliaryLifts.map(({ name, weight, reps, setsCompleted, lastSet, lastSetActual }, index) => 
        <Lift
          key={index + '-auxiliary-' + name + '-' + week + '-' + day}
          index={auxiliaryIndices[index]}
          name={name}
          weight={weight}
          roundBy={roundBy}
          reps={reps}
          setsCompleted={setsCompleted}
          updateSetsCompleted={updateSetsCompleted}
          lastSet={lastSet}
          lastSetActual={lastSetActual}
          updateLastSetActual={updateLastSetActual}
          category="auxiliary"
          week={week}
          day={day}
          format={format}
          db={db}
          uid={uid}
        />
      )}
      <div className="divider">accessory</div>
      {accessoryLifts.map(({ name, sets, setsCompleted, reps, weight }, index) => (
        <Lift
          key={index + '-accessory-' + name + '-' + week + '-' + day}
          index={index}
          name={name}
          weight={weight}
          sets={sets}
          setsCompleted={setsCompleted}
          updateSetsCompleted={updateSetsCompleted}
          reps={reps}
          category="accessory"
          week={week}
          day={day}
          db={db}
          uid={uid}
        />
      ))}
      {addAccessoryLift && (<form onSubmit={submitAccessoryLift}>
        <div className="flex justify-between w-full mb-2">
          <input className="flex-1 input text-xl w-2/4 mr-1" name="acc-name" type="text" placeholder="name" required />
          <input className="flex-1 input text-end text-xl w-2/4 ml-1" name="acc-weight" type="number" placeholder="weight" required />
        </div>
        <div className="flex justify-between w-full mb-2">
          <input className="flex-1 input text-lg w-2/4 mr-1" name="acc-sets" type="text" placeholder="sets" required />
          <input className="flex-1 input text-end text-lg w-2/4 ml-1" name="acc-reps" type="number" placeholder="reps" required />
        </div>
        <div className="flex flex-nowrap w-full space-x-1">
          <button className="btn flex-1" onClick={cancelAccessoryLift}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
              <path fill="currentColor" d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z" />
            </svg>
          </button>
          <button className="btn flex-1" type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
              <path fill="currentColor" d="m229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69L218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
            </svg>
          </button>
        </div>
      </form>)}
      {!addAccessoryLift && (<button className="btn btn-outline w-full border-accent" onClick={() => setAddAccessoryLift(!addAccessoryLift)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
          <path fill="currentColor" d="M224 128a8 8 0 0 1-8 8h-80v80a8 8 0 0 1-16 0v-80H40a8 8 0 0 1 0-16h80V40a8 8 0 0 1 16 0v80h80a8 8 0 0 1 8 8Z" />
        </svg>
      </button>)}
      <div className="pb-36"></div>
      <div className="flex flex-row flex-wrap justify-between fixed bottom-0 left-0 right-0 p-3 bg-primary">
        <div className="join xs:order-1">
          <button className="btn join-item bg-accent border-accent" onClick={() => changeWeek(-1)}>{'<<'}</button>
          <button className="btn join-item bg-accent border-accent" onClick={() => changeDay(-1)}>{'<'}</button>
        </div>
        <button className="btn -order-1 xs:order-2 mb-1 xs:mb-0 min-w-full xs:min-w-max bg-accent border-accent" onClick={()=>document.getElementById('jump_modal').showModal()}>jump</button>
        <dialog id="jump_modal" className="modal w-auto">
          <div className="modal-box">
            <form method="dialog">
              <div className="flex flex-wrap mt-4">
                {((Array.from({ length: 19 }, (_, index) => index))).map((i) => (
                  <div key={'jump-week-' + i} className="inline-flex flex-1 m-1 join join-vertical sm:join-horizontal">
                    <button className="btn btn-disabled sm:mr-1 join-item flex-1">W{i}</button>
                    {((Array.from({ length: format }, (_, index) => index))).map((j) => 
                      (<JumpButton key={'jump-' + j} week={week} day={day} i={i} j={j} jumpTo={jumpTo} />)
                    )}
                  </div>)
                )}
              </div>
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
          </div>
        </dialog>
        <div className="join xs:order-3">
          <button className="btn join-item bg-accent border-accent" onClick={() => changeDay(1)}>{'>'}</button>
          <button className="btn join-item bg-accent border-accent" onClick={() => changeWeek(1)}>{'>>'}</button>
        </div>
      </div>
    </div>
  );
}

export default Lifts;
