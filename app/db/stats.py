try:
    from .db import query_db
except:
    from db import query_db

def update_summary():
    # RECREATES SUMMARY_YEAR
    query_db("DROP TABLE IF EXISTS summary_year;")
    query_db("CREATE TABLE IF NOT EXISTS summary_year (year INT, avg_distance REAL)")

    for y in range(0, 5):
        year = int(f'201{y}')
        avg = (query_db(f"SELECT AVG(distance) FROM trips WHERE STRFTIME('%Y', pickup_time) = '{year}'"))[0]
        # print(avg)
        query_db("INSERT INTO summary_year VALUES (?, ?)", (year, avg))

    ## RECREATES SUMMARY_MONTH
    ## (Need to add)


def avg_distance_values():
    x = query_db("SELECT year, avg_distance FROM summary_year", all=True)
    return x
