import sqlite3

def get_connection():
    conn = sqlite3.connect("app/db/db")
    return conn


def query_db(query, args=(), all=False, execute_many=False):
    conn = get_connection()

    with conn:
        cur = conn.cursor()
        if execute_many:
            r = cur.executemany(query, args)
        else:
            r = cur.execute(query, args)
        r = cur.fetchall()
    conn.close()

    return (r[0] if r else None) if not all else r