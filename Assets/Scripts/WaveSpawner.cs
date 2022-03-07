using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class WaveSpawner : MonoBehaviour
{
    public Transform enemy;
    public Transform spawnPoint;
    public float fTimeBetweenWaves = 5f;
    public Text WaveCountdownText;

    //private
    private float fCountdown = 2f;
    private int nCurrentWaveNumber = 1;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if (fCountdown <= 0)
        {
            StartCoroutine(SpawnWave());
            fCountdown = fTimeBetweenWaves;
        }

        fCountdown -= Time.deltaTime;
        WaveCountdownText.text = Mathf.Floor(fCountdown).ToString();
    }

    IEnumerator SpawnWave()
    {
        for (int i = 0; i < nCurrentWaveNumber; ++i)
        {
            SpawnEnemies();
            yield return new WaitForSeconds(0.5f);
        }

        ++nCurrentWaveNumber;
    }

    void SpawnEnemies()
    {
        Instantiate(enemy, spawnPoint.position, spawnPoint.rotation);
    }

}
