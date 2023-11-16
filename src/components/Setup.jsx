import { child, get, getDatabase, ref, set } from "firebase/database";
import { makeNewRoutine } from "../routine";
import { useState } from "react";

function LiftEntry({ category, n }) {
  const nameId = category + '-' + n + '-name';
  const weightId = category + '-' + n + '-weight';

  return (
    <div>
      <label className="label">
        <span className="label-text">#{n}</span>
      </label>
      <input type="text" placeholder="lift name" name={nameId} required className="input input-bordered w-full max-w-xs m-0.5" />
      <input type="number" placeholder="training max" name={weightId} required className="input input-bordered w-full max-w-xs m-0.5" />
    </div>
  );
}

function Setup({ db, uid, setRoutineSetup }) {
  const [daysPerWeek, setDaysPerWeek] = useState(null);
  const [roundBy, setRoundBy] = useState(null);
  const submitNewRoutineForm = (e) => {
    e.preventDefault();
    
    const primaryLifts = [];
    const auxiliaryLifts = [];

    for (let i = 0; i < 4; i++) {
      const prefix = 'pri-' + i;
      const name = e.target[prefix + '-name'].value;
      const weight = Number(e.target[prefix + '-weight'].value);
      primaryLifts.push({ name, weight });
    }
    for (let i = 0; i < 6; i++) {
      const prefix = 'aux-' + i;
      const name = e.target[prefix + '-name'].value;
      const weight = Number(e.target[prefix + '-weight'].value);
      auxiliaryLifts.push({ name, weight });
    }

    const routine = makeNewRoutine(primaryLifts, auxiliaryLifts);
    set(ref(db, `users/${uid}`), {
      days: daysPerWeek,
      routine,
      lifts: {
        primary: primaryLifts,
        auxiliary: auxiliaryLifts
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
    <div>
      <h1>new routine setup</h1>
      <div className="my-3" onChange={(e) => setDaysPerWeek(Number(e.target.value))}>
        <a>lift </a>
        <select required name="select" className="select select-bordered w-full max-w-xs">
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
        <select required name="select" className="select select-bordered w-full max-w-xs">
          <option disabled selected></option>
          <option>2.5</option>
          <option>5</option>
        </select>
        <a> lbs</a>
      </div>
      {(daysPerWeek && roundBy) && (<div>
        <form onSubmit={submitNewRoutineForm}>
          <div className="divider">enter lifts and training maxes</div> 
          <h5>choose primary and auxiliary lifts</h5>
          <div className="join flex justify-between">
            <div className="join-item">
              <h6>primary lifts</h6>
              {[0,1,2,3].map((i) => <LiftEntry category={'pri'} n={i}/>)}
            </div>

            <div className="join-item">
              <h6>auxiliary lifts</h6>
              {[0,1,2,3,4,5].map((i) => <LiftEntry category={'aux'} n={i}/>)}
            </div>
          </div>
          <div className="flex justify-between w-full">
            <button className="btn btn-error" onClick={() => setRoutineSetup(false)}>cancel</button>
            <button className="btn btn-success" type="submit">done</button>
          </div>
          <div className="divider">or</div> 
        </form>
        <button className="btn w-full" onClick={routineRefresh}>use current lifts and training maxes</button>
      </div>)}
    </div>
  );
}

export default Setup;
