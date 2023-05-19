import urllib.request
import os
import csv
import json
import app.db.taxi as taxi
import app.db.stats as stat
import certifi
import ssl


def download_data():
    os.makedirs("app/static/data", exist_ok=True)

    for i in range(5):
        path = f"app/static/data/201{i}.csv"
        if not os.path.isfile(path):
            print(f"{path} not found, downloading...", end=" ", flush=True)
            data = urllib.request.urlopen(f"https://taxi.ryanl.au/data/201{i}.csv", context=ssl.create_default_context(cafile=certifi.where())).read()
            with open(path, mode="wb") as f:
                f.write(data)
            print("done.")


def csv2geojson():
    print("generating app/static/data/trips.geojson...", end=" ", flush=True)
    geojson = {"type": "FeatureCollection", "features": []}

    features = []

    for i in range(5):
        path = f"app/static/data/201{i}.csv"

        with open(path) as f:
            reader = csv.DictReader(f)
            for row in reader:
                feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            row["dropoff_longitude"], row["dropoff_latitude"]
                        ],
                    },
                    "properties": {
                        "point_type": "dropoff",
                        "year": row["tpep_pickup_datetime"].split("/")[2].split(" ")[0],
                        "to": f'{row["pickup_longitude"]},{row["pickup_latitude"]}'
                    },
                }
                features.append(feature)

                feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            row["pickup_longitude"], row["pickup_latitude"]
                        ],
                    },
                    "properties": {
                        "point_type": "pickup",
                        "year": row["tpep_pickup_datetime"].split("/")[2].split(" ")[0],
                        "to": f'{row["dropoff_longitude"]},{row["dropoff_latitude"]}'
                    },
                }
                features.append(feature)


    geojson["features"] = features

    with open("app/static/data/trips.geojson", "w") as f:
        f.write(json.dumps(geojson))

    print("done.")


def load_db():
    taxi.create_trips_table()

    num_trips = taxi.get_number_of_trips()[0]

    if num_trips == 0:
        for i in range(5):
            print(f"adding trip data from 201{i} to db...", end=" ", flush=True)
            trips = []
            path = f"app/static/data/201{i}.csv"

            with open(path) as f:
                reader = csv.DictReader(f)
                for row in reader:
                    
                    trip = (
                        convertTime(row["tpep_pickup_datetime"]),
                        convertTime(row["tpep_dropoff_datetime"]),
                        row["passenger_count"],
                        row["trip_distance"],
                        row["pickup_longitude"],
                        row["pickup_latitude"],
                        row["dropoff_longitude"],
                        row["dropoff_latitude"],
                        row["fare_amount"],
                        row["tip_amount"],
                        row["total_amount"],
                    )
                    trips.append(trip)

            taxi.add_new_trips(trips)
            print("done.")

def convertTime(given): #yyyy-mm-dd hh:mm:ss
    formatted = ""
    formatted += given[6:10] + "-" + given[0:2] + "-" + given[3:5] + " "
    if  given[-2:] == "PM":
        hr = int(given[11:13])
        if hr != 12:
            hr += 12
        formatted += str(hr) + given[13:19]
    else:
        formatted += given[11:19]
    return formatted

def summarize():
    stat.create_summary_year()
    stat.create_summary_month()
    print("summaries created in db")

download_data()
csv2geojson()
load_db()
summarize()
