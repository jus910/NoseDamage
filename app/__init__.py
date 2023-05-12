from flask import Flask             #facilitate flask webserving
from flask import render_template   #facilitate jinja templating
from flask import request           #facilitate form submission
from flask import session, redirect, url_for, flash, jsonify
import os

app = Flask(__name__)
app.secret_key = os.urandom(12).hex()

@app.route("/")
def home():
    if 'year' in session:
        return render_template('home.html', year = session['year'])
    else:
        return render_template('home.html', year = '2010')


@app.route("/map")
def map():
    return render_template('map.html')

@app.route("/get_year", methods=['GET','POST'])
def data():
    if (request.method == 'POST'):
        session['year'] = request.get_json()
        print(request.get_json())
        message = {'status':'200'}
        return jsonify(message)
    else:
        return 'yes'
if __name__ == "__main__":  # true if this file NOT imported
    app.debug = True        # enable auto-reload upon code change
    app.run()
