from flask import Flask
from flask_cors import CORS
from extensions import db
from routes.list_routes import list_blueprint
from routes.profile_routes import profile_blueprint
from routes.anilist_routes import anilist_blueprint
from utils.firebase_admin_setup import auth

import requests

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///animes.db'
db.init_app(app) 

app.register_blueprint(list_blueprint)
app.register_blueprint(profile_blueprint)
app.register_blueprint(anilist_blueprint)

@app.route('/')
def home():
    return "AnimeShelf running"

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
