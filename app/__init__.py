from flask import Flask             #facilitate flask webserving
from flask import render_template   #facilitate jinja templating
from flask import request           #facilitate form submission
from flask import session, redirect, url_for, flash, jsonify
import requests
import os
from stats import avg_distance_graph

with open("app/keys/mapbox_directions.txt") as f:
    mapbox_token = f.read().strip()

app = Flask(__name__)
app.secret_key = os.urandom(12).hex()

@app.route("/")
def home():
    if 'year' not in session:
        session['year'] = '2010'
    return render_template('home.html', year = session['year'])

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
    if 'year' not in session:
        session['year'] = '2010'
    return render_template('map.html', year = session['year'])

@app.route("/about")
def about():
    return render_template('about.html')
    
@app.route("/stats")
def stats():
    data = avg_distance_graph()
    return render_template('stats.html', graphData = data)

@app.route("/get_year", methods=['GET','POST'])
def data():
    if (request.method == 'POST'):
        session['year'] = request.get_json()
        print(request.get_json())
        message = {'status':'200'}
        return jsonify(message)
    else:
        return 'yes'
    
if __name__ == "__main__":  # true if this file NOT imported
    app.debug = True        # enable auto-reload upon code change
    app.run()
