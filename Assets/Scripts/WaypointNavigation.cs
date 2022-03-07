using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class WaypointNavigation : MonoBehaviour
{
    public static Transform[] Waypoints;

    void Awake()
    {
        Waypoints = new Transform[transform.childCount];

        for (int i=0; i < Waypoints.Length; ++i)
        {
            Waypoints[i] = transform.GetChild(i);
        }
    }

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
