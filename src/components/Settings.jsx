import { ref, remove } from 'firebase/database';
import { useState } from 'react';
import Setup from './Setup';

function Settings({ db, uid }) {
  const [routineSetup, setRoutineSetup] = useState(false);
  const newStyle = {
    color: 'white',
    backgroundColor: '#005eff'
  };
  const deleteStyle = {
    color: 'white',
    backgroundColor: '#cb0909'
  };

  const deleteRoutine = () => {
    remove(ref(db, `/users/${uid}/routine`))
      .then(() => console.log('successfully deleted routine'))
      .catch((error) => console.log(error));
  };

  return (
    <div>
      {!routineSetup && (<div>
        <button className="btn" style={deleteStyle} onClick={()=>document.getElementById('my_modal_2').showModal()}>delete routine</button>
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Are you sure?</h3>
            <form method="dialog">
            <button className="btn" onClick={deleteRoutine}>yes</button>
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
          </div>
        </dialog>
        <button className="btn" style={newStyle} onClick={() => setRoutineSetup(true)}>new routine</button>
      </div>) ||
      routineSetup && <Setup db={db} uid={uid} setRoutineSetup={setRoutineSetup} />}
    </div>
  );
}

export default Settings;
