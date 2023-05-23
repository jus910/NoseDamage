try:
    from .db import query_db
except:
    from db import query_db

def create_summary():
    # RECREATES SUMMARY_YEAR
    query_db("DROP TABLE IF EXISTS summary")
    query_db("CREATE TABLE IF NOT EXISTS summary (year INT, month INT, total_d REAL, count INT, total_fare REAL)")

    for y in range(0, 5):
        year = int(f'201{y}')
        print(f"summarizing {year}...", end=" ", flush = True)

        for m in range(1, 13):
            month = '{:02d}'.format(m)
            data = query_db(f"SELECT TOTAL(distance), COUNT(*), TOTAL(fare) FROM trips WHERE STRFTIME('%Y', pickup_time) = '{year}' AND STRFTIME('%m', pickup_time) = '{month}'")
            total_d = data[0]
            count = data[1]
            total_fare = data[2]
            query_db("INSERT INTO summary VALUES (?, ?, ?, ?, ?)", (year, month, total_d, count, total_fare))
        
        print("done.")

def avg_distance_yr():
    return query_db("SELECT year, SUM(total_d)/SUM(count) as average_distance FROM summary GROUP BY year", all = True)

def avg_distance_m():
    return query_db("SELECT month, SUM(total_d)/SUM(count) as average_distance FROM summary GROUP BY month", all = True)

def total_fare_yr():
    return query_db("SELECT year, month, total_fare FROM summary ORDER BY month", all = True)