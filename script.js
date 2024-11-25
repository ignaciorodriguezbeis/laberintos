const canvas = document.getElementById('laberintoCanvas');
const ctx = canvas.getContext('2d');
const blockSize = 20;
const mazeSize = 40;
const player = { x: 0, y: 0 };
const exit = { x: mazeSize - 1, y: mazeSize - 1 };

let maze = generateMaze(mazeSize, mazeSize);

// Dibujar el laberinto
function drawMaze() {
    for (let row = 0; row < mazeSize; row++) {
        for (let col = 0; col < mazeSize; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = 'black';
            } else {
                ctx.fillStyle = 'white';
            }
            ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
        }
    }

    // Dibujar al jugador
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x * blockSize, player.y * blockSize, blockSize, blockSize);

    // Dibujar la salida
    ctx.fillStyle = 'green';
    ctx.fillRect(exit.x * blockSize, exit.y * blockSize, blockSize, blockSize);
}

// Generar laberinto usando DFS
function generateMaze(rows, cols) {
    let maze = new Array(rows).fill(null).map(() => new Array(cols).fill(1));
    let visited = new Array(rows).fill(null).map(() => new Array(cols).fill(false));

    // Direcciones posibles (arriba, abajo, izquierda, derecha)
    let directions = [
        [0, -1], [0, 1], [-1, 0], [1, 0]
    ];

    // Función auxiliar para mezclar direcciones
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // DFS recursivo para crear caminos
    function carvePath(x, y) {
        visited[y][x] = true;
        maze[y][x] = 0; // Crear camino

        shuffle(directions); // Mezclar direcciones para hacer el laberinto aleatorio
        for (let [dx, dy] of directions) {
            let nx = x + dx * 2; // Moverse dos espacios
            let ny = y + dy * 2;

            if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && !visited[ny][nx]) {
                maze[y + dy][x + dx] = 0; // Crear camino intermedio
                carvePath(nx, ny);
            }
        }
    }

    // Comenzar desde la entrada
    carvePath(1, 0);

    // Asegurar la salida
    maze[rows  -1][cols  -1] = 1;

    return maze;
}

// Manejo de movimiento con las flechas
window.addEventListener('keydown', (e) => {
    let newX = player.x;
    let newY = player.y;

    if (e.key === 'ArrowUp' && player.y > 0 && maze[player.y - 1][player.x] === 0) newY--;
    if (e.key === 'ArrowDown' && player.y < mazeSize - 1 && maze[player.y + 1][player.x] === 0) newY++;
    if (e.key === 'ArrowLeft' && player.x > 0 && maze[player.y][player.x - 1] === 0) newX--;
    if (e.key === 'ArrowRight' && player.x < mazeSize - 1 && maze[player.y][player.x + 1] === 0) newX++;

    player.x = newX;
    player.y = newY;

    // Verificar si ha llegado a la salida
    if (player.x === exit.x && player.y === exit.y) {
        alert('¡Has completado el laberinto!');
    }

    drawMaze();
});

// Iniciar laberinto
drawMaze();
