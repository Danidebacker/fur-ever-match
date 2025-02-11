# Project Title

Pet Match Finder

## Overview

Pet Match Finder is a full-stack web application designed to help users find their ideal pet by pairing them with adoptable pets based on their preferences. The app utilizes two APIs: one for breed types and another for pets in need of adoption. The matching process is facilitated through a user-friendly quiz.

### Problem Space

Many individuals struggle to find the right pet that matches their lifestyle and the pets grooming needs, leading to mismatched adoptions and, in some cases, pet returns. Shelters also face challenges in placing pets into suitable homes. This application aims to bridge this gap by providing an intelligent, data-driven pet-matching system. It will pair you up with pet that matches their needs and yours.

### User Profile

This can be used for potential pet owners, animal shelters and rescuerrs, pet enthusiasts, and also pet grooming salons. All of which want you to make an informed choice on what kind of dog you could look into adopting or rescuing. For the purpose of this project it will be geared towards grooming salons, as its a big concern when pets arent cared for properly for their grooming needs, and end up back in shelters.

### Features

Some of the feautures i would like to integrate are:
The user questionnaire: Users answer a quiz to determine their ideal pet match.
The pet matching algorithm: Compares quiz results with available pets and suggests the best matches.
Pet listings: Displays information about recommended pets, including breed, shelter location, and adoption details.
User profiles & their past match History: Saves previous matches for users to revisit.

## Implementation

### Tech Stack

The front end will use: react, avios, sass. WHile the backend will use node.js, express, axios, mysql.

### APIs

This project will use 2 api. The Open Dog Registry Api, that provides all breed information inlcuding name of breed, weight, hairlenght, personalitites, and some more. The Petfinder API, will be used to provide real-time data on adoptable pets form shelters.

### Sitemap

So far the sitemap is very simple, in the early stages. I want 6 Pages:
-The Home Page (description of app, and purpose/drive behind the app)

- -User Profile Page (where personal information is stored, as well as past quizes, and past matches)
  -Quiz Page (where users interact via quiz to gain information on the type of dog to best fit their time, their energy, their attention, and their lifestyles)
  -Results Page (displays best type of dog. and then best pet matches)
  -Pet Details Page (more indepth information about the breed and about the dog itself!)

### Mockups

Provide visuals of your app's screens. You can use pictures of hand-drawn sketches, or wireframing tools like Figma.

### Data

Users: Stores user profiles, authentication details, quiz results, and preferences.

Breeds: Contains breed details retrieved from the Open Dog API.

Pets: Stores available pets fetched from the Petfinder API.

Matches: Keeps track of user-pet match history.

### Endpoints (STILL DECIDING ON THIS)

List endpoints that your server will implement, including HTTP methods, parameters, and example responses.
POST /register - Registers a new user.
POST:

- /login - Authenticates an existing user.
- /quiz - Processes user responses and determines best matchesSSS.

GET

- /users/:id - Retrieves user profile information.
- /breeds - Fetches breed data from Open Dog API.
- /pets - Retrieves adoptable pets from Petfinder API.
- /matches/:userId - Fetches past matches for a user.

DIVING DEEPER:
POST:

- /contact/:petId - Sends an adoption inquiry to the respective shelter.

## Roadmap

Scope your project as a sprint. Break down the tasks that will need to be completed and map out timeframes for implementation working back from the capstone due date.
I decided to try and get most done in two weeks with extra dayd can be taken in between or to overestimate how long each component will take.

Week 1-Planning & Setup:
Day 1-3: Finalize project scope and feature set.Set up GitHub repository and project board, and Set up frontend React app and backend Node.js server.
Day 4-5: Establish database schema and create necessary tables in MySQL, and Connect backend to database and test API connections.
Day 6-7: Implement authentication system (register, login, JWT-based authentication).

Week 2-Development & Testing:
Day 8-10: Build quiz page UI and implement questionnaire logic. Implement pet matching algorithm and connect it to breed data API.
Also fetch adoptable pet listings from Petfinder API.
Day 11-13: Build results page to display matched pets.Develop pet details page and link to adoption shelters.
Integrate user profile page to store past matches and preferences.
Day 14: Conduct final testing, fix bugs, and deploy the application.

---

## Future Implementations

All the diving deeper mentioned throught out.
User Authentication: Allow users to create accounts and save matches permanently.Sign Up and or Sign in Page (log in or register page)
Maybe adding a favorites list would be nice to have.
Diving deeper: Shelter Contact Integration as to provides contact information to facilitate adoption inquiries.
iving deeper:
-Contact pages for shelters
Diving deeper: Shelter Contact Integration as to provides contact information to facilitate adoption inquiries.
