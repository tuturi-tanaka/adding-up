'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
const prefecturedataMap = new Map();
rl.on('line', lineString => {
    const columus = lineString.split(',');
    const year = parseInt(columus[0]);
    const prefecture = columus[1];
    const popu = parseInt(columus[3]);
    if (year === 2010 || year === 2015) {
    let value = null;
    if (prefecturedataMap.has(prefecture)) {
        value = prefecturedataMap.get(prefecture);
    }else {
        value = {
            popu10: 0,
            popu15: 0,
            change: null
        };
    }
    if(year === 2010) {
        value.popu10 = popu;
    }
    if (year === 2015) {
        value.popu15 = popu;
    }
    prefecturedataMap.set(prefecture, value);
    }
});
rl.on('close' , () => {
    for (const [key, value] of prefecturedataMap) {
        value.change = value.popu15 / value.popu10;
  }
   const rankingArray = Array.from(prefecturedataMap).sort((pair1, pair2) => {
       return pair1[1].change - pair2[1].change;
   });
   const rankingStrings = rankingArray.map(([key, value], i) => {
       return(i + 1 + '位' + key + ':' + value.popu10 + '=>' + value.popu15 + '変化率:' + value.change);
   });
   console.log(rankingStrings);
});

