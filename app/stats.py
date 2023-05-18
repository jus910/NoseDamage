import base64
from io import BytesIO
from matplotlib.figure import Figure
import db.db as db

def avg_distance_graph():
 # Generate the figure **without using pyplot**.
  x = db.query_db("SELECT year FROM summary")
  y = db.query_db("SELECT avg_distance FROM summary")
  print(x)
  print(y)
  fig = Figure()
  ax = fig.subplots()
  ax.bar(x, y, width=1)
  # Save it to a temporary buffer.
  buf = BytesIO()
  fig.savefig(buf, format="png")
  return base64.b64encode(buf.getbuffer()).decode("ascii")