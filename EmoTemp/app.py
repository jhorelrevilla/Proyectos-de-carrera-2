from flask import Flask,render_template 
import json

data=None
with open('./data/data_formato.json') as f:
    data=json.load(f)
#print(data)
app=Flask(__name__)

@app.route('/')
def index():
    return render_template(
        "index.html",
        jsondata=data
    )


if __name__=='__main__':
    app.run(debug=True,port=1302)
