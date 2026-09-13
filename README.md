# 🛡️ Surakhsa OS

 An AI-powered disaster preparedness and emergency response platform for schools and colleges.

# 📌 Overview

Surakhsa OS is a digital safety platform designed to help educational institutions prepare students and staff for disasters before they happen.

Instead of treating disaster preparedness as a one-time activity, Surakhsa OS combines:

- 📚 Interactive disaster education
- 🎮 Gamified learning
- 🚨 Emergency alerts
- 🧑‍🏫 Teacher and administrator dashboards
- 🏫 School-specific evacuation plans
- 🗺️ Digital evacuation maps
- 🧪 Virtual disaster simulations
- 🔥 Real-time emergency/drill mode
- 📊 Preparedness and performance analytics
- 📱 Offline access to critical safety information

The goal is simple:
Learn → Practice → Prepare → Respond**

---

# 🎯Problem

Students and staff are often taught disaster procedures theoretically, but they may not know how to react during an actual emergency.

Surakhsa OS provides a platform where users can:

1. Learn what to do during different disasters.
2. Practice decisions through interactive simulations.
3. Participate in school-wide emergency drills.
4. Receive clear emergency instructions.
5. Follow location-specific evacuation routes.
6. Track preparedness and identify weak areas.

---

# 🚀Key Features

# 📚 Interactive Learning

Students can learn about different disasters through structured modules and scenario-based lessons.

Examples:

- Fire
- Flood
- Earthquake
- Cyclone
- Other disaster scenarios

# 🎮 Gamified Preparedness

Learning is made interactive using:

- XP
- Levels
- Scores
- Badges
- Progress tracking
- Scenario-based challenges

This encourages students to repeatedly practice safety procedures.

# 🧪 Virtual Disaster Simulations

Students can enter simulated emergency situations and make decisions.

Example:
# 🔥 FIRE DETECTED

You are in Block B, Floor 2.

The nearest staircase is blocked.

What do you do?

[ Use Staircase A ]
[ Use Elevator ]
[ Wait for Instructions ]

# System Architecture

                    ┌─────────────────┐
                    │    Students     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │     Teachers    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │      Admin      │
                    └────────┬────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Surakhsa OS API   │
                  │   Backend Services  │
                  └──────────┬──────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌────────────┐
        │ Database │   │ AI/ML    │   │ Notifications│
        └──────────┘   └──────────┘   └────────────┘

# Main Modules: 
                Surakhsa OS
                │
                ├── Authentication
                │
                ├── Student
                │   ├── Dashboard
                │   ├── Learning
                │   ├── Simulations
                │   └── Results
                │
                ├── Teacher
                │   ├── Classes
                │   ├── Student Analytics
                │   └── Drills
                │
                ├── Administration
                │   ├── School Setup
                │   ├── Disaster Scenarios
                │   ├── Drill Management
                │   └── Emergency Control
                │
                ├── Emergency Mode
                │
                ├── Notifications
                │
                ├── Analytics
                │
                └── Offline Support
