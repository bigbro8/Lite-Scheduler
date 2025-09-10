# Lite Scheduler(Under development)

A web-based application for generating automatic course schedules for universities.  
It considers teacher availability, preferences, and fairness while minimizing conflicts and scheduling penalties.

## Features
- **Teacher Availability**  
  - Explicit availability: teachers choose specific days.  
  - Implicit availability: teachers specify number of days but not which ones.  
- **Conflict Management**  
  - Prevents overlapping classes for the same semester.  
- **Preferences**  
  - Honors time-of-day preferences (e.g., morning classes).  
  - Reduces idle gaps between teacher classes.  
- **Penalty System**  
  - Large penalty for overlaps.  
  - Additional penalties for violating preferences and creating gaps.  
- **Algorithm Options**  
  - Deterministic (no randomness).  
  - Randomized (to explore more solutions).  

## Project Structure
- `algorithm.js` – core scheduling logic.
- Based on MVC architecture
