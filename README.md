# Chess Club Database
Creating a database powered web app for small, local or school-based chess clubs.  This app allows club advisors track of your club's members, ratings, and matches.

## Data Structure
This app utilizes stores club data in a SQLite database.  The database contains a **members** table and a **games** table: the **members** table is indexed by a member's id.  The **games** table is indexed by the game id, and contains member ids for both white and black, which are foreign keys that reference the members table.  The games table also contains both players' ratings before and after the game, allowing users to track their rating progression over time.

## ELO Ratings
This app utilizes a standard [ELO rating model](https://en.wikipedia.org/wiki/Elo_rating_system) which is common to official chess leagues.  This value allows club members to track their relative strength of play and allows club organizers to create pairings for similarly-rated opponents during tournaments and events.  New members are given a starting rating of 1000.  In most ELO rating systems, there is a K-factor which determines how much a player's rating might change for a single game.  This value might change as a player players more games, making their changes in rating smaller as they approach their "true" rating.  For this app, the K-factor is fixed at 16.  Chess advisors may choose to modify this value to alter the volatility of rating changes per game.

## How to Install
This project is still being developed, and soon there will be instructions for launching your own clone of this app.  The core functionality for the app is currently up and running, so if you're itching to use this app with your club, feel free to clone this repository and start using it!

## Authorship
All code was written and tested by Sam Lind.
