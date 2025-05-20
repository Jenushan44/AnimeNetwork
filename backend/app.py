from flask import Flask
from flask import request, abort 
from flask import jsonify 
from flask_cors import CORS
from models import Anime 
from extensions import db
import requests

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///animes.db'

db.init_app(app) 

@app.route('/')
def home():
    return "AnimeShelf running"

@app.route('/list', methods=['GET'])
def get_list():
    # Fetches data from the database 
    show_list = Anime.query.all()
    result = []
    for item in show_list: 
        result.append({
            'id': item.id, 
            'Title': item.title, 
            'Genre': item.genre, 
            'Score': item.score
        })
    return jsonify(result), 200

@app.route('/list', methods=['POST'])
def add_list():
    # Gets JSON data from body of incoming HTTP request to store in data variable 
    data = request.get_json()
    new_item = Anime(
        title=data['title'],
        genre=data['genre'],
        score=data['score']
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'Anime entry added'}), 201 

@app.route('/list/<int:show_id>', methods=['DELETE'])
def delete_list(show_id):
    # Find anime entry in database with id 
    item = Anime.query.get(show_id)
    if not item:
        abort(404, description="Anime not found") 
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Anime deleted'}), 200

@app.route('/search', methods=['GET'])
def show_anime():
    title = request.args.get('title')
    
    
    query = f"""
    {{
        Media(search: "{title}") {{
        title {{ romaji }}
        episodes
        format 
        coverImage {{ large }}
        }}
    }}
    """
    mydict = {"query": query}
    headers = {"Content-Type": "application/json"}
    response = requests.post(
        "https://graphql.anilist.co",
        json=mydict,
        headers=headers
    )

    data = response.json()
    return jsonify(data), 200
 

# Creates table defined on Anime(db.Model)
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
