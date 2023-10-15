/*
 * Created by Linh Ngo in 12/03/2017
 */
// ANIMATE ALGORITHM BY DECONSTRUCTING FOR LOOPS INTO IF-ELSE

/* Function to check contraints
 * @return: True if in column j, no queen is placed from 0 to rows - 1
 * */
// each solution is an array
let meetConstraints = (rows, column, solution) => {
  for (let i = 0; i < rows; i++) {
    if (solution[i] === column ||
      Math.abs(column - solution[i]) === Math.abs(rows - i)) { //The abs() method returns the absolute value of a number.
      return false;
    }
  }
  return true;
}

let queen = {
  name: "queen",
  b: "\u265B" // Unicode Character 'BLACK CHESS QUEEN' (U+265B)
};
let indexes = [];

/* DRAW CHESS BOARD FUNCTION
 * @param: n -> set boardDimension
 * */
let drawBoard = (n, totalSolutions, index) => {
  ///// Draw
  let boxSize = 50,
    boardDimension = n,
    boardSize = boardDimension * boxSize,
    margin = 100;

  let div = d3.select("#svg-container");
  // create <svg>
  let svg = div.append("svg")
    .attr("width", boardSize + boxSize + "px")
    .attr("height", boardSize + boxSize + "px");
  labels = indexes.slice();
  if (n > indexes.length) {
    for (let i = indexes.length; i < n; i++) {
      labels.push(i);
    }
  }

  // top labels
  svg.selectAll("colLabel")
    .data(labels)
    .enter().append("text")
    .text(function (d) { return d; })
    .classed("colLabel", true)
    .attr("y", 0)
    .attr("x", function (d, i) { return i * boxSize + boxSize / 2; })
    .attr("dx", boxSize / 2)
    .attr("dy", boxSize / 3)
    .style("font-size", boxSize / 3 + "px")
    .style("text-anchor", "middle")
    .style("opacity", 0.8);
  // left labels
  svg.selectAll("rowLabel")
    .data(labels)
    .enter().append("text")
    .text(function (d) { return d; })
    .classed("rowLabel", true)
    .attr("y", function (d, i) { return i * boxSize + boxSize / 2; })
    .attr("x", 0)
    .attr("dx", boxSize / 4)
    .attr("dy", boxSize / 2)
    .style("font-size", boxSize / 3 + "px")
    .style("text-anchor", "middle")
    .style("opacity", 0.8);
  // loop through 8 rows and 8 columns to draw the chess board
  for (let i = 0; i < boardDimension; i++) {
    for (let j = 0; j < boardDimension; j++) {
      // draw each chess field
      let box = svg.append("rect")
        .attr("x", i * boxSize + boxSize / 2)
        .attr("y", j * boxSize + boxSize / 2)
        .attr("width", boxSize + "px")
        .attr("height", boxSize + "px");
      if ((i + j) % 2 === 0) {
        box.attr("fill", "beige");
      } else {
        box.attr("fill", "gray");
      }
    }
  }

  // draw chess pieces
  for (let i = 0; i < boardDimension; i++) {
    for (let j = 0; j < boardDimension; j++) {
      const chess = svg.append("text")
        .classed('chess-pieces', true)
        .attr("id", "b" + j + i)
        .attr("text-anchor", "middle")
        .attr("x", i * boxSize + boxSize / 2)
        .attr("y", j * boxSize + boxSize / 2)
        .attr("dx", boxSize / 2)
        .attr("dy", boxSize * 3 / 4)
        .attr("font-size", '45')
        .style("text-shadow", "2px 2px 4px #757575");
      chess.attr("X", chess.attr("x"))
        .attr("Y", chess.attr("y"));
      // // Draw pieces
      if (j === 0) {
        chess.classed('row0', true);
      }
      if (j === 1) {
        chess.classed('row1', true);
      }
      if (j === 2) {
        chess.classed('row2', true);
      }
      if (j === 3) {
        chess.classed('row3', true);
      }
      if (j === totalSolutions[index][i]) {
        chess.attr("id", "b" + j + i)
          .classed('team1', true)
          .text(queen.b);
      }
    }
  }
}//end of drawBoard

// ANIMATION
let n = 4;
const colors = queen;
let countCol = 0;
let countRow = 0;
let solIndex = 0;
let newSolutions = [];
let prevSolutions = [];
let autoAnimation = "";
const inputNum = document.getElementById("inputNum");
const status = document.getElementById("status");
let steps = 0;
//default
const init = () => {
  drawBoard(n, [[]], 0);
}
init();

/**
 * ANIMATE EACH STEP OF THE ALGORITHM
 */
const nextStep = () => {
  steps++;
  //finish checking all columns
  if (countCol === n) {
    //finish checking all solutions from previous row
    if (solIndex === prevSolutions.length - 1) {
      prevSolutions = newSolutions.slice();
      newSolutions = [];
      countRow++;
      countCol = 0;
      solIndex = 0;
      if (countRow === n) { // finish checking the last row
        status.innerHTML = `There are total  ${prevSolutions.length} solutions. There are ${steps} steps.`;
        // draw all solutions in chess board
        for (let i = 0; i < prevSolutions.length; i++) {
          drawBoard(n, prevSolutions, i);
        }
      };

      //hide all <text> in previous rows
      for (let i = 0; i <= countRow; i++) {
        d3.selectAll(".queens" + i).attr("visibility", "hidden");
      }
    } else { //checking other columns, not at the last column yet
      if (countRow > 0) {
        //move to the next solution of previous row
        countRow--;
        solIndex++;
        d3.select("#b" + countRow + solIndex).attr("visibility", "visible");
        countCol = 0;
        countRow++;
      }
    }// end of else

    if (countRow === 0) {
      countCol = 0;
      d3.selectAll(".queens" + countRow).attr("visibility", "hidden");
      d3.select("#b" + countRow + countCol).attr("visibility", "visible");
      countRow++;
      prevSolutions = newSolutions.slice();
      newSolutions = [];
    }
  } // end of checking when countCol === n

  // for all other rows (except the 1st one), with each column, check constraints
  if (countRow > 0 && countRow < n && countCol <= n) {
    //hide all <text> in previous rows
    for (let i = 0; i <= countRow; i++) {
      d3.selectAll(".queens" + i).attr("visibility", "hidden");
    }
    let solution = prevSolutions[solIndex];
    status.innerHTML = `Check row ${countRow} and column  ${countCol} when queens are placed previously at [${solution}]. `;
    //display solution
    for (let i = 0; i < solution.length; i++) {
      let solutionQ = d3.select("#b" + i + solution[i]).text(queen.b).datum(colors[solution[0]]).attr("fill", function (d) {
        return d;
      }).attr("visibility", "visible");
    }
    //select current <text> to check constraints
    let selectedQ = d3.select("#b" + countRow + countCol);
    if (meetConstraints(countRow, countCol, solution)) { //meet constraints -> place queens
      newSolutions.push(solution.concat([countCol]));
      selectedQ.classed("queens" + countRow, true).text(queen.b).datum(colors[solution[0]]).attr("fill", function (d) {
        return d;
      });
      status.innerHTML += `Store accepted solution [${solution.concat([countCol])}]`;
    } else { //place X
      selectedQ.classed("queens" + countRow, true).text("X").datum(colors[solution[0]]).attr("fill", function (d) {
        return d;
      });
    }
    selectedQ.attr("visibility", "visible");
    countCol++;
  }
  // 1st Row
  if (countRow === 0 && countCol < n) {
    let solution = [];
    status.innerHTML = `Check row ${countRow} and column  ${countCol}. `;
    let selectedQ = d3.select("#b" + countRow + countCol);
    selectedQ.classed("queens" + countRow, true).text(queen.b).datum(colors[countCol]).attr("fill", function (d) {
      return d;
    });
    //check constraints and store solutions
    if (meetConstraints(countRow, countCol, solution)) {
      // can place a queen at column j
      newSolutions.push(solution.concat([countCol]));
      status.innerHTML += `Store accepted solution [${solution.concat([countCol])}]`;
    }
    countCol++;
  }
}

/**
 * AUTO RUN
 */
const autoRun = () => {
  // assign setInterval to a var to use clearInterval to stop animation
  autoAnimation = setInterval(nextStep, 100);
}

/**
 * STOP ANIMATION
 */
const stopAnimation = () => {
  // stop auto run
  clearInterval(autoAnimation);
  // clear and draw board again
  d3.selectAll("svg").remove();
  drawBoard(n, [[]], 0);
  status.innerHTML = "You stop the animation";
  // reassign variables to rerun algorithm
  countCol = 0;
  countRow = 0;
  solIndex = 0;
  newSolutions = [];
  prevSolutions = [];
  steps = 0;
}

/**
 * click GET button to read input value
 */
const clickGet = () => {
  //index = 0;
  n = parseInt(inputNum.value);
  if (Number.isNaN(n)) {
    status.innerHTML = "Please enter a number";
  }
  else if (n < 4 || n > 10) {
    status.innerHTML = "Please enter a number between 4 and 8";
  }
  else {
    stopAnimation();
    status.innerHTML = `The chess board size is now ${n}`;
  }
}