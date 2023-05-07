import urllib.request
import os
import csv
import json

os.makedirs("app/static/data", exist_ok=True)

for i in range(5):
    path = f"app/static/data/201{i}.csv"
    if not os.path.isfile(path):
        print(f"{path} not found, downloading...", end=" ", flush=True)
        urllib.request.urlretrieve(f"https://taxi.ryanl.au/data/201{i}.csv", path)
        print("done")

def csv2geojson():
    geojson = {
        "type": "FeatureCollection",
        "features": []
    }

    features = []

    for i in range(5):
        path = f"app/static/data/201{i}.csv"

    with open(path) as f:
        reader = csv.DictReader(f)
        for row in reader:
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[row["pickup_longitude"], row["pickup_latitude"]], [row["dropoff_longitude"], row["dropoff_latitude"]]]
                    },
                    "properties": row
                }

            features.append(feature)

    geojson["features"] = features

    with open("app/static/data/trips.geojson", "w") as f:
        f.write(json.dumps(geojson))

csv2geojson()