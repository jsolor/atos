import { useEffect, useState } from 'react';

import sampleTMs from '../../sampleData/trainingMaxes.json';
import sampleSchedules from '../../sampleData/schedules.json';
import sampleReps from '../../sampleData/reps.json';
import sampleRecords from '../../sampleData/records.json';

function Lift({ name, weight, reps, target, lastSet }) {
  return (
    <tr>
      <td></td>
      <td>{name}</td>
      <td>{weight}</td>
      <td>{reps}</td>
      <td>{target}</td>
      <td>
        <input type="checkbox" className="rounded-none"/>
        <input type="checkbox" className="rounded-none"/>
        <input type="checkbox" className="rounded-none"/>
        <input type="checkbox" className="rounded-none"/>
      </td>
      <td>
        <input type="text" placeholder="reps completed on last set" className="input input-ghost w-full max-w-xs" />
      </td>
    </tr>
  );
}

function Lifts() {
  const primary = 'primary';
  const auxiliary = 'auxiliary';
  const routine = 'x6';
  const day = 0;
  const week = 0;
  const [daysLifts, setDaysLifts] = useState(sampleRecords.weeks[week].days[day]);

  useEffect(() => {
    console.log(daysLifts);
  }, [daysLifts]);

  /*
  // generates values for a new routine
  useEffect(() => {
    //
    // TODO: 
    //  reduce redundant code
    //
    for (let week = 0; week < sampleReps.primary.intensity.length; week++) {
      console.log('----------------------------------------------------------------------------------')
      console.log("WEAK ", week + 1);
      for (const day in sampleSchedules[routine]) {
        console.log(`day ${Number(day) + 1}: `);
        if (primary in sampleSchedules[routine][day]) {
          const primaryLifts = sampleSchedules[routine][day][primary];
          for (const lift of primaryLifts) {
            const weight = sampleReps[primary]['intensity'][week] * sampleTMs[primary][lift];
            const reps = sampleReps[primary]['reps'][week];
            const target = sampleReps[primary]['lastSet'][week];
            console.log(`${lift} @ ${weight} for 4x${reps} & 1x${target}`);
          }
        }
        if (auxiliary in sampleSchedules[routine][day]) {
          const auxiliaryLifts = sampleSchedules[routine][day][auxiliary];
          for (const lift of auxiliaryLifts) {
            const weight = sampleReps[auxiliary]['intensity'][week] * sampleTMs[auxiliary][lift];
            const reps = sampleReps[auxiliary]['reps'][week] * sampleTMs[auxiliary][lift];
            const target = sampleReps[auxiliary]['lastSet'][week] * sampleTMs[auxiliary][lift];
            console.log(`${lift} @ ${weight} for 4x${reps} & 1x${target}`);
          }
        }
      }
    }
  }, []);
  */

  return (
    <div className="overflow-x-auto">

      <table className="table table-zebra">

        <thead>
          <tr>
            <th></th>
            <th>Lift</th>
            <th>Weight</th>
            <th>Reps</th>
            <th>Last Set Target</th>
            <th>Sets</th>
            <th>Actual</th>
          </tr>
        </thead>

        <tbody>
          {Object.keys(daysLifts).map((lift) =>  (
            <Lift 
              name={lift} 
              weight={daysLifts[lift].weight} 
              reps={daysLifts[lift].reps} 
              target={daysLifts[lift].target} 
              lastSet={daysLifts[lift].lastSet}  
            />
          ))}          
        </tbody>

      </table>

    </div>
  );
}

export default Lifts;
