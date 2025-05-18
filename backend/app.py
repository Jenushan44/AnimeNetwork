from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["https://localhost:8080"])

db = SQLAlchemy(app) 

class Anime(db.Model): 
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(100), nullable=False)
    genre = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, nullable=True)

@app.route('/')
def home():
    return "AnimeShelf running"

# Creates table defined on Anime(db.Model)
with app.app_context():
    db.create_all()
