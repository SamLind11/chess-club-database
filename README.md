# Chess Club Database
This repository contains files for a database-powered web app for small, local or school-based chess clubs.  This app allows club advisors track of your club's members, ratings, and matches.

## Data Structure
This app utilizes stores club data in a SQLite database.  The database contains a **members** table and a **games** table. The **members** table is indexed by a member's id. The **games** table is indexed by the game id, and contains member ids for both white and black, which are foreign keys that reference the members table.  The games table also contains both players' ratings before and after the game, allowing users to track their rating progression over time.

## FastAPI
A FastAPI, written in Python, is used to populate tables on the webpage and update the database.  To run the API, use the command `uvicorn app:app --reload`.

## Members Page
On the Members page, new members can be entered into the database, and will be added to the member list on the page.  New members are automatically assigned a Member ID (primary key) and their "Member Since" date is recorded.
![image](https://github.com/SamLind11/chess-club-database/assets/131621692/7d4e996b-0348-442d-95d3-a7fb7f92cf8b)

## Games Page
On the Games page, users can add completed games with their member IDs and the game's result (optionally, players can include the portable game notation, or PGN, of their game if moves were recorded).  The new game will be added to the table below and players are able to see their updated ELO rating.  New games are assigned a Game ID as their primary key in the games table in the database.
![image](https://github.com/SamLind11/chess-club-database/assets/131621692/478f6186-1dd9-43b3-9aed-173a9577c5d6)


## ELO Ratings
This app utilizes a standard [ELO rating model](https://en.wikipedia.org/wiki/Elo_rating_system) which is common to official chess leagues.  This value allows club members to track their relative strength of play and allows club organizers to create pairings for similarly-rated opponents during tournaments and events.  New members are given a starting rating of 1000.  In most ELO rating systems, there is a K-factor which determines how much a player's rating might change for a single game.  This value might change as a player players more games, making their changes in rating smaller as they approach their "true" rating.  For this app, the K-factor is fixed at 16.  Chess advisors may choose to modify this value to alter the volatility of rating changes per game.

## How to Install
This project is still being developed, and soon there will be instructions for launching your own clone of this app.  The core functionality for the app is currently up and running, so if you're itching to use this app with your club, feel free to clone this repository and start using it!

## Authorship
All code was written and tested by Sam Lind.
