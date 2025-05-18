from flask import Flask, render_template, request, redirect
#from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


media_list = [
    {"id": 1, "title": "Attack on Titan"},
    {"id": 2, "title": "Fullmetal Alchemist"}
]

@app.route('/')
def home():
    return "AnimeShelf backend is running!"

@app.route('/media', methods=['GET'])
def get_media():
    return jsonify(media_list)

if __name__ == '__main__':
    app.run(debug=True, port=8080)
