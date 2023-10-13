import axios from "axios";

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

function Setup() {
  const submitForm = (e) => {
    e.preventDefault();
    
    const days = e.target.select.value;
    const primaryLifts = [];
    const auxiliaryLifts = [];

    for (let i = 0; i < 4; i++) {
      const prefix = 'pri-' + i;
      const name = e.target[prefix + '-name'].value;
      const weight = e.target[prefix + '-weight'].value;
      primaryLifts.push({ name, weight });
    }
    for (let i = 0; i < 6; i++) {
      const prefix = 'aux-' + i;
      const name = e.target[prefix + '-name'].value;
      const weight = e.target[prefix + '-weight'].value;
      auxiliaryLifts.push({ name, weight });
    }

    axios.post(`users/${123}/new`, {
        params: {
          days,
          primaryLifts,
          auxiliaryLifts
        }
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <form onSubmit={submitForm}>
      <div className="my-3">
          <a>lift </a>
          {/* make selected reflect current */}
          <select required name="select" className="select select-bordered w-full max-w-xs">
            <option disabled selected></option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
          </select>
          <a> times per week</a>
      </div>

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
      
      <div className="join justify-center">
        <button className="btn btn-error join-item">cancel</button>
        <button className="btn btn-success join-item" type="submit">done</button>
      </div>
      {/* change training max calc, intensity, or rep structure */}
    </form>
  );
}

export default Setup;
