from flask import Flask             #facilitate flask webserving
from flask import render_template   #facilitate jinja templating
from flask import request           #facilitate form submission
from flask import session, redirect, url_for, flash

app = Flask(__name__)

@app.route("/")
def home():
    return render_template('home.html')


@app.route("/map")
def map():
    return render_template('map.html')


if __name__ == "__main__":  # true if this file NOT imported
    app.debug = True        # enable auto-reload upon code change
    app.run()
