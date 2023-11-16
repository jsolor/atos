import { child, get, ref, update } from 'firebase/database';
import { multipliers } from '../data/workout.json';
import { useEffect, useState } from 'react';
import { getPotentialLifts, updateWeight, roundWeight } from '../routine';

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

function Lift({ name, weight, roundBy, reps, lastSet, lastSetActual, category, week, day, format, db, uid }) {
  const [lastSetPlaceholder, setLastSetPlaceholder] = useState(null);
  const [roundedWeight, setRoundedWeight] = useState(null);

  useEffect(() => {
    if (lastSetActual ?? false) {
      setLastSetPlaceholder(lastSetActual);
    } else {
      setLastSetPlaceholder(lastSet);
    }
  }, [lastSet, lastSetActual]);

  useEffect(() => {
    setRoundedWeight(roundWeight(weight, roundBy));
  }, [weight, roundBy]);

  const saveProgress = (val) => {
    const delta = val - lastSet;
    let m = 2;
  
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
  
    const multiplier = multipliers[m];
    
    if (multiplier !== 1) {
      const dbRef = ref(db);
      const potentialLifts = getPotentialLifts(day, category, format + 'x');
      const updates = {};
      const altCategory = category + 'Lifts';

      get(child(dbRef, `users/${uid}/lifts/${category}`))
        .then((snapshot) => snapshot.val())
        .then((lifts) => {
          for (const l of potentialLifts) {
            if (lifts[l].name === name) {
              const updatedTM = lifts[l].weight * multiplier;
              updates[`/users/${uid}/routine/${week}/${altCategory}/${l}/lastSetActual`] = val;
              updates[`/users/${uid}/lifts/${category}/${l}/weight`] = updatedTM;
              
              for (let i = week + 1; i < 19; i++) {
                const updatedWeight = updateWeight(category, i, updatedTM);
                updates[`/users/${uid}/routine/${i}/${altCategory}/${l}/weight`] = updatedWeight;
              }

              return updates;
            }
          }
        })
        .then((updates) => {
          update(dbRef, updates)
        })
        .then(() => console.log('updated successfully'))
        .catch((error) => console.log(error));
    } 
  };

  const debouncedSaveProgress = debounce(saveProgress, 1500);
  const handleChange = (e) => {
    debouncedSaveProgress(Number(e.target.value));
  };

  return (
    <div className="mb-6">
      <div>
        <div className="flex justify-between mb-1">
          <p className="text-xl italic">{name}</p>
          <p className="text-xl">{roundedWeight}</p>
        </div>
        <div>
          <div className="flex justify-center space-x-1">
            {([0, 1, 2, 3]).map(() => <SetButton reps={reps} />)}
            <input type="number" className="input w-20" placeholder={lastSetPlaceholder} onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lift;
