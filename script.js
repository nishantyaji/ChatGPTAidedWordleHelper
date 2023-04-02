const root = document.querySelector('#root');

// Create reset button
const resetButton = document.createElement('button');
resetButton.innerText = 'Reset';
resetButton.addEventListener('click', () => {
  window.location.reload();
});
root.appendChild(resetButton);

// Add print button
const printButton = document.createElement('button');
printButton.innerText = 'Print';
printButton.addEventListener('click', () => {
  const resultDiv = document.createElement('div');
  inputs.forEach(input => {
    const backgroundColor = input.style.backgroundColor;
    const value = input.value;
    let text;
    if (backgroundColor === 'yellow' && value) {
      text = `Unsure ${value} ${input.dataset.boxNumber%5}`;
      resultDiv.innerText += `${text}, `;
    } else if (backgroundColor === 'green' && value) {
      text = `Sure ${value} ${input.dataset.boxNumber%5}`;
      resultDiv.innerText += `${text}, `;
    }
  });
  root.appendChild(resultDiv);
  process(resultDiv.innerText);
});
root.appendChild(printButton);

const spaceDiv = document.createElement('div');
spaceDiv.innerText = '\u00A0';
root.appendChild(spaceDiv);
const spaceDiv2 = document.createElement('div');
spaceDiv2.innerText = '\u00A0';
root.appendChild(spaceDiv2);

// Create 6 rows of 5 input boxes
let boxNumber = 1;
for (let i = 0; i < 6; i++) {
  for (let j = 0; j < 5; j++) {
    const input = document.createElement('input');
    input.dataset.boxNumber = boxNumber;
    input.addEventListener('focus', e => {
      activeInput = e.target;
    });
    input.style.width = '75px';
    input.style.height = '75px';
    input.style.border = '2px solid black';
    input.style.borderRadius = '5px';
    input.style.backgroundColor = '#f2f2f2';
    input.style.fontSize = '20px';
    input.style.fontWeight = 'bold';
    input.style.boxShadow = '5px 5px 5px #cccccc';
    boxNumber++;
    root.appendChild(input);
  }
  const spaceDiv = document.createElement('div');
  spaceDiv.innerText = '\u00A0';
  root.appendChild(spaceDiv);
}

// Create 3 color buttons
let activeInput;
const whiteButton = document.createElement('button');
whiteButton.innerText = 'White';
whiteButton.addEventListener('click', e => {
  activeInput.style.backgroundColor = 'white';
});
root.appendChild(whiteButton);

const greenButton = document.createElement('button');
greenButton.innerText = 'Green';
greenButton.addEventListener('click', e => {
  activeInput.style.backgroundColor = 'green';
});
root.appendChild(greenButton);

const yellowButton = document.createElement('button');
yellowButton.innerText = 'Yellow';
yellowButton.addEventListener('click', e => {
  activeInput.style.backgroundColor = 'yellow';
});
root.appendChild(yellowButton);

// Listen for input changes
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
  input.addEventListener('input', e => {
    // Only allow one character
    const value = e.target.value;
    if (value && value.length > 1) {
      e.target.value = value[value.length - 1];
    }
  });
});

let process = (inputString) => {
    let map = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: []
    };
    
    let nomap = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: []
    };

    let suremap = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: []
    }; 

    let tokens = inputString.split(',');
    tokens.forEach(token => {
        let words = token.trim().split(' ');
        let word1 = words[0];
        let word2 = words[1];
        let word3 = Number(words[2]);
        if (word1 === 'Sure') {
            suremap[word3] = [word2];
            map[word3] = [word2];
        } else if (word1 === 'Unsure') {
            nomap[word3].push(word2);
            map[word3] = map[word3].filter(w => w !== word2);
            Object.keys(map).forEach(key => {
                if (key !== word3 && !nomap[key].includes(word2) && suremap[key].length == 0) {
                    map[key].push(word2);
                }
            });
        }
    });

    processMaps(nomap, suremap);

    return map;
}

function perms(data) {
  data = data.slice(); // make a copy
  var permutations = [],
      stack = [],
      hash = Object.create(null);

  function doPerm() {
      if (data.length == 0) {
          permutations.some(function (a) {
              return a.every(function (b, j) {
                  return stack[j] === b;
              });
          }) || permutations.push(stack.slice());
          return;
      }
      for (var i = 0; i < data.length; i++) {
          var x = data.splice(i, 1)[0];
          stack.push(x);
          doPerm();
          stack.pop();
          data.splice(i, 0, x);
      }
  }

  doPerm();
  return permutations;
}

function processMaps(nomap, suremap) {
    let undindices = [];
    Object.keys(suremap).forEach(key => {
        if (suremap[key].length == 0) {
            undindices.push(key);
        } 
    });

    let surelettersset = new Set();
    Object.keys(suremap).forEach(key => {
        if (suremap[key].length > 0) {
            surelettersset.add(suremap[key][0]);
        }
    });

    let undlettersset = new Set()
    Object.keys(nomap).forEach(key => {
        if (nomap[key].length > 0) {
            for (let i = 0; i < nomap[key].length; i++) {
                if (!surelettersset.has(nomap[key][i])) {
                    undlettersset.add(nomap[key][i]);
                }
            }
        }
    });


    let undletters = Array.from(undlettersset);
    let sureletters = Array.from(surelettersset);
    let diff = (5 - sureletters.length) - undletters.length;

    for (let i = 0; i < diff; i++) {
        undletters.push("_");
    }

    //List
    resulttemp = perms(undletters)

    //Converting list to set
    const resultset = new Set(resulttemp);

    //Converting set back to list
    const result = [...resultset];

    for (let j = 0; j < result.length; j++) {
        let word = "";
        let count = 0;
        let broken = 0;
        for( let k = 1; k <= 5; k++) {
            if(suremap[k].length > 0) {
                word = word + " " + suremap[k][0];
            } else {
                if (nomap[k].includes(result[j][count])) {
                    broken = 1;
                    break;
                }
                word = word + " " + result[j][count];
                count = count + 1;
            }
        }
        if(broken == 1) {
          continue;
        }

        let para = document.createElement("p");
        let node = document.createTextNode(word);
        para.appendChild(node);
        document.body.appendChild(para);
    }
}