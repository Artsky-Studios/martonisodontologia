using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using Dan.Main;

public class LeaderboardController : MonoBehaviour
{
    public List<TextMeshProUGUI> nomes;
    public List<TextMeshProUGUI> scores;
    public List<TextMeshProUGUI> cidades;
    public List<TextMeshProUGUI> telefones;

    private string publicKey = "fb29859f95dc736f0cad2ce32580f5fecd1382133aa8644e9a088d80f9ac7a0a";

    private void Start()
    {
        LoadEntries();
    }

    public void LoadEntries()
    {
        Leaderboards.NCRLeaderboader.GetEntries(entries =>
        {
            foreach (TextMeshProUGUI nome in nomes)
            {
                nome.text = "";
            }
            foreach (var score in scores)
            {
                score.text = "";
            }

            foreach (TextMeshProUGUI cidade in cidades)
            {
                cidade.text = "";
            }
            foreach (TextMeshProUGUI telefone in telefones)
            {
                telefone.text = "";
            }

            float length = Mathf.Max(nomes.Count, entries.Length);

            for (int i = 0; i < length; i++)
            {
                nomes[i].text = entries[i].Username;
                scores[i].text = entries[i].Score.ToString();
                //cidades[i].text = entries[i].City;
                //scores[i].text = entries[i].Phone.ToString();
            }
        });
    }

    public void SetEntry(string username, int score)
    {
        Leaderboards.NCRLeaderboader.UploadNewEntry(username, score, isSuccessful =>
        {
            if (isSuccessful)
            {
                LoadEntries();
            }
        }
        );
    }
}
