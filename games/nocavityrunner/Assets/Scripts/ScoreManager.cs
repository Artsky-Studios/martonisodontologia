using System;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class ScoreManager : MonoBehaviour
{
    [System.Serializable]
    public struct ScoreEntry
    {
        public string playerName;
        public int score;

        public ScoreEntry(string name, int score)
        {
            this.playerName = name;
            this.score = score;
        }
    }

    private ScoreEntry[] topScores = new ScoreEntry[5];  // Array para armazenar as 5 maiores pontuações

    // Referências para a UI
    public TMP_InputField playerNameInput;  // Campo para o nome do jogador
    //public Text[] scoreTexts;           // Textos na UI para exibir os resultados
    public TextMeshProUGUI[] scoreTexts;

    public Text pontosText;
    void Start()
    {
        LoadScores();  // Carregar as pontuações ao iniciar
        DisplayScores();  // Exibir as pontuações na UI
    }

    // Função para adicionar uma nova pontuação e nome
    public void AddNewScore()
    {
        string newPlayerName = playerNameInput.text;  // Coleta o nome do jogador
        int newScore = int.Parse(pontosText.text);
        //GetNewScore(); // Função fictícia para pegar a nova pontuação; altere conforme necessário

        // Carrega as pontuações
        LoadScores();

        // Verifica se a nova pontuação entra no top 5
        for (int i = 0; i < topScores.Length; i++)
        {
            if (newScore > topScores[i].score)
            {
                // Insere a nova pontuação e empurra as pontuações anteriores
                for (int j = topScores.Length - 1; j > i; j--)
                {
                    topScores[j] = topScores[j - 1];
                }
                topScores[i] = new ScoreEntry(newPlayerName, newScore);
                break;
            }
        }

        // Salva as novas pontuações
        SaveScores();

        // Atualiza a UI
        DisplayScores();
    }

    // Função para salvar as pontuações e nomes no PlayerPrefs
    private void SaveScores()
    {
        for (int i = 0; i < topScores.Length; i++)
        {
            PlayerPrefs.SetString("HighScoreName" + i, topScores[i].playerName);
            PlayerPrefs.SetInt("HighScoreValue" + i, topScores[i].score);
        }
        PlayerPrefs.Save();
    }

    // Função para carregar as pontuações e nomes do PlayerPrefs
    private void LoadScores()
    {
        for (int i = 0; i < topScores.Length; i++)
        {
            string playerName = PlayerPrefs.GetString("HighScoreName" + i, "N/A");  // Se não houver nome, retorna "N/A"
            int score = PlayerPrefs.GetInt("HighScoreValue" + i, 0);  // Se não houver pontuação, retorna 0
            topScores[i] = new ScoreEntry(playerName, score);
        }
    }

    // Função para exibir as pontuações e nomes na UI
    public void DisplayScores()
    {
        for (int i = 0; i < topScores.Length; i++)
        {
            if (i < scoreTexts.Length)
            {
                scoreTexts[i].text = (i + 1) + ". " + topScores[i].playerName + " - " + topScores[i].score;
            }
        }
    }

    // Função fictícia para obter a nova pontuação
    private int GetNewScore()
    {
        // Aqui você pode implementar a lógica para pegar a nova pontuação do jogador
        // Exemplo: se estiver vindo de um sistema de jogo, a pontuação pode ser retornada por outra classe
        return UnityEngine.Random.Range(0, 1000);  // Exemplo com pontuação aleatória
    }

    // Função para resetar as pontuações (opcional)
    public void ResetScores()
    {
        for (int i = 0; i < topScores.Length; i++)
        {
            PlayerPrefs.DeleteKey("HighScoreName" + i);
            PlayerPrefs.DeleteKey("HighScoreValue" + i);
        }
        LoadScores();  // Reinicia os valores para 0
        DisplayScores();  // Atualiza a UI
    }
}
