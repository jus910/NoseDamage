try:
    from .db import query_db
except:
    from db import query_db


def create_trips_table(): 
    query_db("CREATE TABLE IF NOT EXISTS trips (pickup_time TEXT, dropoff_time TEXT, passenger_count INTEGER, distance REAL, pickup_lon REAL, pickup_lat REAL, dropoff_lon REAL, dropoff_lat REAL, fare REAL, tip REAL, total REAL, id INTEGER)")

def add_new_trip(pickup_time, dropoff_time, passenger_count, distance, pickup_lon, pickup_lat, dropoff_lon, dropoff_lat, fare, tip, total, id):
    query_db("INSERT INTO trips VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (pickup_time, dropoff_time, passenger_count, distance, pickup_lon, pickup_lat, dropoff_lon, dropoff_lat, fare, tip, total, id))

def add_new_trips(trips):
    query_db("INSERT INTO trips VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", trips, execute_many=True)

def get_number_of_trips():
    return query_db("SELECT COUNT(*) FROM trips")
