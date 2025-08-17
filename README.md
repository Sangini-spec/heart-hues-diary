# Heart Hues Diary 💙  

**Heart Hues Diary** is a mental health journal web application designed to promote emotional well-being and self-care. The platform combines journaling, a guided breathing exercise, and AI-powered recommendations to help users relax, reflect, and recharge. The web application also includes a book recommendation system and daily affirmations to keep users motivated and comforted. Users can start journaling either with guided prompts or freely with their own thoughts, helping them build a consistent writing habit and feel emotionally better day by day. 

---

## ✨ Features  
- 📝 **Journaling** – Write and reflect on your daily thoughts, moods, and experiences.  
- 🌬️ **Breathing Exercise** – A calming guided exercise to reduce stress and improve focus.  
- 🤖 **AI Chat Assistant** – Personalized recommendations for:  
  - 🎶 Music & songs to uplift your mood  
  - 🍲 Food suggestions for comfort and wellness  
  - 📍 Places to relax and unwind  
- 🎨 **Comfortable UI/UX** – Clean, user-friendly interface designed to create a calming environment.  
- 🐳 **Dockerized Application** – The web app is fully containerized, making it deployable on any cloud platform and compatible across all systems.  

---

## 🚀 Getting Started  

Follow these steps to run the project locally using Docker.  

### 1. Clone the repository  

git clone https://github.com//Sangini-spec/heart-hues-diary.git

cd heart-hues-diary

### 2. Build the Docker image

docker build -t hearthuesdiary .

### 3. Run the Docker container

docker run -p 8080:8080 hearthuesdiary


## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

Since the app is dockerized, it can be deployed seamlessly on:

- AWS (Elastic Beanstalk, ECS, EKS)
- Google Cloud Run
- Microsoft Azure
- IBM Cloud
- Any Docker-compatible platform

## Live link of the project

Simply open [heart-hues-diary](https://heart-hues-diary.vercel.app/) .
