import { child, get, ref, update } from 'firebase/database';
import { multipliers } from '../data/workout.json';
import { useEffect, useState } from 'react';
import { getPotentialLifts, updateWeight, roundWeight } from '../routine';
import debounce from '../debounce';


const saveSetsCount = (db, path, count, refresh) => {
  const dbRef = ref(db);
  
  const updates = {};
  updates[path] = count;
  
  console.log(count);  
  update(dbRef, updates)
    .then(() => console.log('updated sets completed'))
    .then(() => refresh())
    .catch((error) => console.log(error));
};

const debouncedSaveSetsCount = debounce(saveSetsCount, 2000);


function SetButton({ completed, reps, count, setCount, updateSetsCompleted }) {
  const [isPressed, setPressed] = useState(completed);

  useEffect(() => {
    setPressed(completed);
  }, [completed]);

  const onClick = () => {
    setPressed(!isPressed);
    const updatedCount = !isPressed ? count + 1 : count - 1;
    !isPressed ? setCount(count + 1) : setCount(count - 1);
    updateSetsCompleted(updatedCount);
  }

  return (
    <button className={`btn ${isPressed ? 'btn-success' : 'btn-active'} flex-1`} onClick={onClick}>
      {reps}
    </button>
  )
}

function Lift({ index, name, weight, roundBy, sets = 4, setsCompleted, reps, lastSet, lastSetActual, category, week, day, format, db, uid, refresh }) {
  const [lastSetPlaceholder, setLastSetPlaceholder] = useState(null);
  const [roundedWeight, setRoundedWeight] = useState(null);
  const [isWrapped, setIsWrapped] = useState(null);
  const [count, setCount] = useState(setsCompleted);

  const endPoint = category === 'accessory' ? `/${day}/${index}/setsCompleted` : `Lifts/${index}/setsCompleted`
  const path = `/users/${uid}/routine/${week}/${category}` + endPoint;
  
  const checkIfWrapped = () => {
    const setButtons = document.getElementById(category + '-' + name + '-set-buttons');
    const lastSetInputs = document.getElementById(category + '-' + name + '-input');

    Math.round(setButtons.offsetTop) === Math.round(lastSetInputs.offsetTop) ? setIsWrapped(false) : setIsWrapped(true);
  };

  const updateSetsCompleted = (updatedCount) => {
    debouncedSaveSetsCount(db, path, updatedCount, refresh);
  };

  useEffect(() => {
    if (category !== 'accessory') {
      window.addEventListener('resize', checkIfWrapped);

      return () => {
        window.removeEventListener('resize', checkIfWrapped);
      }
    }
  }, []);

  useEffect(() => {
    if (lastSetActual ?? false) {
      setLastSetPlaceholder(lastSetActual);
    } else {
      setLastSetPlaceholder(lastSet);
    }
  }, [lastSet, lastSetActual]);

  useEffect(() => {
    roundBy ? setRoundedWeight(roundWeight(weight, roundBy)) : setRoundedWeight(weight);
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

      get(child(dbRef, `users/${uid}/lifts/${category}`))
        .then((snapshot) => snapshot.val())
        .then((lifts) => {
          for (const l of potentialLifts) {
            if (lifts[l].name === name) {
              const updatedTM = lifts[l].weight * multiplier;
              updates[`/users/${uid}/routine/${week}/${category}Lifts/${l}/lastSetActual`] = val;
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
    <div className="mb-8 min-w-min">
      <div className="flex justify-between mb-1">
        <p className="text-xl italic">{name}</p>
        <p className="text-xl">{roundedWeight}</p>
      </div>
      <div className="flex flex-wrap justify-between max-w-full">
        <div className="flex flex-1 space-x-1 mt-3" id={category + '-' + name + '-set-buttons'}>
          {((Array.from({ length: sets }, (_, index) => index))).map((i) => 
            (<SetButton completed={i < setsCompleted} reps={reps} count={count} setCount={setCount} updateSetsCompleted={updateSetsCompleted} />)
          )}
        </div>
        {category !== 'accessory' && <input type="number" className={`input input-bordered flex-1 mt-3 text-end ${isWrapped ? '' : 'ml-2'}`} id={category + '-' + name + '-input'} placeholder={lastSetPlaceholder} onChange={handleChange} />}
      </div>
    </div>
  );
}

export default Lift;
