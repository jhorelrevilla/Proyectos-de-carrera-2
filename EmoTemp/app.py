from flask import Flask,render_template 
import json, os

data=None
with open('./data/data_example.json') as f:
    data=json.load(f)

app=Flask(__name__)

@app.route('/')
def index():

    # file=os.path.join(os.path.join('static','Image'),'/images/feliz.png')

    return render_template(
        "index.html",
        jsondata=data,
        # feliz=file
    )


if __name__=='__main__':
    app.run(debug=True)
