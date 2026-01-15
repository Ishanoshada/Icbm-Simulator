# STRAT-X ICBM | Advanced Ballistic Trajectory Simulator

<center>

![STRAT-X Header](/imgs/2.png)


</center>

**STRAT-X ICBM** is a high‑fidelity, interactive 3D ballistic trajectory simulation platform built with **React** and **Three.js**.
The project is designed as a **geospatial and kinematic exploration tool**, allowing users to study how **launch location, latitude, and global positioning** influence ballistic reach, arrival timing, and impact energy.

While the simulation includes the **Indian Ocean Geoid Low (IOGL)** as a scientific reference, STRAT‑X is **not limited to gravity analysis alone**. Its primary strength lies in evaluating **geographical launch positioning** and **global reach optimization**.

---

## 🌐 Live Demo

Experience the simulation:️
👉 [https://icbm-attack.ishanoshada.com/](https://icbm-attack.ishanoshada.com/)

---


<center>

![STRAT-X 1](/imgs/1.png)


</center>


## 🚀 Strategic Overview

STRAT‑X functions as a **Geospatial Reach Assessment Simulator**, not a real‑world weapons model.

It enables users to explore:

* How **launch latitude and longitude** affect global coverage
* How centrally located positions (such as Sri Lanka in the Indian Ocean) reduce average distance to multiple continents
* How trajectory geometry influences arrival time and kinetic energy

### ⚠️ Important Clarification

> This simulator **does not claim** that real‑world missile performance is meaningfully improved by local gravity anomalies.
> The Indian Ocean Geoid Low is included **for educational visualization**, not as a practical military advantage.

---



<center>

![STRAT-X 3](/imgs/3.gif)


</center>


## 🎯 Key Simulation Objectives

### 1️⃣ Geographical Positioning Advantage (Primary Focus)

STRAT‑X can be used **even without considering gravity anomalies** to:

* Compare launch sites purely based on **global centrality**
* Identify positions that minimize average flight distance to:

  * Asia
  * Europe
  * Middle East
  * Africa
  * Americas
  * Oceania
* Evaluate arrival‑time symmetry across multiple regions

📌 *This makes STRAT‑X useful as a general **global launch‑position analysis tool**, not just a gravity experiment.*

---

### 2️⃣ Kinematic Sensitivity Visualization (Secondary / Educational)

The simulation includes adjustable gravity parameters to demonstrate how **kinematic equations respond** to changes in `g`.

> Note: These effects are **intentionally exaggerated** to make otherwise imperceptible differences visible in a real‑time 3D simulation.

---

### 3️⃣ Comparative Reach Profiling

* Side‑by‑side comparison between different launch nodes
* Energy delivery and arrival‑time deltas
* Target‑specific optimal launch analysis

---

## 🔬 Scientific Fidelity vs. Simulation Scaling

Real‑world gravitational variations such as the **Indian Ocean Geoid Low** have an **extremely small effect** on ballistic trajectories. To allow users to visually understand the concept, STRAT‑X scales these values beyond their real‑world magnitude.

### Realistic vs Simulated Comparison

| Metric                 | Realistic Value | STRAT‑X Simulation Value |
| ---------------------- | --------------- | ------------------------ |
| **Hambantota Gravity** | ≈ 9.8095 m/s²   | 9.78 m/s²                |
| **Gravity Delta (Δg)** | ≈ 0.0005 m/s²   | 0.01 m/s²                |
| **Resulting ΔV Gain**  | ≈ 0.02% – 0.03% | ~0.50% (visualized)      |

**Summary:**
In reality, the geoid low provides **no meaningful operational advantage**.
In STRAT‑X, values are **scaled up intentionally** to demonstrate *how* gravity terms appear in kinematic equations.

---

## 🧭 Launch Site Modeling Philosophy

STRAT‑X should be understood as:

* ❌ **Not** a real ICBM performance predictor
* ❌ **Not** a military planning tool
* ✅ A **geographical physics visualizer**
* ✅ A **launch‑position optimization simulator**
* ✅ A **3D educational platform for global trajectory reasoning**

> Even **without** the “low‑g” concept, STRAT‑X remains valid as a tool to study **why some locations are mathematically better positioned for global reach than others**.

---

## 🛠 Technical Stack

* **Frontend**: React 19 (ES6 Modules)
* **3D Engine**: Three.js via `@react-three/fiber` & `@react-three/drei`
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Physics Model**:

  * Simplified kinematic equations
  * Quadratic Bezier curves for atmospheric and exo‑atmospheric arc visualization

---

## 📊 Simulation Parameters

| Variable          | Value     | Description                          |
| ----------------- | --------- | ------------------------------------ |
| **Booster Mass**  | 20,000 kg | Standardized dry mass (simulated)    |
| **Engine Thrust** | 350,000 N | Multi‑stage propulsion approximation |
| **Burn Time**     | 180 s     | Powered ascent phase                 |
| **Globe Radius**  | 5 Units   | Normalized 3D Earth scale            |

---

## ⚠️ Disclaimer

This project is strictly for **educational, research, and visualization purposes**.

* Physical values are simplified and exaggerated
* Gravity anomalies are used conceptually
* Results **must not** be interpreted as real‑world military data

STRAT‑X is intended to spark curiosity about **geophysics, global positioning, and trajectory visualization**, not to model real weapons systems.

---

## 👨‍💻 Author

**Ishan Oshada**
🌐 [https://ishanoshada.com](https://ishanoshada.com)
🐙 [https://github.com/ishanoshada](https://github.com/ishanoshada)

---

## 📄 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.

---

*Built with precision, curiosity, and respect for real‑world physics.*


