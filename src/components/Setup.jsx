function LiftEntry({ category, n }) {
  const nameID = category + '-' + n + '-name';
  const weightID = category + '-' + n + '-weight';

  return (
    <div>
      <label className="label">
        <span className="label-text">#{n}</span>
      </label>
      <input type="text" placeholder="lift name" name={nameID} className="input input-bordered w-full max-w-xs" />
      <input type="number" placeholder="training max" name={weightID} className="input input-bordered w-full max-w-xs" />
    </div>
  );
}

function Setup() {

  return (
    <form onSubmit={(e) => {e.preventDefault(); console.log(e)}}>
      <div className="my-3">
          <a>lift </a>
          {/* make selected reflect current */}
          <select className="select select-bordered w-full max-w-xs">
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
        {/* primary 1-4 auxiliary 1-6 */}
        {/* use old if old lift tm maybe*/}
        <div className="join-item">
          <h6>primary lifts</h6>
          {[1,2,3,4].map((i) => <LiftEntry category="pri" n={i}/>)}
        </div>

        <div className="join-item">
          <h6>auxiliary lifts</h6>
          {[1,2,3,4,5,6].map((i) => <LiftEntry category="aux" n={i}/>)}
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
