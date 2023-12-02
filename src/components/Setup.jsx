import { child, get, getDatabase, ref, set } from "firebase/database";
import { makeNewRoutine } from "../routine";
import { useState } from "react";

function LiftEntry({ category, n }) {
  const nameId = category + '-' + n + '-name';
  const weightId = category + '-' + n + '-weight';
  
  return (
    <div className={`flex flex-1 flex-wrap ${category === 'pri' ? 'md:mr-2' : ''}`}>
      <input 
        type="text" 
        placeholder="name" 
        name={nameId} 
        className={`input input-bordered flex w-full mb-1 ${category === 'aux' ? 'text-end' : ''}`}
        required
      />
      <input type="number"
        placeholder="training max"
        name={weightId}
        className={`input input-bordered flex w-full mb-1 ${category === 'aux' ? 'text-end' : ''}`}
        required
      />
    </div>
  );
}

function LiftForm({ n }) {
  let a1;
  let a2;

  switch (n) {
    case 0:
      a1 = 0;
      a2 = 1;
      break;
    case 1:
      a1 = 2;
      a2 = 3;
      break;
    case 2:
      a1 = 4;
      break;
    case 3:
      a1 = 5;
      break;
    default:
      break;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row mb-5 justify-between">
        <div className="flex flex-wrap content-start">
          <a className="label w-full">primary</a>
          <LiftEntry category={'pri'} n={n} />
        </div>
        <div className="flex flex-wrap">
          <a className="label w-full justify-end">auxiliary</a>
          <div className="flex flex-col flex-1">
            <LiftEntry category={'aux'} n={a1} />
            {n <= 1 && <LiftEntry category={'aux'} n={a2} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Setup({ db, uid, setRoutineSetup, redirect }) {
  const [daysPerWeek, setDaysPerWeek] = useState(null);
  const [roundBy, setRoundBy] = useState(null);

  const submitNewRoutineForm = (e) => {
    e.preventDefault();
    
    const primary = [];
    const auxiliary = [];

    for (let i = 0; i < 4; i++) {
      const prefix = 'pri-' + i;
      const name = e.target[prefix + '-name'].value;
      const weight = Number(e.target[prefix + '-weight'].value);
      primary.push({ name, weight });
    }
    for (let i = 0; i < 6; i++) {
      const prefix = 'aux-' + i;
      const name = e.target[prefix + '-name'].value;
      const weight = Number(e.target[prefix + '-weight'].value);
      auxiliary.push({ name, weight });
    }

    const routine = makeNewRoutine(primary, auxiliary);
    const data = {
      format: daysPerWeek,
      roundBy,
      routine,
      week: 0,
      day: 0,
      lifts: {
        primary,
        auxiliary
      }
    };
    set(ref(db, `users/${uid}`), data)
      .then(() => console.log('new routine saved'))
      .then(() => {
        for (const key in data) {
          localStorage.setItem(key, JSON.stringify(data[key]));
        }
      })
      .then(() => redirect())
      .catch((error) => console.log(error));
  };

  const routineRefresh = () => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `/users/${uid}/lifts`))
      .then((snapshot) => snapshot.val())
      .then(({ primary, auxiliary }) => {
        const routine = makeNewRoutine(primary, auxiliary);
        const data = {
          format: daysPerWeek,
          roundBy,
          routine,
          week: 0,
          day: 0,
          lifts: {
            primary,
            auxiliary
          }
        };

        for (const key in data) {
          localStorage.setItem(key, JSON.stringify(data[key]));
        }

        return set(ref(db, `/users/${uid}`), data);
      })
      .then(() => console.log('new routine saved'))
      .then(() => redirect())
      .catch((error) => console.log(error));
  };

  return (
    <div className="mt-8">
      <h1 className="text-center text-xl">New Routine Setup</h1>
      <div className="my-3" onChange={(e) => setDaysPerWeek(Number(e.target.value))}>
        <a>lift </a>
        <select required name="select" className="select select-bordered">
          <option disabled selected></option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
        </select>
        <a> times per week</a>
      </div>
      <div className="my-3" onChange={(e) => setRoundBy(Number(e.target.value))}>
        <a>rounding by </a>
        <select required name="select" className="select select-bordered">
          <option disabled selected></option>
          <option>2.5</option>
          <option>5</option>
        </select>
        <a> pounds</a>
      </div>
      {(daysPerWeek && roundBy) && (<div>
        <form onSubmit={submitNewRoutineForm}>
          <div className="divider mb-12 flex-wrap justify-center text-sm xs:text-base">enter lifts & training maxes</div> 
          <div>
            {[0, 1, 2, 3].map((i) => (
              <LiftForm key={'LF-' + i} n={i} />
            ))}
          </div>
          <div className="flex justify-between w-full mt-4">
            <button className="btn btn-error" onClick={() => setRoutineSetup(false)}>cancel</button>
            <button className="btn btn-success" type="submit">done</button>
          </div>
          <div className="divider">or</div> 
        </form>
        <button className="btn btn-outline w-full mb-5" onClick={routineRefresh}>use current lifts and training maxes</button>
      </div>)}
    </div>
  );
}

export default Setup;
