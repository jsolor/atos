import { child, get, ref, update } from 'firebase/database';
import { multipliers } from '../data/workout.json';
import { useEffect, useState } from 'react';
import { updateWeight, roundWeight } from '../routine';
import debounce from '../debounce';

function SetButton({ reps, count, setCount, category, index, buttonIndex, updateSetsCompleted }) {
  const [completed, setCompleted] = useState(false);

  const onClick = () => {
    const newCount = buttonIndex + 1;
    setCount(newCount);
    updateSetsCompleted(category, index, newCount);
  }

  useEffect(() => {
    setCompleted(buttonIndex < count);
  }, [buttonIndex, count]);

  return (
    <button className={`btn ${completed ? 'btn-success' : 'btn-active bg-accent'} flex-1`} onClick={onClick}>
      {reps}
    </button>
  );
}

function Lift({ index, name, weight, roundBy, sets = 4, setsCompleted, updateSetsCompleted, reps, lastSet, lastSetActual, updateLastSetActual, category, week, day, format, db, uid }) {
  const [lastSetPlaceholder, setLastSetPlaceholder] = useState(null);
  const [roundedWeight, setRoundedWeight] = useState(null);
  const [isWrapped, setIsWrapped] = useState(null);
  const [count, setCount] = useState(setsCompleted);
  const [lastSetStyles, setLastSetStyles] = useState(null);
  
  const checkIfWrapped = () => {
    const setButtons = document.getElementById(category + '-' + name + '-set-buttons');
    const lastSetInputs = document.getElementById(category + '-' + name + '-input');

    Math.round(setButtons.offsetTop) === Math.round(lastSetInputs.offsetTop) ? setIsWrapped(false) : setIsWrapped(true);
  };

  useEffect(() => {
    if (category !== 'accessory') {
      checkIfWrapped();
      window.addEventListener('resize', checkIfWrapped);

      return () => {
        window.removeEventListener('resize', checkIfWrapped);
      }
    }
  }, []);

  useEffect(() => {
    setCount(setsCompleted);
  }, [setsCompleted]);

  useEffect(() => {
    if (lastSetActual ?? false) {
      setLastSetPlaceholder(lastSetActual);
      setLastSetStyles({
        'borderColor': 'var(--text-primary)'
      });
    } else {
      setLastSetPlaceholder(lastSet);
      setLastSetStyles(null);
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
      const updates = {};

      get(child(dbRef, `users/${uid}/lifts/${category}`))
        .then((snapshot) => snapshot.val())
        .then((lifts) => {
          const updatedTM = lifts[index].weight * multiplier;
          updates[`/users/${uid}/routine/${week}/${category}/${index}/lastSetActual`] = val;
          updates[`/users/${uid}/lifts/${category}/${index}/weight`] = updatedTM;
          
          for (let i = week + 1; i < 19; i++) {
            const updatedWeight = updateWeight(category, i, updatedTM);
            updates[`/users/${uid}/routine/${i}/${category}Lifts/${index}/weight`] = updatedWeight;
          }

          return updates;
        })
        .then((updates) => {
          update(dbRef, updates)
        })
        .then(() => console.log('updated successfully'))
        .catch((error) => console.log(error));
    }
    updateLastSetActual(category, index, val);
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
            <SetButton
              key={week + day + i + '-' + category + '-' + name + '-set-button'}
              reps={reps} 
              count={count} 
              setCount={setCount} 
              category={category} 
              index={index} 
              buttonIndex={i} 
              updateSetsCompleted={updateSetsCompleted} 
            />)
          }
        </div>
        {category !== 'accessory' && <input type="number" className={`input input-bordered flex-1 mt-3 text-end ${isWrapped ? '' : 'ml-2'}`} id={category + '-' + name + '-input'} placeholder={lastSetPlaceholder} onChange={handleChange} style={lastSetStyles} />}
      </div>
    </div>
  );
}

export default Lift;
