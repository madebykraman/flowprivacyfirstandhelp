const assert=require('node:assert/strict');
const c=require('../core.js');

assert.equal(c.add('2026-01-31',1),'2026-02-01');
assert.equal(c.days('2026-01-01','2026-01-28'),27);
assert.equal(c.median([28,30,27],28),28);

const logs={
  '2026-01-01':{period:true,flow:'Medium'},
  '2026-01-02':{period:true},
  '2026-01-03':{period:true,symptoms:['Cramps']},
  '2026-01-29':{period:true,flow:'Light',symptoms:['Cramps','Headache']},
  '2026-01-30':{period:true},
  '2026-03-01':{period:true,pain:'Moderate',symptoms:['Cramps']}
};

assert.deepEqual(c.periodStarts(logs),['2026-01-01','2026-01-29','2026-03-01']);
assert.deepEqual(c.cycleLengths(logs),[28,31]);
assert.deepEqual(c.periodDurations(logs),[3,2,1]);
assert.equal(c.median(c.cycleLengths(logs),28),30);
assert.equal(c.median(c.periodDurations(logs),5),2);
assert.deepEqual(c.symptomFrequency(logs).slice(0,2),[['Cramps',3],['Headache',1]]);
assert.equal(c.painSummary(logs).Moderate,1);

const p=c.prediction(logs,{cycleLength:28,periodLength:5});
assert.equal(p.next,'2026-03-31');
assert.equal(p.cycle,30);
assert.equal(p.period,2);

console.log('NijRitu core tests passed');
