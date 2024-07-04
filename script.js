const gridContainer = document.getElementById('grid-container');
const numRows = 15;
const numCols = 20;

const colorSchemes = {
    '#ff0000': ['#000000', '#330000', '#660000', '#990000', '#cc0000', '#ff0000'],
    '#ff5500': ['#000000', '#331100', '#662200', '#993300', '#cc4400', '#ff5500'],
    '#ffaa00': ['#003300', '#335500', '#667700', '#998800', '#cc9900', '#ffaa00'],
    '#ffff00': ['#000000', '#333300', '#666600', '#999900', '#cccc00', '#ffff00'],
    '#aaff00': ['#005500', '#227700', '#449900', '#66aa00', '#88cc00', '#aaff00'],
    '#55ff00': ['#003300', '#114400', '#227700', '#339900', '#44cc00', '#55ff00']
};

let currentColorScheme = '#ff0000';
let rainSpeed = 50;
let rainIntervals = [];
let rainActive = true;

function createGrid() {
    gridContainer.innerHTML = '';
    for (let i = 0; i < numRows * numCols; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        gridContainer.appendChild(cell);
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCell(row, col) {
    return gridContainer.children[row * numCols + col];
}

function startRain() {
    if (!rainActive) return;
    for (let col = 0; col < numCols; col++) {
        setTimeout(() => {
            rainColumn(col);
        }, randomInt(0, 1500));
    }
}

function rainColumn(col) {
    let row = -randomInt(5, 6);
    const dropLength = randomInt(7, 8);
    const interval = setInterval(() => {
        if (!rainActive) {
            clearInterval(interval);
            clearColumn(col);
            return;
        }
        if (row < numRows) {
            const brightnessArray = colorSchemes[currentColorScheme];
            for (let i = 0; i < dropLength; i++) {
                if (row + i >= 0 && row + i < numRows) {
                    const cell = getCell(row + i, col);
                    const brightnessIndex = Math.min(i, brightnessArray.length - 1);
                    const color = brightnessArray[brightnessIndex];
                    cell.style.backgroundColor = color;
                }
            }
            if (row - 1 >= 0) {
                const prevCell = getCell(row - 1, col);
                prevCell.style.backgroundColor = "black";
            }
            row++;
        } else {
            clearInterval(interval);
            clearColumn(col);
            setTimeout(() => {
                rainColumn(col);
            }, randomInt(1000, 2000));
        }
    }, rainSpeed);
    rainIntervals.push(interval);
}

function clearColumn(col) {
    for (let row = 0; row < numRows; row++) {
        const cell = getCell(row, col);
        cell.style.backgroundColor = "black";
    }
}

function changeColor() {
    const colorKeys = Object.keys(colorSchemes);
    let currentIndex = colorKeys.indexOf(currentColorScheme);
    currentColorScheme = colorKeys[(currentIndex + 1) % colorKeys.length];
}

function stopRain() {
    rainIntervals.forEach(interval => clearInterval(interval));
    rainIntervals = [];
}

function toggleRain() {
    rainActive = !rainActive;
    if (rainActive) {
        startRainAnimation();
    } else {
        stopRain();
    }
}

function startRainAnimation() {
    startRain();
}

createGrid();
startRain();
setInterval(changeColor, 2000);

document.getElementById('change-color-btn').addEventListener('click', changeColor);
document.getElementById('toggle-rain-btn').addEventListener('click', toggleRain);
