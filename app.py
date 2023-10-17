from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy import create_engine, Table, MetaData
from sqlalchemy.sql import insert, select
from fastapi.middleware.cors import CORSMiddleware

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

engine = create_engine('sqlite:///chess.db')
metadata = MetaData()

members = Table('members', metadata, autoload_with=engine)

# Get method for returning all members.
@app.get("/members/")
async def read_members():
    with engine.connect() as connection:
        result = connection.execute(select(members))
        all_members = result.fetchall()

    members_dict = [dict(row) for row in all_members]
    
    return members_dict


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

