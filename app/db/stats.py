try:
    from .db import query_db
except:
    from db import query_db

def create_summary():
    # RECREATES SUMMARY_YEAR
    query_db("DROP TABLE IF EXISTS summary")
    query_db("CREATE TABLE IF NOT EXISTS summary (year INT, month INT, total_d REAL, count INT, total_fare REAL, total_pass INT)")

    for y in range(0, 5):
        year = int(f'201{y}')
        print(f"summarizing {year}...", end=" ", flush = True)

        for m in range(1, 13):
            month = '{:02d}'.format(m)
            data = query_db(f"SELECT TOTAL(distance), COUNT(*), TOTAL(fare), TOTAL(passenger_count) FROM trips WHERE STRFTIME('%Y', pickup_time) = '{year}' AND STRFTIME('%m', pickup_time) = '{month}'")
            total_d = data[0]
            count = data[1]
            total_fare = data[2]
            total_pass = data[3]
            query_db("INSERT INTO summary VALUES (?, ?, ?, ?, ?, ?)", (year, month, total_d, count, total_fare, total_pass))
        
        print("done.")

def avg_distance_yr():
    return query_db("SELECT year, SUM(total_d)/SUM(count) as average_distance FROM summary GROUP BY year", all = True)

def avg_distance_m():
    return query_db("SELECT month, SUM(total_d)/SUM(count) as average_distance FROM summary GROUP BY month", all = True)

def total_fare_myr():
    return query_db("SELECT year, month, total_fare FROM summary ORDER BY month", all = True)

def total_pass_yr():
    return query_db("SELECT year, total_pass FROM summary GROUP BY year", all = True)

def investigation(identification):
    return query_db(f"SELECT pickup_time, dropoff_time, passenger_count, distance, pickup_lon, pickup_lat, dropoff_lon, dropoff_lat, fare, tip, total FROM trips WHERE ide = '{identification}'")
