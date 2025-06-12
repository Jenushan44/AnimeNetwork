from flask import Blueprint, request, jsonify
from firebase_admin import auth
from models import Anime

profile_blueprint = Blueprint("profile", __name__, url_prefix="/profile")

@profile_blueprint.route('', methods=['GET'])
def view_profile(): 
    auth_header = request.headers.get("Authorization")
    if not auth_header:
      return jsonify({"error": "Missing Authorization header"}), 401

    try:
        token = auth_header.split("Bearer ")[1]
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token["uid"]
    except Exception:
        return jsonify({"error": "Invalid token"}), 401

    show_list = Anime.query.filter_by(user_id=uid).all() # Makes sure that each user only sees anime on their account
    
    time_watched = 0
    total_entries = len(show_list)
    episodes_watched = 0
    
    status_counts = {
        "Watching": 0,
        "Completed": 0,
        "On Hold": 0, 
        "Dropped": 0,
        "Plan to Watch": 0
    }

    show_scores = []
    
    
    for show in show_list: 

        episodes = show.episodes or 1 
        duration = show.duration or 24 
        format = show.format or "TV"

        if format == "MOVIE": 
            time_watched += duration 
        else: 
            time_watched += episodes * duration 

        episodes_watched += episodes 


        if isinstance(show.score, int):
          show_scores.append(show.score)

        if show.status in status_counts:
          status_counts[show.status] += 1
    total_days = round(time_watched/1440, 2)
    
    if show_scores:
      mean_score = round(sum(show_scores) / len(show_scores), 2) 
    else: 
      mean_score = 0.0
    
    recent = show_list[-10:][::-1]  # last 10 items, newest first
    recent_data = [
      {
          "id": anime.anilist_id,
          "title": anime.title,
          "coverImage": anime.coverImage
      }
      for anime in recent
    ]
    
    return jsonify({
        "total_days": total_days, # becomes data.total in React with total being the key
        "episodes": episodes_watched, # becomes data.episodes in React with episodes being the key
        "mean_score": mean_score,
        "total_entries": total_entries,
        "episodes_watched": episodes_watched,
        "status_counts": status_counts,
        "recent_entries": recent_data 
        
        }), 200