import { ref, remove } from 'firebase/database';
import { useState } from 'react';
import Setup from './Setup';

function Settings({ db, uid, redirect }) {
  const [routineSetup, setRoutineSetup] = useState(false);

  const deleteRoutine = () => {
    remove(ref(db, `/users/${uid}/routine`))
      .then(() => console.log('successfully deleted routine'))
      .then(() => localStorage.removeItem('routine'))
      .catch((error) => console.log(error));
  };

  return (
    <div className="w-9/12 sm:w-8/12 mx-auto">
      {!routineSetup && (<div>
        <ul className="menu bg-base-200 w-full rounded-box">
          <li className="menu-title">Routine</li>
          <li onClick={() => setRoutineSetup(true)}><a>New</a></li>
          <li onClick={()=>document.getElementById('delete_modal').showModal()}><a>Delete</a></li>
        </ul>
        <dialog id="delete_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Are you sure?</h3>
            <form method="dialog" className="flex justify-end">
              <button className="btn" onClick={deleteRoutine}>yes</button>
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
          </div>
        </dialog>
      </div>) ||
      routineSetup && <Setup db={db} uid={uid} setRoutineSetup={setRoutineSetup} redirect={redirect} />}
    </div>
  );
}

export default Settings;
