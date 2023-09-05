import puni

# Flask: Web app wrapper
from flask import Flask, render_template, request, url_for, redirect, make_response
from flask import jsonify
from markupsafe import escape

def getCheck(check):
    if check:
        return True
    else:
        return False
    
def postCheck(check):
    if check:
        return "checked"
    else:
        return ""

app = Flask(__name__,
            static_url_path="",
            static_folder="services/static",
            template_folder="services/template")

# Starting web app

@app.route("/", methods=["GET", "POST", "PUT"])
def index():

    # where this came from?
    if request.method == "GET":
        return render_template("index.html", craftable_state = postCheck(True), best_state = postCheck(True), ordered_state = postCheck(False), results="")

    # submit?
    elif request.method == "POST":
        const_ = request.form.get('const_')
        luster = request.form.get('luster')
        mood = request.form.get('mood')
        craftable_only = getCheck(request.form.get('craftable_only'))
        best_only = getCheck(request.form.get('best_only'))
        ordered = getCheck(request.form.get('ordered'))
        
        settings = ([const_, luster, mood], (craftable_only, best_only, ordered))
        results = puni.run(settings)
        
        return render_template("index.html", craftable_state = postCheck(craftable_only), best_state = postCheck(best_only), ordered_state = postCheck(ordered), results=results)

    # (?)
    else:
        return render_template("index.html", craftable_state = postCheck(True), best_state = postCheck(True), ordered_state = postCheck(False), results="")


def main():
    app.run(host="localhost", port=8080, debug=True)


if __name__ == "__main__":
    main()
