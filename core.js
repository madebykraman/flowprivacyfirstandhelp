/* NijRitu V0.3 cycle engine. Pure functions only: no DOM, storage or network dependencies. */
(function(root){
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const key=d=>{d=new Date(d);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  const parse=k=>{const [y,m,d]=String(k).split('-').map(Number);return new Date(y,m-1,d)};
  const add=(k,n)=>{const d=parse(k);d.setDate(d.getDate()+n);return key(d)};
  const days=(a,b)=>Math.round((parse(b)-parse(a))/86400000);
  const average=(a,fallback)=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):fallback;
  const median=(a,fallback)=>{if(!a.length)return fallback;const x=[...a].sort((a,b)=>a-b),m=Math.floor(x.length/2);return x.length%2?x[m]:Math.round((x[m-1]+x[m])/2)};
  function periodStarts(logs){const out=[];for(const k of Object.keys(logs||{}).sort()){if(!logs[k]?.period)continue;const previous=add(k,-1);if(!logs[previous]?.period)out.push(k)}return out}
  function cycleLengths(logs){const s=periodStarts(logs);return s.slice(1).map((k,i)=>days(s[i],k)).filter(n=>n>=15&&n<=90)}
  function periodDurations(logs){const out=[];for(const s of periodStarts(logs)){let n=0;for(let i=0;i<15;i++){const l=logs[add(s,i)];if(l?.period)n++;else if(i>0)break}if(n)out.push(n)}return out}
  function robustBaseline(values,fallback,min,max){return clamp(median(values,fallback),min,max)}
  function prediction(logs,profile){const starts=periodStarts(logs),lengths=cycleLengths(logs),cycle=robustBaseline(lengths,Number(profile?.cycleLength)||28,15,90);if(!starts.length)return null;const next=add(starts.at(-1),cycle);return {next,cycle,period:robustBaseline(periodDurations(logs),Number(profile?.periodLength)||5,1,15)} }
  function symptomFrequency(logs){const counts={};for(const v of Object.values(logs||{}))for(const s of Array.isArray(v?.symptoms)?v.symptoms:[])counts[s]=(counts[s]||0)+1;return Object.entries(counts).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))}
  function painSummary(logs){const levels=['None','Mild','Moderate','Severe'];const out=Object.fromEntries(levels.map(x=>[x,0]));for(const v of Object.values(logs||{}))if(v?.pain&&out[v.pain]!==undefined)out[v.pain]++;return out}
  function stats(logs,profile){const starts=periodStarts(logs),lengths=cycleLengths(logs),durations=periodDurations(logs),p=prediction(logs,profile);return {starts,lengths,durations,cycle:p?.cycle||robustBaseline([],Number(profile?.cycleLength)||28,15,90),period:p?.period||robustBaseline([],Number(profile?.periodLength)||5,1,15),next:p?.next||null,medianCycle:median(lengths,Number(profile?.cycleLength)||28),medianPeriod:median(durations,Number(profile?.periodLength)||5),minCycle:lengths.length?Math.min(...lengths):null,maxCycle:lengths.length?Math.max(...lengths):null,symptoms:symptomFrequency(logs),pain:painSummary(logs)} }
  const api={clamp,key,parse,add,days,average,median,periodStarts,cycleLengths,periodDurations,prediction,symptomFrequency,painSummary,stats};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.NijRituCore=api;
})(typeof window!=='undefined'?window:globalThis);
