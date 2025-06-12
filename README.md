## AnimeNetwork

AnimeNetwork is a full-stack media tracker inspired by MyAnimeList. Users can search anime, view detailed information and manage a personalized shelf of what they're watching or have completed. 
Built using React, Flask, Firebase and the AniList GraphQL API 

Table Of Contents 
- [Motivation](#motivation)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Credits](#credits)

## Motivation 

As a fan of anime and an aspiring full-stack developer, I wanted to build a complete application that mimics the core functionality of a real media tracking site. The goal was to combine modern frontend/backend development with user authentication and personalized experiences.

## Features 
- Search anime by title using the AniList API
- View detailed descriptions, episode info and genres
- Scrollable character lists
- Add anime to your personal watch list
- Personalized profile statistics: total days watched, mean score, recent activity
- Secure authentication using Firebase
- Seasonal and trending anime filters (ex: Airing, Spring 2025)

## Technologies Used 
- Frontend: React, React Router, useState, useEffect
- Backend: Flask, SQLAlchemy
- Authentication: Firebase Auth
- API: AniList GraphQL
- Database: SQLite
- Styling: CSS Grid, Flexbox

## Installation 

1. Clone the Repository
```
bash
git clone https://github.com/yourusername/animeshelf.git
cd animeshelf
```
2. Frontend Setup
```
cd frontend
npm install
npm start
```
3. Backend Setup
```
cd backend
pip install -r requirements.txt
python app.py
```

## Usage 
- Login/Register using Firebase
- Search for any anime by title
- Click on the result to view detailed information
- Add anime to your list and change the status (Watching, Completed, etc.)
- Visit your profile to view anime statistics and recent activity

## Screenshots 


### HomePage

<img src="https://github.com/user-attachments/assets/3aae5788-0ead-4c9f-b4af-fe534a95dbe9" width="600"/>


### Anime Detail Page

<img src="https://github.com/user-attachments/assets/21497d3a-c2f1-41f3-a408-17606d2edfc0" width="600"/> 


### MyList Page

<img src="https://github.com/user-attachments/assets/25b03c93-9faf-457a-b233-fff0b4b2f3ff" width="600"/>


### Profile Stats

<img src="https://github.com/user-attachments/assets/6f29deb9-40f5-468e-a584-1fe00c3848e5" width="600"/>



## Credits 
- AniList GraphQL API
- Firebase Authentication
- Inspired by MyAnimeList
