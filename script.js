const wireCount = 6; // Nombre de fils
const bombWires = 2; // Nombre de fils rouges (bombes)
let wires = [];
let gameOver = false;
let cutSafeWires = 0;

//empeche dafficher F12
(function () {
  let disabled = true; // Active la protection
  let realConsoleLog = console.log;

  console.log = function () {
    if (!disabled) realConsoleLog.apply(console, arguments);
  };

  // Désactive F12 et le clic droit
  document.addEventListener("keydown", function (e) {
    if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
      e.preventDefault();
    }
  });

  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
})();
function initGame() {
  gameOver = false;
  cutSafeWires = 0;
  document.getElementById("message").textContent = "";

  // Reset container
  let bombContainer = document.getElementById("bomb");
  bombContainer.innerHTML = "";

  // Générer une liste de fils (gray par défaut)
  wires = Array(wireCount).fill("safe");

  // Ajouter des bombes aléatoirement
  let placedBombs = 0;
  while (placedBombs < bombWires) {
    let randomIndex = Math.floor(Math.random() * wireCount);
    if (wires[randomIndex] !== "bomb") {
      wires[randomIndex] = "bomb";
      placedBombs++;
    }
  }

  // Générer les fils dans le HTML
  for (let i = 0; i < wireCount; i++) {
    let wire = document.createElement("div");
    wire.classList.add("wire");
    wire.dataset.index = i;
    wire.addEventListener("click", cutWire);
    bombContainer.appendChild(wire);
  }
}

function cutWire() {
  if (gameOver) return;

  let index = this.dataset.index;
  if (this.classList.contains("cut")) return; // Ne pas couper deux fois le même fil

  this.classList.add("cut");

  if (wires[index] === "bomb") {
    this.classList.add("bomb");
    document.getElementById("message").textContent =
      "💥 BOOM ! Mauvais fil coupé ! GAME OVER.";

    // 🔊 Joue le son d'explosion
    let explosionSound = document.getElementById("explosionSound");
    explosionSound.currentTime = 4.5;
    explosionSound.play();
    gameOver = true;
  } else {
    this.classList.add("safe");
    cutSafeWires++;
    if (cutSafeWires === wireCount - bombWires) {
      document.getElementById("message").textContent =
        "✅ Bravo ! Bombe désamorcée !";
      gameOver = true;
    }
  }
}

function restartGame() {
  explosionSound.pause();
  explosionSound.currentTime = 4.5;
  initGame();
}

initGame();
