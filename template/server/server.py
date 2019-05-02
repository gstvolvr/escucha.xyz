from flask import Flask, render_template

app = Flask(__name__, static_folder="../static/dist", template_folder="../static")

@app.route("/")
def index():
    print(render_template("dist/index.html"))
    return render_template("dist/index.html")

@app.route("/hello")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run()
