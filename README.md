# Alisia - Your Conversational AI Search Partner

![Alisia Logo](client/public/alisia.jpeg)

## Overview

Alisia is a powerful conversational AI application with vast access to latest knowledge that allows users to interact, learn, and play in a chat-based environment. Built using multiple AI techniques including RAG, VectorDB, Embeddings etc. Alisia can search the internet and leverage its extensive knowledge base to provide insightful and relevant responses.

## Features

- **Interactive Chat Interface**: Engage with Alisia in real-time conversations.
- **Web Search Integration**: Access up-to-date information from the internet.
- **Learning and Fun**: Ask questions, learn new things, or simply have fun!

## Table of Contents

- [Alisia - Your Conversational AI Search Partner](#alisia---your-conversational-ai-search-partner)
  - [Overview](#overview)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Technologies Used](#technologies-used)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)

## Technologies Used

- **Frontend**:

  - [Vite](https://vitejs.dev/) - A fast development server.
  - [React](https://reactjs.org/) - A JavaScript library for building user interfaces.

- **Backend**:
  - [FastAPI](https://fastapi.tiangolo.com/) - A modern web framework for building APIs with Python.
- **Others**:
  - [Python](https://www.python.org/) - The programming language used for the backend.
  - [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - The primary language for the frontend.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Python](https://www.python.org/downloads/) (v3.7 or higher)
- [pip](https://pip.pypa.io/en/stable/) - Python package installer

### Installation

1. **Clone the repository**:

```bash
git clone https://github.com/shivvamm/search_with_alisia.git
cd alisia
```

2. **Set up the client**:

```bash
cd client
npm install
```

3. **Set up the server**:

```bash
cd server
pip install -r requirements.txt
```

4. **Run the server**:

```bash
uvicorn main:app --reload
```

5. **_Run the client_**:

```bash
cd client
npm run dev
```

**Now, navigate to http://localhost:3000 in your browser to start interacting with Alisia!**

```bash
Folder Structre
/alisia
├── /client
│   ├── src
│   └── public
│
└── /server
    ├── main.py
    └── requirements.txt
```

**Usage**

- Simply type in your questions or prompts in the chat interface, and Alysia will respond! You can ask for information, engage in casual conversation, or explore various topics.

**Contributing**

- We welcome contributions! If you have suggestions or improvements, feel free to fork the repo and create a pull request. Please ensure your code follows our coding standards and includes relevant tests.
