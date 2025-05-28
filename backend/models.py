#from app import db
from extensions import db

class Anime(db.Model): 
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(100), nullable=False)
    genre = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, nullable=True)

