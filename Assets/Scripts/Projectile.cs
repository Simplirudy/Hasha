using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Projectile : MonoBehaviour
{
    private GameObject m_Target;

    public float projSpeed = 70f;

    public GameObject impactEffect;

    public int Damage = 10;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if (m_Target == null)
        {
            Destroy(gameObject);
            return;
        }

        Vector3 dir = m_Target.transform.position - transform.position;
        float distanceThisFrame = projSpeed * Time.deltaTime;

        if (dir.magnitude <= distanceThisFrame)
        {
            HitTarget();
            return;
        }

        transform.Translate(dir.normalized * distanceThisFrame, Space.World);
    }

    public void Seek(GameObject target)
    {
        m_Target = target;
    }

    public void HitTarget()
    {
        if (m_Target != null)
        {
            m_Target.GetComponent<Enemy>().TakeDamage(Damage);
            GameObject effectInstance = (GameObject)Instantiate(impactEffect, transform.position, transform.rotation);
            Destroy(effectInstance, 2f);

            Destroy(gameObject);
        }
    }
}
