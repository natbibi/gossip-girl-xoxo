# LAP-1-Portfolio-Week-Project

[![Netlify Status](https://api.netlify.com/api/v1/badges/d63b47cc-fca6-4c50-ade9-a5ace8eb2ece/deploy-status)](https://app.netlify.com/sites/gossip-girl-xoxo/deploys)
 
# Project description
An anonymous community journaling website aimed at teenagers and high school students. 

# Installation & usage

## Installation
Clone or download the repo.

## Usage
Open the terminal:  
`cd server` 
`npm install`  
Navigate to `index.js`  
Start the server `npm run start`  // currently starts nodemon, remember to switch to node index.js     

In a seperate terminal:  
`cd ../client`  
`npm install`  
`open index.html`  

# Technologies
- HTML, CSS, JavaScript
- DevDependencies: Express, Jest, Cors, Watchify, Concurrently, Giphy SDK, Bundler for CSS(?)

# Process 
1. Start by planning out a plan!!! Use of GitHub Projects to set up a Kanban board and a 'Source of Truth' shared document on Google Docs.
2. Create Figma design plan.
3. Create server side folder and client side folder with testing and relevant pages.

# License

# Bugs
- [x] Deployment issues
- [ ] Posts not showing when sent from mobile devices.
- [ ] Submit button not closing text area
- [ ] Styling.

# Changelog

## Server-side
1. Create tests and download necessary packages 
2. Set up server to connect with local host and create root/routes  
3. Add api testing and model testing
4. Originally planned to use Bootstrap but due to issue with color customisation, decided not to proceed with using Bootstrap as it doesn't seem worth the hassle
5. Deploy to Heroku

## Client-side
1. Download necessary packages
2. Deploy to Netlify
3. Add layout testing
4. Create skeleton of page, add basic functionality, basic styling
6. Add Giphy carousel to post area
7. Add comment button within post, emoji reaction ability and reaction counter


# Wins & Challenges

## Wins
- Discovered how to deploy to Heroku and Netlify from same repository and same branch. Must change path directory if 'index.html' and 'Procfile' are not in the root. 
- Connected API to front end!

## Challenges
- Finding the best strategy to deploy on Heroku and Netlify from the same repository on Github.
- Git flow
- Bootstrap issues - not able to edit colors
- Giphy

Should have:

Screenshots/Images

Could have:

Badges
Contribution guide
Code snippets
Future features
