# 🧠 NeuroLingo: Emotion Analysis System

![Status](https://img.shields.io/badge/Status-In%20Development-orange)
![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Python-blueviolet)
![License](https://img.shields.io/badge/License-MIT-green)

A full-stack AI application that detects human emotions from textual input using a **Deep Learning (LSTM)** model. 

Unlike standard monolithic apps, this project demonstrates a **Microservices Architecture**: it uses a high-performance **Python** service for inference and a scalable **Node.js** backend for application logic and data persistence.

## 🏗️ Architecture

The system consists of three distinct layers communicating via REST APIs:

1.  **AI Service (Python/Flask):** Loads the trained LSTM model and exposes a `/predict` endpoint.
2.  **Backend Gateway (Node.js/Express):** Handles API requests, manages MongoDB logging, and communicates with the AI service.
3.  **Frontend (React - In Progress):** A Cyberpunk-themed UI for real-time interaction.

```mermaid
graph LR
    User[User / React Client] -- JSON --> Node[Node.js Backend]
    Node -- Save History --> DB[(MongoDB)]
    Node -- "Predict(Text)" --> Python[Python Flask AI]
    Python -- "Emotion: Joy (98%)" --> Node
    Node -- Final Response --> User
