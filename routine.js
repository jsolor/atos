function makeNewRoutine({ days, primaryLifts, auxiliaryLifts }, repSchema, schedules) {
  const format = schedules[days + 'x'];
  const nWeeks = repSchema.primary.intensity.length;
  const weeks = [];

  for (let i = 0; i < nWeeks; i++) {
    const week = [];
    const priReps = repSchema.primary.reps[i];
    const priLastSet = repSchema.primary.lastSet[i];
    const priIntesity = repSchema.primary.intensity[i];
  
    const auxReps = repSchema.auxiliary.reps[i];
    const auxLastSet = repSchema.auxiliary.lastSet[i];
    const auxIntesity = repSchema.auxiliary.intensity[i];
  
    for (let d = 0; d < Number(days); d++) {
      const day = { primary: [], auxiliary: [] };
      if ('primary' in format[d]) {
        for (let p = 0; p < format[d].primary.length; p++) {
          const { name, weight } = primaryLifts[format[d].primary[p]];
          const trainingWeight = Number(weight) * priIntesity;
          day.primary.push({ name, weight: trainingWeight, reps: priReps, lastSet: priLastSet });
        }
      }
      if ('auxiliary' in format[d]) {
        for (let a = 0; a < format[d].auxiliary.length; a++) {
          const { name, weight } = auxiliaryLifts[format[d].auxiliary[a]];
          const trainingWeight = Number(weight) * auxIntesity;
          day.auxiliary.push({ name, weight: trainingWeight, reps: auxReps, lastSet: auxLastSet });
        }
      }
      week.push(day);
    }
    weeks.push(week);
  }

  return weeks;
}

export default makeNewRoutine;
