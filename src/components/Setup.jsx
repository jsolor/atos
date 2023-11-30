import { child, get, getDatabase, ref, set } from "firebase/database";
import { makeNewRoutine } from "../routine";
import { useState } from "react";

function LiftEntry({ category, n }) {
  const nameId = category + '-' + n + '-name';
  const weightId = category + '-' + n + '-weight';
  
  return (
    <div className={`flex flex-1 flex-wrap ${category === 'pri' ? 'md:mr-2' : ''}`}>
      <input type="text" placeholder="name" name={nameId} required className="input input-bordered flex w-full mb-1" />
      <input type="number" placeholder="training max" name={weightId} required className="input input-bordered flex w-full mb-1" />
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
          <a className="label w-full">pri</a>
          <LiftEntry category={'pri'} n={n} />
        </div>
        <div className="flex flex-wrap">
          <a className="label w-full justify-end">aux</a>
          <div className="flex flex-col flex-1">
            <LiftEntry category={'aux'} n={a1} />
            {n <= 1 && <LiftEntry category={'aux'} n={a2} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Setup({ db, uid, setRoutineSetup }) {
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
    set(ref(db, `users/${uid}`), {
      days: daysPerWeek,
      roundBy,
      routine,
      pos: { 
        week: 0,
        day: 0
      },
      lifts: {
        primary,
        auxiliary
      }
    })
      .then(() => console.log('new routine saved'))
      .catch((error) => console.log(error));
  };

  const routineRefresh = () => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `/users/${uid}/lifts`))
      .then((snapshot) => snapshot.val())
      .then(({ primary, auxiliary }) => {
        const routine = makeNewRoutine(primary, auxiliary);
        return set(ref(db, `/users/${uid}`), {
          days: daysPerWeek,
          roundBy,
          routine,
          pos: {
            week: 0,
            day: 0
          },
          lifts: {
            primary,
            auxiliary
          }
        });
      })
      .then(() => console.log('new routine saved'))
      .catch((error) => console.log(error));
  };

  return (
    <div className="w-10/12 mx-auto">
      <h1 className="text-center text-xl">new routine setup</h1>
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
          <div className="divider">enter lifts and training maxes</div> 
          <div className="">
            {[0, 1, 2, 3].map((i) => (
              <LiftForm n={i} />
            ))}
          </div>
          <div className="flex justify-between w-full mt-4">
            <button className="btn btn-error" onClick={() => setRoutineSetup(false)}>cancel</button>
            <button className="btn btn-success" type="submit">done</button>
          </div>
          <div className="divider">or</div> 
        </form>
        <button className="btn w-full mb-5" onClick={routineRefresh}>use current lifts and training maxes</button>
      </div>)}
    </div>
  );
}

export default Setup;
