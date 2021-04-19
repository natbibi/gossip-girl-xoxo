# Project: Gossip-Girl-xoxo 

📝 [![Netlify Status](https://api.netlify.com/api/v1/badges/d63b47cc-fca6-4c50-ade9-a5ace8eb2ece/deploy-status)](https://app.netlify.com/sites/gossip-girl-xoxo/deploys)  🚀  ![Heroku](https://pyheroku-badge.herokuapp.com/?app=gossip-girl-api&style=flat)  ⚖️  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

https://gossip-girl-xoxo.netlify.app/

A Gossip Girl inspired app with client and server integration where users can post entries of up to 300 characters and a gif. Users can engage with the content using reactions and comments.
 
# Description
XOXO is an anonymous community journaling website aimed at teenagers and high school students based on hit tv series Gossip Girls. With growing privacy concerns on current social media platforms and messaging apps, XOXO aims to provide a safe space for individuals to freely share their thoughts without having to worry about having their identity exposed.

<img alt="gossip-girl-lightmode" src="https://user-images.githubusercontent.com/58271566/114214712-958cb680-995c-11eb-9172-1100b83c5f74.PNG" height="650px"><img alt="gossip-girl-darkmode" src="https://user-images.githubusercontent.com/58271566/114214723-9887a700-995c-11eb-9267-1cb8c37a1f53.PNG" height="650px">


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
### Dependencies: 
   - Server: 
   cors, moment, body-parser, express
   
   - Client: 
   giphy/js-components, giphy/js-fetch-api 

### DevDependencies:
   - Server: 
   jest, supertest, nodemon
   
   - Client: 
   watchify, concurrently, jest, jest-fetch-mock, coverage

# Process 
1. Start by planning out a plan!!! Use of GitHub Projects to set up a Kanban board and a 'Source of Truth' shared document on Google Docs.
2. Create Figma design plan.
3. Create server side folder and client side folder with testing and relevant pages.
4. Peer coding, drive and navigation, and splitting up tasks.

# Bugs
- [x] Deployment issues
- [x] Posts not showing when sent from mobile devices.
- [x] Submit button not closing text area
- [x] Styling
- [x] Comment submit button not functioning 
- [x] Comment submit button can be pressed multiple times and each click will bring up new comment textarea
- [x] Date and time 

# Changelog

## Server-side
1. Create tests and download necessary packages 
2. Set up server to connect with local host and create root/routes  
3. Add api testing and model testing
4. Originally planned to use Bootstrap but due to issue with color customisation, decided not to proceed with using Bootstrap as it doesn't seem worth the hassle
5. Deploy to Heroku
6. Date and time to show relative time rather than time of post 
7. Sort by hot (most reactions) or sort by new posts.
8. Add routes for sorting posts by time and by reaction count
9. Increase testing coverage
10. Add error handling and error messages

## Client-side
1. Download necessary packages
2. Deploy to Netlify
3. Add layout testing, DOM testing and mock testing
4. Create skeleton of page, add basic functionality, basic styling
6. Add Giphy carousel to post area
7. Add comment textarea and submit button within post, emoji reaction ability and reaction counter
8. Function to pick random font for each entry
9. Dark mode
10. Share button to copy link of post
11. Add labels for if there are no comments, one comment, or multiple comments on a post
12. Remove giphy functionality (user can cancel add giphy)
13. Add About page which links to and from homepage


# Wins & Challenges

## Wins
- Discovered how to deploy to Heroku and Netlify from same repository and same branch. Must change path directory if 'index.html' and 'Procfile' are not in the root. 
- Connected API to front end!
- Having a functioning and visually appealing page that looks amazing on most popular smart phones.
- Meeting our own deadlines
- Hot or New sorting! (See code snippet below)

![Screen Shot 2021-03-19 at 12 54 00](https://user-images.githubusercontent.com/58271566/114215205-3aa78f00-995d-11eb-9aca-d1b130378b0f.png)


## Challenges
- Finding the best strategy to deploy on Heroku and Netlify from the same repository on Github.
- Git flow
- Bootstrap issues - not able to edit colors
- Selecting and posting Giphy
- Testing Giphy functions 
- Organisation of functions not set out well for testing

# Future Features 
- Reply with a Giphy in comments
- Save favourite posts
- Order by user's favourite posts
- Choose from more selection of emojis as a reaction
- Ability to search through posts  
- Report other posts (e.g if not appropriate)

[![Screen-Shot-2021-03-19-at-16-28-40.png](https://i.postimg.cc/tC71qLnN/Screen-Shot-2021-03-19-at-16-28-40.png)](https://postimg.cc/4mk4w25Y)
