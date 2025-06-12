from flask import Blueprint, request, jsonify
from firebase_admin import auth
from models import Anime
from extensions import db
from flask_cors import cross_origin


list_blueprint = Blueprint("list", __name__, url_prefix="/list")

@list_blueprint.route('', methods=['GET'])
@cross_origin(origin='http://localhost:3000', supports_credentials=True)
def get_list():
    
    auth_header = request.headers.get("Authorization") # gets the authorization header from the incoming request
    if not auth_header: 
      return jsonify({"error": "Missing Authorization header"}), 401
    
    try: 
        token = auth_header.split("Bearer ")[1]  # splits the string to take just the token
        decoded_token = auth.verify_id_token(token) # Gives an error if token is invalid
        uid = decoded_token['uid']
    except Exception as e: 
        return jsonify({"error": "Invalid token"}), 401


    # Fetches data from the database 
    show_list = Anime.query.filter_by(user_id=uid).all()
    result = []
    for item in show_list: 
        result.append({
            'id': item.id, 
            'title': item.title, 
            'genre': item.genre, 
            'score': item.score,
            'status': item.status,
            'coverImage': item.coverImage,
            'anilist_id': item.anilist_id,
            'format': item.format,
            "created_at": item.created_at.isoformat()        
        })
    return jsonify(result), 200

@list_blueprint.route('', methods=['POST'])
def add_list():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
      return jsonify({"error": "Missing Authorization header"}), 401

    try:
        token = auth_header.split("Bearer ")[1]
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
    except Exception as e:
        return jsonify({"error": "Invalid token"}), 401

    # Gets JSON data from body of incoming HTTP request to store in data variable 
    data = request.get_json()

    # Checks if anime is already in user list
    existing = Anime.query.filter_by(user_id=uid, anilist_id=data["anilist_id"]).first()
    if existing:
        return jsonify({"error": "Anime already in your list"}), 409

    new_item = Anime(
        title=data['title'],
        genre=data['genre'],
        score=data['score'],
        status=data.get("status", "Watching"),
        episodes=data["episodes"],
        coverImage=data["coverImage"],
        anilist_id=data["anilist_id"],
        format=data.get("format", "TV"),
        user_id=uid,
        duration=data.get("duration", 24)
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'Anime entry added'}), 201 

@list_blueprint.route('/<int:show_id>', methods=['DELETE'])
def delete_list(show_id):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
      return jsonify({"error": "Missing Authorization header"}), 401

    try:
        token = auth_header.split("Bearer ")[1]
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token["uid"]
    except Exception:
        return jsonify({"error": "Invalid token"}), 401


    

    item = Anime.query.get(show_id) # Find anime entry in database with id 
 
    if not item:
      return jsonify({"error": "Anime not found"}), 404

        # Check that the anime belongs to the current user
    if item.user_id != uid:
      return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(item) # deletes show entry with same anime id
    db.session.commit() # commit changes to database 

    return jsonify({'message': 'Anime deleted'}), 200



@list_blueprint.route('/<int:show_id>', methods=['PUT'])
def update_score(show_id):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
      return jsonify({"error": "Missing Authorization header"}), 401

    try:
        token = auth_header.split("Bearer ")[1]
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token["uid"]
    except Exception:
        return jsonify({"error": "Invalid token"}), 401

    data = request.get_json()
    item = Anime.query.get(show_id)

    if not item:
        return jsonify({"error": "Anime not found"}), 404

    if item.user_id != uid:
        return jsonify({"error": "Unauthorized"}), 403

    item.score = data.get("score", item.score)
    item.status = data.get("status", item.status)

    db.session.commit()

    return jsonify({"message": "Anime updated"}), 200


