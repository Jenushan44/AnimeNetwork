from flask import Flask
from flask import jsonify 
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["https://localhost:3000"])

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///animes.db'

db = SQLAlchemy(app) 

class Anime(db.Model): 
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(100), nullable=False)
    genre = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, nullable=True)

@app.route('/')
def home():
    return "AnimeShelf running"

@app.route('/list', methods=['GET'])
def get_list():
    # Gets all the rows from the table 
    show_list = Anime.query.all()

    result = []
    for show in show_list: 
        result.append({
            'id: ': show.id, 
            'Title: ': show.title, 
            'Genre: ': show.genre, 
            'Score: ': show.score
        })
    
    # converts the python code into JSON so the frontend can understand it
    return jsonify(result), 200


# Creates table defined on Anime(db.Model)
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
