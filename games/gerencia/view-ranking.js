import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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
    const rankingList = document.getElementById("rankingList");
    const deleteAllButton = document.getElementById("deleteAllButton");

    async function displayRanking() {
      rankingList.innerHTML = ""; // Limpa a lista atual
  
      const q = query(collection(db, "ranking"), orderBy("score", "desc")); // Ordena pelo mais recente 
      
      const querySnapshot = await getDocs(q);
  
      // Preenche o ranking com os dados do Firestore
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const listItem = document.createElement("li");
        listItem.classList.add("ranking-item");
        
        // Cria os elementos para exibir nome, telefone e pontuação
        const nameElement = document.createElement("div");
        nameElement.textContent = data.name;

        const phoneElement = document.createElement("div");
        phoneElement.textContent = `Telefone: ${data.phone}`;

        const scoreElement = document.createElement("div");
        scoreElement.textContent = `${data.score} pontos`;

        // Adiciona os elementos ao item da lista
        listItem.appendChild(nameElement);
        listItem.appendChild(phoneElement);
        listItem.appendChild(scoreElement);

        // Cria o botão de exclusão
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir";
        deleteButton.addEventListener("click", async () => {
          if (confirm("Tem certeza que deseja excluir este item?")) {
            await deleteRankingItem(doc.id);
          }
        });

        // Adiciona o botão de exclusão ao item da lista
        listItem.appendChild(deleteButton);
        rankingList.appendChild(listItem);
      });
    }

    async function deleteRankingItem(id) {
      try {
        await deleteDoc(doc(db, "ranking", id));
        alert("Item excluído com sucesso!");
        // Atualiza a lista após a exclusão
        await displayRanking();
      } catch (error) {
        console.error("Erro ao excluir o item:", error);
      }
    }

    async function deleteAllRankingItems() {
      if (confirm("Tem certeza que deseja excluir todos os itens do ranking?")) {
        try {
          const querySnapshot = await getDocs(collection(db, "ranking"));
          querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
          });
          alert("Todos os itens foram excluídos com sucesso!");
          // Atualiza a lista após a exclusão de todos
          await displayRanking();
        } catch (error) {
          console.error("Erro ao excluir todos os itens:", error);
        }
      }
    }

    // Adiciona o evento de clique no botão "Excluir Todos"
    deleteAllButton.addEventListener("click", deleteAllRankingItems);

    // Exibe o ranking ao carregar a página
    await displayRanking();
});
