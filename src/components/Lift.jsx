import { child, get, ref, update } from 'firebase/database';
import { multipliers } from '../data/workout.json';
import { useEffect, useState } from 'react';
import { getPotentialLifts, updateWeight, roundWeight } from '../routine';
import debounce from '../debounce';

function SetButton({ reps }) {
  const [isPressed, setPressed] = useState(false);

  const onClick = () => {
    setPressed(!isPressed);
  }

  return (
    <button className={`btn ${isPressed ? 'btn-success' : 'btn-active'} w-12 flex-1`} onClick={onClick}>
      {reps}
    </button>
  )
}

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
    <div className="mb-8 mx-auto w-10/12 lg:w-9/12 min-w-min">
      <div className="flex justify-between mb-1">
        <p className="text-xl italic">{name}</p>
        <p className="text-xl">{roundedWeight}</p>
      </div>
      <div className="flex justify-between max-w-full flex-wrap sm:flex-nowrap">
        <div className="flex flex-grow space-x-1 mt-3 sm:mr-2">
          {([0, 1, 2, 3]).map(() => <SetButton reps={reps} />)}
        </div>
        <input type="number" className="flex-grow input input-bordered mt-3" placeholder={lastSetPlaceholder} onChange={handleChange} />
      </div>
    </div>
  );
}

export default Lift;
