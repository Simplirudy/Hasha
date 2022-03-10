using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Enemy : MonoBehaviour
{
    private Transform target;
    private int nCurrentWavePointIndex = 0;

    [Header("Enemy Properties")]
    public float speed = 10f;

    public int MaxHealth = 100;
    private int m_nCurrentHealth = 0;

    public HealthBar healthBar;

    // Start is called before the first frame update
    void Start()
    {
        target = WaypointNavigation.Waypoints[0];

        m_nCurrentHealth = MaxHealth;
        healthBar.SetMaxHealth(MaxHealth);
    }

    // Update is called once per frame
    void Update()
    {
        UpdateEnemyMovement();
    }

    void UpdateEnemyMovement()
    {
        Vector3 dir = target.position - transform.position;
        Vector3 vel = dir.normalized * speed * Time.deltaTime;
        transform.Translate(vel, Space.World);

        transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(vel), Time.deltaTime * 40f);

        if (Vector3.Distance(transform.position, target.position) <= 0.2f)
        {
            GetNextWaypoint();
        }
    }

    void GetNextWaypoint()
    {
        if (nCurrentWavePointIndex == WaypointNavigation.Waypoints.Length - 1)
        {
            Destroy(gameObject);
            return;
        }

        ++nCurrentWavePointIndex;
        target = WaypointNavigation.Waypoints[nCurrentWavePointIndex];
    }

    public void TakeDamage(int nDamage)
    {
        m_nCurrentHealth -= nDamage;

        Debug.Log("we're hitting stuff");
        Debug.Log("Current health is" + m_nCurrentHealth);
        healthBar.SetHealth(m_nCurrentHealth);

        if (m_nCurrentHealth <= 0)
        {
            Die();
        }
    }

    public void Die()
    {
        Destroy(gameObject);
    }
}
