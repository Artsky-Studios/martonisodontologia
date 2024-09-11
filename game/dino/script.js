document.getElementById("user-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Coletar dados do formulário
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    // Esconder o formulário e exibir o jogo
    document.getElementById("consent-form").style.display = "none";
    document.getElementById("game-container").style.display = "block";

    // Iniciar o jogo
    startGame(name, email);
});

let score = 0;
let isGameRunning = true;

function startGame(playerName, playerEmail) {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 200;

    // Configurações iniciais do dinossauro e obstáculos
    let dino = { x: 50, y: 150, width: 30, height: 30 };
    let obstacles = [];

    function update() {
        if (!isGameRunning) return;
        
        // Atualiza posição do dinossauro e cria novos obstáculos
        score++;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(dino.x, dino.y, dino.width, dino.height);
        
        // Lógica de colisão e movimentação

        // Renderizar pontuação
        document.getElementById('score').textContent = `Pontuação: ${score}`;

        requestAnimationFrame(update);
    }

    update();

    // Quando o jogo termina, salvar pontuação e exibir ranking
    setTimeout(function() {
        isGameRunning = false;
        saveScore(playerName, playerEmail, score);
        displayRanking();
    }, 30000); // Exemplo de jogo por 30 segundos
}

function saveScore(name, email, score) {
    // Simulação de envio para banco de dados
    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    ranking.push({ name, email, score });
    localStorage.setItem("ranking", JSON.stringify(ranking));
}

function displayRanking() {
    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    ranking.sort((a, b) => b.score - a.score);

    let rankingDisplay = "<h3>Ranking</h3><ol>";
    ranking.forEach(player => {
        rankingDisplay += `<li>${player.name} - ${player.score}</li>`;
    });
    rankingDisplay += "</ol>";

    document.getElementById("ranking").innerHTML = rankingDisplay;
}
