import { child, get, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";

function LiftRow({ name, weight }) {
  return (
    <tr>
      <td>{name}</td>
      <td>{weight}</td>
    </tr>
  )
}

function Profile({ db, uid }) {
  const [primaryActive, setPrimaryActive] = useState(true);
  const [primaryLifts, setPrimaryLifts] = useState([]);
  const [auxiliaryLifts, setAuxiliaryLifts] = useState([]);

  const setActiveTab = () => {
    setPrimaryActive(!primaryActive);
  };

  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${uid}/lifts`))
      .then((snapshot) => snapshot.val())
      .then(({ primary, auxiliary }) => {
        setPrimaryLifts(primary);
        setAuxiliaryLifts(auxiliary);
      })
      .catch((error) => console.log(error));
  }, [db, uid]);
  
  return (
    <div>
      <div>
        <div className="tabs">
          <a className={`tab tab-lifted ${primaryActive ? 'tab-active' : ''}`} name="primary-tab" onClick={setActiveTab}>Primary</a>
          <a className={`tab tab-lifted ${primaryActive ? '' : 'tab-active'} `} name="auxiliary-tab" onClick={setActiveTab}>Auxiliary</a>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Name</th>
                <th>Estimated Training Max</th>
              </tr>
            </thead>
            <tbody>
              {primaryActive && (primaryLifts).map(({ name, weight }) => <LiftRow name={name} weight={weight} />)}
              {!primaryActive && (auxiliaryLifts).map(({ name, weight }) => <LiftRow name={name} weight={weight} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Profile;
