from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Table, MetaData
from sqlalchemy.sql import insert, select, update
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

# Handling CORS errors.
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://127.0.0.1:5500'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define model for new member.
class Member(BaseModel):
    firstName: str
    lastName: str
    rating: float
    gamesPlayed: int
    dateOfBirth: str
    dateJoined: str

# Define model for new game.
class Game(BaseModel):
    datePlayed: str
    whiteId: int
    blackId: int
    whiteScore: float
    blackScore: float
    whiteOldRating: float
    whiteNewRating: float
    blackOldRating: float
    blackNewRating: float
    pgn: Optional[str]

engine = create_engine('sqlite:///chess.db')
metadata = MetaData()

members = Table('members', metadata, autoload_with=engine)
games = Table('games', metadata, autoload_with=engine)

# Get method for returning all members.
@app.get("/members/")
async def read_members():
    with engine.connect() as connection:
        result = connection.execute(select(members))
        all_members = result.fetchall()

    members_dict = [dict(row) for row in all_members]
    
    return members_dict

# Get method that returns one member by their id.
@app.get("/members/{member_id}", response_model=Member)
async def read_one_member(member_id):
    with Session(engine) as session:
        member = session.query(members).filter_by(id=member_id).first()

        if member is None:
            raise HTTPException(status_code=404, detail="Member not found")
        return member


# Post method for adding members to the database.
@app.post("/members/")
def create_member(member: Member):
    with engine.connect() as connection:
        result = connection.execute(insert(members).values(
                                firstName=member.firstName, 
                                lastName=member.lastName, 
                                rating=member.rating, 
                                gamesPlayed=member.gamesPlayed, 
                                dateOfBirth=member.dateOfBirth, 
                                dateJoined=member.dateJoined))
        return {"id": result.inserted_primary_key[0]}

# Post method for adding a new game to the 'games' table.
@app.post("/games/")
def create_game(game: Game):
    with engine.connect() as connection:
        # Add new game to the games table.
        result = connection.execute(insert(games).values(
            datePlayed=game.datePlayed,
            whiteId=game.whiteId,
            blackId=game.blackId,
            whiteScore=game.whiteScore,
            blackScore=game.blackScore,
            whiteOldRating=game.whiteOldRating,
            whiteNewRating=game.whiteNewRating,
            blackOldRating=game.blackOldRating,
            blackNewRating=game.blackNewRating,
            pgn=game.pgn))
        
        # Update each player's rating and gamesPlayed column in the members table.
        connection.execute(update(members) 
                            .where(members.c.id == game.whiteId)
                            .values(rating=game.whiteNewRating,
                                    gamesPlayed=members.c.gamesPlayed + 1))
        connection.execute(update(members) 
                            .where(members.c.id == game.blackId)
                            .values(rating=game.blackNewRating,
                                    gamesPlayed=members.c.gamesPlayed + 1))
    return {"id": result.inserted_primary_key[0]}