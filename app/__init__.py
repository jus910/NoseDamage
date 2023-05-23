from flask import Flask             #facilitate flask webserving
from flask import render_template   #facilitate jinja templating
from flask import request           #facilitate form submission
from flask import session, redirect, url_for, flash, jsonify
import requests
import os
try:
    import app.db.stats as stat
except:
    import db.stats as stat

with open("app/keys/mapbox_directions.txt") as f:
    mapbox_token = f.read().strip()

app = Flask(__name__)
app.secret_key = os.urandom(12).hex()

months_str = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

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
    sql_data = stat.avg_distance_yr()
    x1 = [n[0] for n in sql_data]   # years
    y1 = [n[1] for n in sql_data]

    sql_data = stat.avg_distance_m()
    x2 = months_str                 # months
    y2 = [n[1] for n in sql_data]

    sql_data = stat.total_fare_yr()
    # x3 = [n[0] for n in sql_data]
    # stack = [n[1] for n in sql_data]
    y3 = [n[2] for n in sql_data]

    return render_template('stats.html', 
        years = x1, avg_d_yr = y1,
        months = x2, avg_d_m = y2,
        fare_stack = months_str, total_fare_myr = y3)

@app.route("/get_year", methods=['GET','POST'])
def data():
    if (request.method == 'POST'):
        session['year'] = request.get_json()
        print(request.get_json())
        message = {'status':'200'}
        return jsonify(message)
    else:
        return 'yes'
    
@app.route("/info/<data>", methods=['GET','POST'])
def id(data):
    if (request.method == 'GET'):
        information = stat.investigation(data)
        print("YAYA")
        print(information)
        message = {'status':'200',
                   'pickup_time': information[0], 
                   'dropoff_time': information[1], 
                   'passenger_count': information[2], 
                   'distance': information[3],
                    'pickup_lon': information[4],
                     'pickup_lat': information[5],
                      'dropoff_lon': information[6],
                       'dropoff_lat': information[7],
                        'fare': information[8], 
                        'tip': information[9], 
                        'total': information[10],
        }
        return jsonify(message)
    else:
        return 'yes'

if __name__ == "__main__":  # true if this file NOT imported
    app.debug = True        # enable auto-reload upon code change
    app.run()
