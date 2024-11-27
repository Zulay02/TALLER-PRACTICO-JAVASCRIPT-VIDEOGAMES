const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const btnDown = document.querySelector("#down");
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanPoints = document.querySelector("#points");
const spanLevel = document.querySelector("#level");
//const spanHighScore = document.querySelector("#highscore");

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;
let points = 0;

const playerPosition = {
  x: undefined,
  y: undefined,
};
const giftPosition = {
  x: undefined,
  y: undefined,
};
let enemiesPosition = []


window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function setCanvasSize() {
  // Set the canvas size
  if (window.innerHeight >= window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }

  canvasSize = Math.floor(canvasSize / 10) * 10;

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementSize = canvasSize / 10;

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function startGame() {// Es la que va a empezar el juego
  console.log('starGame ejecutandos');
  console.log({ canvasSize, elementSize }); // Mostrar tamaños en consola

  game.font = elementSize + "px verdana";//Configur la fuente
  game.textAlign = "end";//Alinear el texto a la derecha

  const map = maps[level]; // Obtener el mapa del nivel actual

  if (!map) { // Si no hay más niveles, el jugador ha ganado el juego
   gameWin();
    return;
  }

  if (!timeStart) { // Si no hay tiempo de inicio, establecerlo
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 1000);// Corrección: Mueve setInterval aquí
  }

  const mapRows = map.trim().split("\n");
  const mapRowCols = mapRows.map((row) => row.trim().split(""));
  console.log({map, mapRows, mapRowCols}); // Mostrar estructura del mapa en consola.
  
  showLives(); // Mostrar vidas al iniciar el juego
  showPoints(); // Mostrar puntos al iniciar el juego showLevel();
  showLevel(); // Mostrar nivel al iniciar el juego
  //showHighScore();

  enemiesPosition = [];
  game.clearRect(0, 0, canvasSize, canvasSize);

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const positionX = elementSize * (colI + 1);
      const positionY = elementSize * (rowI + 1);

      if (col == "O") {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = positionX;
          playerPosition.y = positionY;
          console.log({playerPosition});
        }
      } else if (col == "I") {
        giftPosition.x = positionX;
        giftPosition.y = positionY;
      }else if (col == "X") {
        enemiesPosition.push({x: positionX, y: positionY});
      }
      game.fillText(emoji, positionX, positionY);
    });
  });

  movePlayer();
}

function movePlayer() {
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;

  if (giftCollision) {
    console.log("¡Has recogido el regalo! 🎁");
    levelWin(); // Avanzar al siguiente nivel
    return; // Terminar la función
  }

  const enemiesCollision = enemiesPosition.find((enemy) => {
    const enemyCollisionX = playerPosition.x.toFixed(3) == enemy.x.toFixed(3);
    const enemyCollisionY = playerPosition.y.toFixed(3) == enemy.y.toFixed(3);
    return enemyCollisionX && enemyCollisionY;
  });

  if (enemiesCollision) {
    // Posición de las bombas
    game.fillText(emojis['BOMB_COLLISION'], playerPosition.x, playerPosition.y);
    console.log(`Jugador en posición (${playerPosition.x}, ${playerPosition.y})`);
    setTimeout(() => {
      levelFail(); //Cambia de función aquí para manejar la pérdida de vida
    }, 1000);
    return;
  }
  // Posición del jugador
 game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}
//niveles
function levelWin() {
  console.log("¡Subiste de nivel!");
  level++;
  points += 100; // añadir puntos por completar el nivel
  startGame(); // Iniciar el siguiente nivel
}
//vidas
function levelFail() {
  console.log("¡Perdiste una vida! 💔");
  lives--;// Decremento de vidas
  showLives();// Llama a la función para mostrar vidas restantes
  console.log("Vidas restantes: " + lives);

  if (lives <= 0) {
    //checkHighScore();//Verificar si el jugador tiene un nuevo récord
      level = 0; // Reiniciar el nivel
      lives = 3; // Reiniciar vidas
      points = 0; // Reiniciar puntos
      timeStart = undefined // Reiniciar el tiempo
      console.log("¡Has perdido todas las vidas! 😭")
      playerPosition.x = undefined;
      playerPosition.y = undefined;
      startGame();
     setTimeout(startGame, 1000); // Reiniciar el juego después de un breve retraso
  } else {
     playerPosition.x = undefined;
     playerPosition.y = undefined;
     startGame();
     setTimeout(startGame, 1000); // Reiniciar el juego después de un breve retraso
  }
}
function gameWin() {
  console.log("🏆 ¡Felicitaciones! Has completado el juego 🏆");
  game.fillText(emojis['WIN'], canvasSize/2, canvasSize/2);
  //checkHighScore();//Verificar si el jugador ha obtenido un nuevo récord
  setTimeout(() => {
    level = 0;
    points = 0; // Reiniciar puntos
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
  }, 3000);
}
function showLives() {  // Limpiar el contenido anterior de spanLives
  
  spanLives.innerHTML = "❤️".repeat(lives);// Actualizar el contenido de spanLives para mostrar los corazones
 
}
function showTime() { 
  spanTime.innerHTML = Math.floor((Date.now() - timeStart) / 1000);// mostrar el tiempo
}
function showPoints() { 
  spanPoints.innerHTML = points; // Mostrar puntos en el span 
  console.log("Puntos: " + points); // Mostrar puntos en consola
}
function showLevel() {
  spanLevel.innerHTML = level; // Mostrar nivel en el span
  console.log("Nivel: " + level); // Mostrar nivel en consola
}
// Manejo del récord 
/*function getHighScore() { 
  return localStorage.getItem('highScore') || 0;
}
function setHighScore(newScore) {
  localStorage.setItem('highScore', newScore);
}
function checkHighScore() {
  const highScore = getHighScore();
  if (points > highScore) {
    setHighScore(points);
    console.log('¡Nuevos récord!: ${points');
  }
}
function showHighScore() { 
  const highScore = getHighScore(); 
  spanHighScore.innerHTML = `Récord:  ${highScore}`
}*/
// Eventos de movimiento
window.addEventListener("keydown", movebyKeys);
btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);

function movebyKeys(event) {
  if (event.key == "ArrowUp") moveUp();
  else if (event.key == "ArrowLeft") moveLeft();
  else if (event.key == "ArrowRight") moveRight();
  else if (event.key == "ArrowDown") moveDown();
}
function moveUp() {
  if (playerPosition.y - elementSize < elementSize) {
    console.log("¡Límite del mapa! ⚠️");
  } else {
    playerPosition.y -= elementSize;
    startGame();
  }
}

function moveLeft() {
  if (playerPosition.x - elementSize < elementSize) {
    console.log("¡Límite del mapa! ⚠️");
  } else {
    playerPosition.x -= elementSize;
    startGame();
  }
}

function moveRight() {
  if (playerPosition.x + elementSize > canvasSize) {
    console.log("¡Límite del mapa! ⚠️");
  } else {
    playerPosition.x += elementSize;
    startGame();
  }
}

function moveDown() {
  if (playerPosition.y + elementSize > canvasSize) {
    console.log("¡Límite del mapa! ⚠️");
  } else {
    playerPosition.y += elementSize;
    startGame();
  }
}