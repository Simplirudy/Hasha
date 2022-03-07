using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Enemy : MonoBehaviour
{
    private Transform target;
    private int nCurrentWavePointIndex = 0;

    public float speed = 10f;

    // Start is called before the first frame update
    void Start()
    {
        target = WaypointNavigation.Waypoints[0];
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
}
