class Node {
  constructor(name, size, header) {
    this.name = name;
    this.size = size;
    this.header = header || this; // Set header to itself if not provided
    this.up = this;
    this.down = this;
    this.left = this;
    this.right = this;
    this.column = this;
  }
}
class DancingLinks {
  constructor(matrix) {
    this.header = this.createHeader(matrix[0].length);
    this.populate(matrix);
    this.solution = [];
  }

  createHeader(size) {
    const header = { size, name: 'head' };
    let current = header;

    for (let i = 0; i < size; i++) {
      const newNode = { name: `C${i + 1}`, size: 0, header };
      current.right = newNode;
      newNode.left = current;
      current = newNode;
    }

    current.right = header;
    header.left = current;

    return header;
  }

populate(matrix) {
  let rowIndex = 0;

  for (const layerSize of matrix) {
    let previousNode = null;
    let firstNode = null;

    for (let i = 0; i < layerSize.length; i++) {
      if (layerSize[i] === 1) {
        let columnNode = this.findColumn(i + 1);

        // Create the columnNode if it doesn't exist
        if (columnNode === null) {
          const header = this.header;
          columnNode = new Node(`C${i + 1}`, 0, header);

          // Link the newColumnNode to the header vertically
          if (header.up !== undefined) {
            columnNode.up = header.up;
            columnNode.down = header;
            header.up.down = columnNode;
            header.up = columnNode;
          } else {
            // If header.up is undefined, it means this is the first node in the column
            // So, link it to itself vertically
            columnNode.up = columnNode;
            columnNode.down = columnNode;
          }

          // Update the previousNode to the new columnNode
          if (previousNode !== null) {
            previousNode.down = columnNode;
          }

          previousNode = columnNode;
        }

        // Create the newNode
        const newNode = new Node(`R${rowIndex + 1}C${i + 1}`, 0, columnNode.header);

        // Link the newNode horizontally
        if (previousNode !== null) {
          newNode.left = previousNode;
          previousNode.right = newNode;
        } else {
          firstNode = newNode;
        }

        // Link the newNode vertically
        newNode.up = columnNode.up;
        newNode.down = columnNode;
        columnNode.up.down = newNode;
        columnNode.up = newNode;

        // Update the previousNode for the next iteration
        previousNode = newNode;

        columnNode.size++;
      }
    }

    // Link the last node in the row to the firstNode horizontally
    if (firstNode !== null) {
      previousNode.right = firstNode;
      firstNode.left = previousNode;
    }

    rowIndex++;
  }
}
  findColumn(columnIndex) {
    let current = this.header.right;

    while (current !== this.header) {
      if (current.size > 0 && current.name === `C${columnIndex}`) {
        return current;
      }

      current = current.right;
    }

    return null;
  }

cover(columnNode) {
  console.log("Covering column:", columnNode.name);
  if (columnNode.size === 0) {
    return;
  }
  // Remove the column from the header's horizontal linked list
  columnNode.left.right = columnNode.right;
  columnNode.right.left = columnNode.left;

  // Iterate through each row in the column
  for (let rowNode = columnNode.down; rowNode !== columnNode; rowNode = rowNode.down) {
    // Iterate through each node in the row
    for (let rightNode = rowNode.right; rightNode !== rowNode; rightNode = rightNode.right) {
      // Remove the node from its column's vertical linked list
      rightNode.up.down = rightNode.down;
      rightNode.down.up = rightNode.up;

      // Decrease the size of the column
      rightNode.column.size--;
    }
  }
}
uncover(columnNode) {
  console.log("Uncovering column:", columnNode.name);
  let rowNode = columnNode.up;

  while (rowNode !== columnNode) {
    let leftNode = rowNode.left;

    while (leftNode !== rowNode) {
      leftNode.down.up = leftNode;
      leftNode.up.down = leftNode;
      leftNode.column.size++;

      leftNode = leftNode.left;
    }

    rowNode = rowNode.up;
  }

  columnNode.right.left = columnNode;
  columnNode.left.right = columnNode;
}
search() {
  if (this.header.right === this.header) {
    console.log("Solution found!");
    return true;
  }

  let columnNode = this.chooseColumn();
  this.cover(columnNode);

  let rowNode = columnNode.down;

  if (!rowNode) {
    console.log("ERROR: rowNode is undefined!");
    this.uncover(columnNode);
    return false;
  }

  while (rowNode !== columnNode) {
    console.log("Before loop - rowNode:", rowNode);

    let rightNode = rowNode.right;
    console.log("Inside loop - rightNode:", rightNode);

    while (rightNode !== rowNode) {
      console.log("Inside loop - rightNode:", rightNode);
      this.cover(rightNode.column);
      rightNode = rightNode.right;
    }

    console.log("After loop - rightNode:", rightNode);

    if (!rightNode) {
      console.log("ERROR: rightNode is undefined!");
    }

    if (this.search()) {
      return true;
    }

    this.solution.pop();
    columnNode = rowNode.column;
    rowNode = rowNode.down;

    if (!rowNode) {
      console.log("ERROR: rowNode is undefined!");
      break;
    }

    let leftNode = rowNode.left;

    while (leftNode !== rowNode) {
      this.uncover(leftNode.column);
      leftNode = leftNode.left;
    }
  }

  this.uncover(columnNode);
  return false;
}

  chooseColumn() {
    let minSize = Number.MAX_VALUE;
    let columnNode = null;
    let current = this.header.right;

    while (current !== this.header) {
      if (current.size < minSize) {
        minSize = current.size;
        columnNode = current;
      }

      current = current.right;
    }

    return columnNode;
  }

  getSolution() {
    return this.solution.map(node => {
      let row = [];
      let temp = node;

      do {
        row.push(temp.column.name);
        temp = temp.right;
      } while (temp !== node);

      return row;
    });
  }
}

// Algorithm X solver
function solve(items, sets) {
  const matrix = createMatrix(items, sets);
  const dlx = new DancingLinks(matrix);

  if (dlx.search()) {
    const solution = dlx.getSolution();
    return solution;
  } else {
    return null;
  }
}

// Helper function to create the matrix for Dancing Links
function createMatrix(items, sets) {
  const matrix = [];
  for (const setKey of Object.keys(sets)) {
    const currentSet = sets[setKey];
    const row = Array.from({ length: Object.keys(items).length }, (_, i) => {
      const itemName = Object.keys(items)[i];
      console.log('Checking:', itemName, 'in set', currentSet);
      return currentSet.indexOf(itemName) !== -1 ? 1 : 0;
    });
    matrix.push(row);
  }
  return matrix;
}

// Example usage:
const items = {
  'A': [1, 4, 7],
  'B': [1, 4],
  'C': [4, 5, 7],
  'D': [3, 5, 6],
  'E': [2, 3, 6, 7],
  'F': [2, 7],
  'G': [2, 3, 5, 6]
};

const sets = {
  1: new Set(['A', 'B']),
  2: new Set(['E', 'F', 'G']),
  3: new Set(['D', 'E', 'G']),
  4: new Set(['A', 'B', 'C']),
  5: new Set(['C', 'D', 'G']),
  6: new Set(['D', 'E', 'G']),
  7: new Set(['A', 'C', 'E', 'F'])
};

//const solution = solve(items, sets);
//console.log('Solution:', solution);

export { items, sets, solve };