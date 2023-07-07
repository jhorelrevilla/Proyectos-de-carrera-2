from flask import Flask,render_template 
import json

data=None
with open('./data/data_example.json') as f:
    data=json.load(f)

app=Flask(__name__)

@app.route('/')
def index():
    return render_template(
        "index.html",
        jsondata=data
    )


if __name__=='__main__':
    app.run(debug=True)
