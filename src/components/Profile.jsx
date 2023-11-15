import { child, get, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";

function LiftRow({ name, weight }) {
  return (
    <tr>
      <th></th>
      <td>{name}</td>
      <td>{weight}</td>
    </tr>
  )
}

function Profile({ db, uid }) {
  const [primaryTab, setPrimaryTab] = useState('tab');
  const [auxiliaryTab, setAuxiliaryTab] = useState('tab');
  const [primaryLifts, setPrimaryLifts] = useState([]);
  const [auxiliaryLifts, setAuxiliaryLifts] = useState([]);

  const setActiveTab = (e) => {
    e.preventDefault();
    
    if (e.target.name === 'primary-tab') {
      setPrimaryTab('tab tab-active');
      setAuxiliaryTab('tab');
    } else {
      setPrimaryTab('tab');
      setAuxiliaryTab('tab tab-active');
    }
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
          <a className={primaryTab} name="primary-tab" onClick={setActiveTab}>Primary</a>
          <a className={auxiliaryTab} name="auxiliary-tab" onClick={setActiveTab}>Auxiliary</a>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Estimated Training Max</th>
              </tr>
            </thead>
            <tbody>
              {primaryTab !== 'tab' && (primaryLifts).map(({ name, weight }) => <LiftRow name={name} weight={weight} />)}
              {primaryTab === 'tab' && (auxiliaryLifts).map(({ name, weight }) => <LiftRow name={name} weight={weight} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Profile;
