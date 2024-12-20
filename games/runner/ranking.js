import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDMLJca_ivK4jMefyDLeM2Tli4PKAlbFTw",
    authDomain: "no-cavity-runner-1e883.firebaseapp.com",
    databaseURL: "https://no-cavity-runner-1e883-default-rtdb.firebaseio.com",
    projectId: "no-cavity-runner-1e883",
    storageBucket: "no-cavity-runner-1e883.firebasestorage.app",
    messagingSenderId: "158899340861",
    appId: "1:158899340861:web:02b00d6e0056d894e04c54",
    measurementId: "G-7Q5W15M65S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
    const score = localStorage.getItem("playerScore"); // Recupera a pontuação salva
    const playerScoreDisplay = document.getElementById("playerScore"); // Elemento para exibir a pontuação
  
    // Atualiza a exibição da pontuação na página
    if (playerScoreDisplay && score) {
      playerScoreDisplay.textContent = Math.floor(score);
    }
    const form = document.getElementById("playerForm");
    const rankingList = document.getElementById("rankingList");
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      // Captura os valores do formulário
      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;
  
      try {
        // Salva os dados no Firestore, incluindo a pontuação como texto
        await addDoc(collection(db, "ranking"), {
          name,
          phone,
          score: Math.floor(score),
          timestamp: new Date(),
        });
  
        alert("Pontuação salva com sucesso!");
  
        // Exibe o ranking atualizado
        await displayRanking();
  
        // Após 10 segundos, redireciona para a página principal
        setTimeout(() => {
          window.location.href = "runner.html"; // Altere para o caminho correto da sua página principal
        }, 5000);
      } catch (error) {
        console.error("Erro ao salvar pontuação:", error);
      }
    });
  
    async function displayRanking() {
      rankingList.innerHTML = ""; // Limpa a lista atual
  
      const q = query(collection(db, "ranking"), orderBy("score", "desc")); // Ordena pelo mais recente 
      
      const querySnapshot = await getDocs(q);
  
      // Preenche o ranking com os dados do Firestore
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const listItem = document.createElement("li");
        listItem.textContent = `${data.name} - ${data.score} pontos`;
        rankingList.appendChild(listItem);
      });
    }
  
    // Exibe o ranking ao carregar a página
    await displayRanking();
  });
