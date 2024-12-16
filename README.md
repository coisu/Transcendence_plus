# Transcendence: The Mighty Pong Contest

Welcome to **Transcendence**, a full-stack web application designed for real-time Pong tournaments. This project focuses on implementing key features such as real-time gameplay, user management, advanced graphics, and robust security while adhering to strict project constraints.

---

## Essential Points

- This project is a **modular implementation** with strict constraints on technology usage and design flexibility.
- Libraries or tools providing an immediate, complete solution for a global feature or module **are prohibited**.
- All third-party tools or libraries must be justified during evaluation to ensure compliance with project constraints.
- It is **mandatory** to meet the specified requirements for each module and justify design decisions during evaluation.

Before coding, carefully plan the architecture of the application, keeping in mind dependencies between modules and imposed constraints. Focus on features rather than reworking uninteresting sub-layers.

---

## Mandatory Requirements

The following requirements must be fulfilled to meet the basic functionality of the project:

1. **Frontend**:
   - Developed using **pure vanilla JavaScript** (with optional enhancement using the FrontEnd module or Graphics module).
   - Must be a **single-page application (SPA)** with support for browser back and forward buttons.
   - No unhandled errors or warnings when navigating the website.
   - Compatible with the latest stable version of **Google Chrome**.

2. **Backend**:
   - If included, the backend must be developed in **pure Ruby** unless overridden by the Backend Framework module.
   - Backend and database integration must comply with the Database module constraints.

3. **Game**:
   - Implement a **Pong game** where users can play against others in real-time.
   - Include a **matchmaking system** for tournaments, displaying player order and announcing the next match.
   - Ensure all players follow the same rules (e.g., identical paddle speed).
   - Maintain the original **essence of Pong (1972)** while allowing aesthetic variations.

4. **Security**:
   - Passwords must be hashed with a strong algorithm.
   - Protect the website from **SQL injections** and **XSS attacks**.
   - All connections must be secured via **HTTPS (or wss)**.
   - User input must be validated both on the frontend and backend.
   - Sensitive information (e.g., credentials, API keys) must be stored securely in a `.env` file and excluded from version control.

5. **Deployment**:
   - The project must be deployed using **Docker**. Launch with:
     ```bash
     docker-compose up --build
     ```

---

## Modules

The project includes both **Mandatory** and **Optional Modules**, allowing for additional features and improvements. To achieve full project completion, at least **7 Major Modules** (or equivalent) are required.

### Completed Modules
| **Category**          | **Type** | **Module Name**                                  |
|-----------------------|----------|--------------------------------------------------|
| Web                   | Major    | Backend Framework (Django)                      |
| Web                   | Minor    | Frontend Framework (Bootstrap)                  |
| Web                   | Minor    | Database Integration (PostgreSQL)               |
| User Management       | Major    | Standard User Management                        |
| Gameplay & UX         | Major    | Remote Players                                  |
| Gameplay & UX         | Major    | Multiple Players                                |
| Gameplay & UX         | Minor    | Game Customization                              |
| Cybersecurity         | Major    | Two-Factor Authentication (2FA) + JWT           |
| Cybersecurity         | Minor    | GDPR Compliance                                 |
| DevOps                | Major    | Backend as Microservices                        |
| Graphics              | Major    | Advanced 3D Graphics (ThreeJS)                  |
| Server-Side Pong      | Major    | Server-Side Logic & API                         |

### Scoring System
- 8 Major Modules = **110%**
- 4 Minor Modules = **20%**
- **Total Completion**: **130%**

---

## Technical Constraints

- **No global feature automation**: Libraries or tools that provide an immediate, complete solution for a feature or module are prohibited.
- **Single-task tools**: Small libraries solving a simple task are allowed (e.g., hashing passwords).
- **Evaluation**: Any tool usage not explicitly mentioned in the subject must be justified.

---




![image](https://github.com/user-attachments/assets/a7a8b2ed-1816-4c9d-8ef9-bf6a5f85fb0f)
![image](https://github.com/user-attachments/assets/fa1d9c14-62bc-4550-a3c0-a1e66ee0fd94)


![image](https://github.com/user-attachments/assets/e9ede878-bcd8-49e7-bf79-d09707dd0cb4)

