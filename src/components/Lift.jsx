import { child, get, ref, update } from 'firebase/database';
import { multipliers } from '../data/workout.json';
import { useState } from 'react';
import { updateWeight } from '../routine';

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

const debounce = (callback, wait) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => { 
      callback.apply(this, args)
    }, wait);
  };
};

function Lift({ name, weight, reps, lastSet, category, week, db, uid }) {
  const saveProgress = (val) => {
    const delta = val - Number(lastSet);
    let m = 2; // delta === 0
  
    if (delta < 0) {
      if (delta === -1) {
        m = 1;
      } else {
        m = 0;
      }
    } else if (delta > 0) {
      switch (delta) {
        case 1:
          m = 3;
          break;
        case 2:
          m = 4;
          break;
        case 3:
          m = 5;
          break;
        case 4:
          m = 6;
          break;
        default:
          m = 7;
      }
    }
  
    const multiplier = Number(multipliers[m]);
    
    if (multiplier !== 1) {
      const dbRef = ref(db);
      get(child(dbRef, `users/${uid}/lifts/${category}`))
        .then((snapshot) => snapshot.val())
        .then((lifts) => {
          for (let i = 0; i < lifts.length; i++) {
            if (lifts[i]['name'] === name) {
              const updatedTM = Number(lifts[i].weight) * multiplier;
              const updates = {};
              updates[`/users/${uid}/lifts/${category}/${i}/weight`] = updatedTM;
              const altCategory = category === 'primary' ? 'primaryLifts' : 'auxiliaryLifts';
              for (let j = week + 1; j < 19; j++) {
                const updatedWeight = updateWeight(category, j, updatedTM);
                updates[`/users/${uid}/routine/${j}/${altCategory}/${i}/weight`] = updatedWeight;
              }
              update(dbRef, updates)
                .then(() => console.log('updated'))
                .catch((error) => console.log(error));
            }
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const debouncedSaveProgress = debounce(saveProgress, 1500);
  const handleChange = (e) => {
    debouncedSaveProgress(e.target.value);
  }

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
            <input type="number" className="input w-20" placeholder={lastSet} onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lift;
