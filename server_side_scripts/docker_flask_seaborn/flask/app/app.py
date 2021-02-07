from flask import Flask
from flask import send_file
import altair as alt
import pandas as pd
from altair_saver import save

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/plot.png')
def plot_png():
    return send_file("./plot.png", mimetype='image/png')


@app.route('/plot_altair.png')
def plot_altair_png():
    source = pd.DataFrame({
        'a': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        'b': [28, 55, 43, 91, 81, 53, 19, 87, 52]
    })

    chart = alt.Chart(source).mark_bar().encode(
        x='a',
        y='b'
    )

    #
    save(chart, 'chart.png')

    #
    return send_file("./chart.png", mimetype='image/png')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)