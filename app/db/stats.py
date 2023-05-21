try:
    from .db import query_db
except:
    from db import query_db

months_str = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

def create_summary():
    # RECREATES SUMMARY_YEAR
    query_db("DROP TABLE IF EXISTS summary")
    query_db("CREATE TABLE IF NOT EXISTS summary (year INT, month TEXT, avg_distance REAL)")

    for y in range(0, 5):
        year = int(f'201{y}')
        print(f"summarizing {year}...", end=" ", flush = True)

        for m in range(1, 13):
            month = '{:02d}'.format(m)
            data = query_db(f"SELECT AVG(distance) FROM trips WHERE STRFTIME('%Y', pickup_time) = '{year}' AND STRFTIME('%m', pickup_time) = '{month}'")
            avg_d = data[0]

            month = months_str[m - 1] # converts month to month  
            query_db("INSERT INTO summary VALUES (?, ?, ?)", (year, month, avg_d))
        
        print("done.")

def avg_distance_yr():
    # return query_db("SELECT year, avg_distance FROM summary_year", all=True)
    return query_db("SELECT year, AVG(avg_distance) FROM summary GROUP BY year", all = True)

def avg_distance_m():
    # return query_db("SELECT month, avg_distance FROM summary_month", all=True)
    return query_db("SELECT month, AVG(avg_distance) FROM summary GROUP BY month", all = True)
