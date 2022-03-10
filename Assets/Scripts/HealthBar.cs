using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class HealthBar : MonoBehaviour
{
    public Slider HealthSlider;
    public Gradient HealthGradient;
    public Image HealthbarFill;

    public void SetMaxHealth(int health)
    {
        HealthSlider.maxValue = health;
        HealthSlider.value = health;

        HealthbarFill.color = HealthGradient.Evaluate(1f);
    }

    public void SetHealth(int health)
    {
        HealthSlider.value = health;

        HealthbarFill.color = HealthGradient.Evaluate(HealthSlider.normalizedValue);
    }
}
