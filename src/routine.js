import schedules from './data/schedules.json';
import programming from './data/workout.json';

function makeNewRoutine(primaryLifts, auxiliaryLifts) {
  const nWeeks = programming.primary.intensity.length;
  const weeks = [];

  for (let i = 0; i < nWeeks; i++) {
    const priReps = programming.primary.reps[i];
    const priLastSet = programming.primary.lastSet[i];
    const priIntesity = programming.primary.intensity[i];
  
    const auxReps = programming.auxiliary.reps[i];
    const auxLastSet = programming.auxiliary.lastSet[i];
    const auxIntesity = programming.auxiliary.intensity[i];
  
    const priLifts = [];
    const auxLifts = [];

    for (let j = 0; j < primaryLifts.length; j++) {
      const { name, weight } = primaryLifts[j];
      const trainingWeight = weight * priIntesity;

      priLifts.push({
        name,
        weight: trainingWeight,
        setsCompleted: 0,
        reps: priReps,
        lastSet: priLastSet
      });
    }

    for (let j = 0; j < auxiliaryLifts.length; j++) {
      const { name, weight } = auxiliaryLifts[j];
      const trainingWeight = weight * auxIntesity;

      auxLifts.push({
        name,
        weight: trainingWeight,
        setsCompleted: 0,
        reps: auxReps,
        lastSet: auxLastSet
      });
    }

    weeks.push({ primaryLifts: priLifts, auxiliaryLifts: auxLifts });
  }

  return weeks;
}

function formatWeek(format, { primaryLifts, auxiliaryLifts }) {
  const schedule = schedules[format];
  const week = [];

  for (let i = 0; i < schedule.length; i++) {
    const primary = [];
    const auxiliary = [];

    if ('primary' in schedule[i]) {
      for (let j = 0; j < schedule[i].primary.length; j++) {
        const lift = schedule[i].primary[j];
        primary.push(primaryLifts[lift]);
      }
    }
    if ('auxiliary' in schedule[i]) {
      for (let j = 0; j < schedule[i].auxiliary.length; j++) {
        const lift = schedule[i].auxiliary[j];
        auxiliary.push(auxiliaryLifts[lift]);
      }
    }
    week.push({ primary, auxiliary });
  }

  return week;
}

function updateWeight(category, week, updatedTM) {
  const intensity = programming[category]['intensity'][week];
  return updatedTM * intensity;
}

function getPotentialLifts(day, category, format) {
  return schedules[format][day][category];
}

function roundWeight(weight, x) {
  if (weight % x === 0) return weight;

  if (x === 5) {
    const rounded = Math.round(weight);
    const remainder = rounded % x;
    const onesPlace = rounded % 10;
    
    if (onesPlace <= 2 || onesPlace >= 6) {
      return rounded - remainder;
    } else {
      return rounded + (x - remainder);
    }
  }
  // x = 2.5
  if (weight % 2.5 === 0) return weight;

  const rounded = Math.round(weight * 10) / 10;
  const remainder = rounded % 2.5;
  
  const additive = (rounded + (2.5 - remainder));
  const subtractive = (rounded - remainder);

  return Math.abs(rounded - additive) < Math.abs(rounded - subtractive) ? additive : subtractive;
}

function getIndices(format, day, category) {
  return schedules[format][day][category];
}

export { makeNewRoutine, formatWeek, updateWeight, getPotentialLifts, roundWeight, getIndices };
