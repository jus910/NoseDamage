import urllib.request
import os
import csv
import json
import app.db.taxi as taxi


def download_data():
    os.makedirs("app/static/data", exist_ok=True)

    for i in range(5):
        path = f"app/static/data/201{i}.csv"
        if not os.path.isfile(path):
            print(f"{path} not found, downloading...", end=" ", flush=True)
            urllib.request.urlretrieve(f"https://taxi.ryanl.au/data/201{i}.csv", path)
            print("done")


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
                    "point_type": "dropoff"
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
                    "point_type": "pickup"
                },
            }
            features.append(feature)


    geojson["features"] = features

    with open("app/static/data/trips.geojson", "w") as f:
        f.write(json.dumps(geojson))

    print("done")


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
                        row["tpep_pickup_datetime"],
                        row["tpep_dropoff_datetime"],
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
            print("done")

download_data()
csv2geojson()
load_db()
