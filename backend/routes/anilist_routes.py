from flask import Blueprint, request, jsonify
from datetime import datetime
import requests

anilist_blueprint = Blueprint("anilist", __name__, url_prefix="/anilist")

def get_season_year(season): 
    month = datetime.now().month
    year = datetime.now().year 
    season = season.upper()

    if season == "WINTER": 
        if month < 1: 
            return year - 1
        else: 
            return year 
    
    elif season == "SPRING": 
        if month < 4: 
            return year - 1
        else: 
            return year 
    
    elif season == "SUMMER": 
        if month < 7: 
            return year -1 
        else: 
            return year
    
    elif season == "FALL": 
        if month < 10: 
            return year - 1 
        else: 
            return year
    else:
        return year

def get_next_season():
    month = datetime.now().month
    year = datetime.now().year

    if 1 <= month <= 3:
        return "SPRING", year
    elif 4 <= month <= 6:
        return "SUMMER", year
    elif 7 <= month <= 9:
        return "FALL", year
    elif 10 <= month <= 12:
        return "WINTER", year + 1


@anilist_blueprint.route('/trending', methods=['GET'])
def get_trending():
    query = '''
    query {
      Page(perPage: 10) {
        media(sort: TRENDING_DESC, type: ANIME) {
          id
          title {
            romaji
          }
          genres
          description(asHtml: false)
          bannerImage
          coverImage {
            large
            extraLarge
          }
          format
        }
      }
    }
    '''
    headers = {"Content-Type": "application/json"}
    response = requests.post("https://graphql.anilist.co", json={"query": query}, headers=headers)
    return jsonify(response.json())

@anilist_blueprint.route('/airing', methods=['GET'])
def get_airing():
    query = '''
    query {
  Page(perPage: 13) {
    media(sort: [EPISODES_DESC], type: ANIME, status: RELEASING, format: TV) {
          id
          title {
            english
          }
          genres
          coverImage {
            large
            medium
          }
          format
        }
      }
    }
    '''
    headers = {"Content-Type": "application/json"}
    response = requests.post("https://graphql.anilist.co", json={"query": query}, headers=headers)
    return jsonify(response.json())

@anilist_blueprint.route('/season', methods=['GET'])
def fetch_season():
    season = request.args.get('season', '').upper()
    year = get_season_year(season)

    query = '''
    query ($season: MediaSeason, $year: Int) {
      Page(perPage: 13) {
        media(season: $season, seasonYear: $year, type: ANIME, format: TV) {
          id
          title {
            english
          }
          coverImage {
            large
          }
          genres
          format
        }
      }
    }
    '''

    variables = {"season": season, "year": year}
    headers = {"Content-Type": "application/json"}

    response = requests.post(
        "https://graphql.anilist.co",
        json={"query": query, "variables": variables},
        headers=headers
    )
    return jsonify(response.json()), 200

@anilist_blueprint.route('/nextseason', methods=['GET'])
def fetch_next_season():
    season, year = get_next_season()

    query = '''
    query ($season: MediaSeason, $seasonYear: Int) {
      Page(perPage: 20) {
        media(season: $season, seasonYear: $seasonYear, type: ANIME, format: TV) {
          id
          title {
            romaji
            english
          }
          description(asHtml: false)

        coverImage {
            large
          }
          genres
          format
        }
      }
    }
    '''

    variables = {
        "season": season,
        "seasonYear": year
    }

    headers = {"Content-Type": "application/json"}

    response = requests.post(
        "https://graphql.anilist.co",
        json={"query": query, "variables": variables},
        headers=headers
    )

    return jsonify(response.json()), 200