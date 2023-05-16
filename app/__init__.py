from flask import Flask             #facilitate flask webserving
from flask import render_template   #facilitate jinja templating
from flask import request           #facilitate form submission
from flask import session, redirect, url_for, flash
import requests


with open("app/keys/mapbox_directions.txt") as f:
    mapbox_token = f.read().strip()

app = Flask(__name__)

@app.route("/")
def home():
    return render_template('home.html')

@app.route("/api/directions")
def directions():
    args = request.args
    start = args.get("start")
    end = args.get("end")


    response = requests.get(f"https://api.mapbox.com/directions/v5/mapbox/driving-traffic/{start};{end}?geometries=geojson&access_token={mapbox_token}")
    print(response)
    return response.text



@app.route("/map")
def map():
    return render_template('map.html')


if __name__ == "__main__":  # true if this file NOT imported
    app.debug = True        # enable auto-reload upon code change
    app.run()
