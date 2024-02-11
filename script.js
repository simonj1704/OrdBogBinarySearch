"use strict";

document.addEventListener("DOMContentLoaded", start);

function start() {
    console.log("JS is running")
    loadData();
}

let wordList = [];
//const ord = {bøjningsformen: "?", opslagsordet: "?", homografnummer: "?", ordklassen: "?", id: "?"};
let jsFind;
//let count = 0;

async function loadData(){
    const response = await fetch("/data/ddo_fullforms_2023-10-11.csv");
    const data = await response.text();
    const rows = data.split("\n");
    rows.forEach(row => {
        const splitRow = row.split("\t");
        let ord = {
            bøjningsformen: splitRow[0],
            opslagsordet: splitRow[1],
            homografnummer: splitRow[2],
            ordklassen: splitRow[3],
            id: splitRow[4]
        };

        wordList.push(ord);
        });
        wordList.sort((a, b) => a.bøjningsformen.localeCompare(b.bøjningsformen));
        //console.log(wordList);
        jsFind = wordList.findIndex(wordObject => wordObject.bøjningsformen === "hestevogn");

    };


function searchWord(word){
    //count=0;
    let result = binarySearchCompare(word, wordList, compareWords);
    //console.log("count:" + count)
    return result;
}


function binarySearchCompare(value, values, compare){
    let start = 0;
    let end = values.length-1;
    
    let middle = Math.floor(start + ((end - start) / 2));
    let cmp = compare(value, values[middle]);
    //count++;
    if(cmp === 0){
        return middle;
    }
    while(start <= end){
        cmp = compare(value, values[middle]);
        if(cmp === 0){
            return middle;
        } else if(cmp < 0){
            end = middle - 1;
        } else if (cmp > 0){
            start = middle + 1;
        }
        middle = Math.floor(start + ((end - start) / 2));
        if(cmp === 0){
            return middle;
        }
        //count++;
    }
    //console.log("not found")
    return -1;
    }

function compareWords(search, check){
    let result = search.localeCompare(check.bøjningsformen);
    return result
}

loadData().then(() => { 


    performance.mark("start-binary-search");
    const binarySearchIndex = searchWord("hestevogn");
    performance.mark("end-binary-search");
  
    performance.measure("binary-search", "start-binary-search", "end-binary-search");
  
    performance.mark("start-find-search");
    const index = wordList.findIndex(wordObject => wordObject.bøjningsformen === "hestevogn");
    performance.mark("end-find-search");
  
    performance.measure("find-search", "start-find-search", "end-find-search");
  
    const measurements = performance.getEntriesByType('measure');
    measurements.forEach(measurement => {
    console.log(`${measurement.name}: ${measurement.duration}ms`);
    });
  
  });