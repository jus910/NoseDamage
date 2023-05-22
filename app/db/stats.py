try:
    from .db import query_db
except:
    from db import query_db

def create_summary_year():
    # RECREATES SUMMARY_YEAR
    query_db("DROP TABLE IF EXISTS summary_year")
    query_db("CREATE TABLE IF NOT EXISTS summary_year (year INT, avg_distance REAL)")

    for y in range(0, 5):
        year = int(f'201{y}')
        data = query_db(f"SELECT AVG(distance) FROM trips WHERE STRFTIME('%Y', pickup_time) = '{year}'")
        avg_d = data[0]
        query_db("INSERT INTO summary_year VALUES (?, ?)", (year, avg_d))

def create_summary_month():
    ## RECREATES SUMMARY_MONTH
    query_db("DROP TABLE IF EXISTS summary_month")
    query_db("CREATE TABLE IF NOT EXISTS summary_month (month STRING, avg_distance REAL)")
    months_str = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    for m in range(1, 13):
        month = '{:02d}'.format(m)
        data = query_db(f"SELECT AVG(distance), SUM(fare) FROM trips WHERE STRFTIME('%m', pickup_time) = '{month}'")
        avg_d = data[0]
        month = months_str[m - 1] # converts month to month  
        query_db("INSERT INTO summary_month VALUES (?, ?)", (month, avg_d))

def avg_distance_yr():
    return query_db("SELECT year, avg_distance FROM summary_year", all=True)

def avg_distance_m():
    return query_db("SELECT month, avg_distance FROM summary_month", all=True)

def investigation(identification):
    return query_db(f"SELECT pickup_time, dropoff_time, passenger_count, distance, pickup_lon, pickup_lat, dropoff_lon, dropoff_lat, fare, tip, total FROM trips WHERE ide = '{identification}'")