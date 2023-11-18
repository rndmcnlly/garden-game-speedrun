const blessed = require('blessed');

// Create a screen object.
const screen = blessed.screen({
  smartCSR: true,
  title: 'Garden Game'
});

// Initialize the garden grid.
const garden = [];
for (let y = 0; y < 4; y++) {
  garden[y] = [];
  for (let x = 0; x < 4; x++) {
    garden[y][x] = blessed.box({
      parent: screen,
      top: y * 3,    // Adjust cell size
      left: x * 6,   // Adjust cell size
      width: 5,
      height: 3,
      content: ' . ',
      style: {
        fg: 'green',
        bg: 'black',
        border: {
          fg: 'white'
        }
      }
    });
  }
}

// Player initial position
let playerPos = { x: 0, y: 0 };
updateCell(playerPos.y, playerPos.x, ' P ');

// Handle arrow keys.
screen.key(['up', 'down', 'left', 'right'], (ch, key) => {
  movePlayer(key.name);
});

function movePlayer(direction) {
  const newPos = { ...playerPos };
  switch (direction) {
    case 'up': newPos.y = Math.max(0, playerPos.y - 1); break;
    case 'down': newPos.y = Math.min(3, playerPos.y + 1); break;
    case 'left': newPos.x = Math.max(0, playerPos.x - 1); break;
    case 'right': newPos.x = Math.min(3, playerPos.x + 1); break;
  }

  if (newPos.x !== playerPos.x || newPos.y !== playerPos.y) {
    // Update old position
    updateCell(playerPos.y, playerPos.x, ' . ');

    // Update new position
    playerPos = newPos;
    updateCell(playerPos.y, playerPos.x, ' P ');
    
    screen.render();
  }
}

function updateCell(y, x, content) {
  const cell = garden[y][x];
  cell.setContent(content);

  if (content.trim() === 'P') {  // If the cell contains the player
    cell.style.fg = 'yellow';  // Change to gold-ish color
  } else {
    cell.style.fg = 'green';  // Reset to original color for other cells
  }
}


// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

// Render the screen.
screen.render();
