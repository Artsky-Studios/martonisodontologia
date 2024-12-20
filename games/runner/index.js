import Player from "./Player.js";
import Ground from "./Ground.js";
import CactiController from "./CactiController.js";
import Score from "./Score.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_SPEED_START = 1; // 1.0
const GAME_SPEED_INCREMENT = 0.00001;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const PLAYER_WIDTH = 88 / 1.5; //58
const PLAYER_HEIGHT = 94 / 1.5; //62
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_AND_CACTUS_SPEED = 0.5;

const CACTI_CONFIG = [
  { width: 48 / 1.5, height: 100 / 1.5, image: "images/cactus_1.png" },
  { width: 98 / 1.5, height: 100 / 1.5, image: "images/cactus_2.png" },
  { width: 68 / 1.5, height: 70 / 1.5, image: "images/cactus_3.png" },
];

//Game Objects
let player = null;
let ground = null;
let cactiController = null;
let score = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

function createSprites() {
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio
  );

  ground = new Ground(
    ctx,
    groundWidthInGame,
    groundHeightInGame,
    GROUND_AND_CACTUS_SPEED,
    scaleRatio
  );

  const cactiImages = CACTI_CONFIG.map((cactus) => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image: image,
      width: cactus.width * scaleRatio,
      height: cactus.height * scaleRatio,
    };
  });

  cactiController = new CactiController(
    ctx,
    cactiImages,
    scaleRatio,
    GROUND_AND_CACTUS_SPEED
  );

  score = new Score(ctx, scaleRatio);
}

function lockScreenOrientation() {
  // Verifica se a API de orientação está disponível
  if (screen.orientation && typeof screen.orientation.lock === "function") {
    // Tenta bloquear a orientação em paisagem
    screen.orientation.lock("landscape").catch((error) => {
      console.warn("Não foi possível bloquear a orientação: ", error);
    });
  } else {
    console.warn("API de orientação de tela não suportada.");
  }
}

function requestFullscreenAndLockOrientation() {
  // Verifica se a API Fullscreen está disponível
  const elem = document.documentElement; // Usa o elemento principal do documento
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
      .then(() => {
        // Após entrar no modo fullscreen, tenta bloquear a orientação
        lockScreenOrientation();
      })
      .catch((error) => {
        console.warn("Erro ao entrar em modo fullscreen: ", error);
      });
  } else if (elem.webkitRequestFullscreen) {
    // Compatibilidade com navegadores baseados em WebKit (ex.: Safari)
    elem.webkitRequestFullscreen();
    lockScreenOrientation();
  } else {
    console.warn("API de Fullscreen não suportada.");
  }
}

// Detecta se está no mobile e tenta forçar o fullscreen e bloquear a orientação
if (/Mobi|Android/i.test(navigator.userAgent)) {
  requestFullscreenAndLockOrientation();
}

// Opcional: Vincular a um evento de clique caso o navegador não permita fullscreen automático
document.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    requestFullscreenAndLockOrientation();
  }
});

function setScreen() {
  lockScreenOrientation();
  scaleRatio = getScaleRatio();
  const canvasWidth = Math.floor(window.innerWidth * 0.8);
  const canvasHeight = Math.floor(window.innerHeight * 0.8);
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  createSprites();
}

setScreen();
//Use setTimeout on Safari mobile rotation otherwise works fine on desktop
window.addEventListener("resize", () => setTimeout(setScreen, 500));

if (screen.orientation) {
  screen.orientation.addEventListener("change", setScreen);
}

function getScaleRatio() {
  const screenHeight = Math.min(
    window.innerHeight * 0.9,
    document.documentElement.clientHeight * 0.9
  );

  const screenWidth = Math.min(
    window.innerWidth * 0.9,
    document.documentElement.clientWidth
  );

  //window is wider than the game width
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}


function showGameOver() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px 'Press Start 2P', sans-serif`;
  ctx.fillStyle = "FFFFFF";
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText("GAME OVER", x, y);
}

/*function setupGameReset() {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;

    setTimeout(() => {
      window.addEventListener("keyup", reset, { once: true });
      window.addEventListener("touchstart", reset, { once: true });
    }, 1000);
  }
}*/

function saveScoreAndRedirect(score) {
  console.log("Redirecionando para o ranking...");
  console.log("Score:", score);

  // Salva os dados temporariamente e redireciona
  localStorage.setItem("playerScore", score);

  // Redireciona para a página de ranking
  window.location.href = "./ranking.html";
}

function reset() {
  hasAddedEventListenersForRestart = false;
  gameOver = false;
  waitingToStart = false;
  ground.reset();
  cactiController.reset();
  score.reset();
  gameSpeed = GAME_SPEED_START;
}

/*function showStartGameText() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px 'Press Start 2P', sans-serif`;
  ctx.fillStyle = "white";
  const x = canvas.width / 14;
  const y = canvas.height / 2;
  ctx.fillText("Toque na Tela ou Pressione Espaço", x, y);
}*/

function showStartGameText() {
  const fontSize = 13 * scaleRatio;
  ctx.font = `${fontSize}px 'Press Start 2P', sans-serif`;
  ctx.fillStyle = "white";

  // Mensagem de orientação
  const message = "Para uma melhor experiência, jogue em modo paisagem!";
  const startMessage = "Toque na Tela ou Pressione Espaço";

  // Calcular a largura e altura das mensagens
  const messageWidth = ctx.measureText(message).width;
  const startMessageWidth = ctx.measureText(startMessage).width;
  const messageHeight = fontSize * 1.5;  // Estimando a altura do texto
  const startMessageHeight = fontSize * 1.5;

  // Posição centralizada do texto (horizontalmente)
  const x = (canvas.width - Math.max(messageWidth, startMessageWidth)) / 2;

  // Posições verticais para centralizar
  const y = canvas.height / 2 - messageHeight; // Mensagem de orientação
  const startMessageY = y + messageHeight + 10; // Mensagem para iniciar o jogo

  // Tamanho extra para a caixa ao redor do texto
  const padding = 20; // Ajuste o valor para aumentar/diminuir o espaço ao redor do texto

  // Desenhar a caixa para ambas as mensagens
  const boxWidth = Math.max(messageWidth, startMessageWidth) + padding * 2;
  const boxHeight = messageHeight + startMessageHeight + padding * 2;
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Cor de fundo da caixa
  ctx.fillRect(x - padding, y - messageHeight - padding / 2, boxWidth, boxHeight);

  // Desenhar as mensagens de texto
  ctx.fillStyle = "white"; // Cor do texto
  ctx.fillText(message, x, y);
  ctx.fillText(startMessage, x, startMessageY);
}

function updateGameSpeed(frameTimeDelta) {
  gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
}

const backgroundImage = new Image();
backgroundImage.src = "images/background.jpg";

function clearScreen() {
  // Desenha a imagem de fundo
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }
  const frameTimeDelta = currentTime - previousTime;
  previousTime = currentTime;

  clearScreen();

  if (!gameOver && !waitingToStart) {
    //Update game objects
    ground.update(gameSpeed, frameTimeDelta);
    cactiController.update(gameSpeed, frameTimeDelta);
    player.update(gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
    updateGameSpeed(frameTimeDelta);
  }

  if (!gameOver && cactiController.collideWith(player)) {
    gameOver = true;
    //setupGameReset();
    saveScoreAndRedirect(score.score);
    score.setHighScore();
  }

  //Draw game objects
  ground.draw();
  cactiController.draw();
  player.draw();
  score.draw();

  if (gameOver) {
    showGameOver();
  }

  if (waitingToStart) {
    showStartGameText();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", reset, { once: true });
window.addEventListener("touchstart", reset, { once: true });
