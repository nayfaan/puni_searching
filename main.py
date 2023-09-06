import puni
from input.__data import items

import itertools

# Flask: Web app wrapper
from flask import Flask, render_template, request, url_for, redirect, make_response
from flask import jsonify
from markupsafe import escape, Markup

from turbo_flask import Turbo
import threading


def update_load(next_results):
    with app.app_context():
        turbo.push(turbo.append(next_results, 'results'))


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


def reduce_zip(z):
    temp = set()
    for i in z:
        temp.add(frozenset(i))
    return temp


def sum_score(feed_list):
    total = [0, 0, 0]
    for feed in feed_list:
        total = [total[i] + feed[1] * feed[0][3][i]
                 for i in range(len(feed[0][3]))]

    total = [clamp(0, 20 + t, 100) for t in total]
    return total


def clamp(low, num, high):
    return max(min(high, num), low)


def print_result(item_combo, total_score):
    s = "Score: " + str(total_score) + "\n"

    for item in item_combo:
        item_name = item[0][0]
        item_attr = item[0][1]
        item_rank = item[0][2]
        item_base_attr = [i for i in items[item_name][0:4] if i is not None]

        item_add_attr = [i for i in item_attr if i not in item_base_attr]

        print_line = str(item[1]) + " * " + item_name + " (" + item_rank + ")"
        if item_add_attr:
            print_line += (" | " + str(item_add_attr))
        s += print_line + "\n"

    s += "\n"
    return s


def zipPerm(puni_target, ordered, permutation, item_category_rank_matrix):
    for p in permutation:
        update_load(p)
        item_permutation = [list(zip(i, p)) for i in itertools.permutations(
            item_category_rank_matrix, len(p))]

        item_permutation = reduce_zip(item_permutation)
        for item_combo in item_permutation:
            total_score = sum_score(item_combo)

            total_score_sort = total_score[:]
            if not ordered:
                total_score_sort.sort()

            if total_score_sort == puni_target:
                update_load(print_result(item_combo, total_score))


app = Flask(__name__,
            static_url_path="",
            static_folder="services/static",
            template_folder="services/template")

# Initiate Turbo-Flask
turbo = Turbo(app)

with app.app_context():
    threading.Thread(target=update_load("")).start()

# Starting web app


@app.route("/", methods=["GET", "POST", "PUT"])
def index():

    # where this came from?
    if request.method == "GET":
        return render_template("index.html", craftable_state=postCheck(True), best_state=postCheck(True), ordered_state=postCheck(False), results="")

    # submit?
    elif request.method == "POST":
        const_ = int(request.form.get('const_'))
        luster = int(request.form.get('luster'))
        mood = int(request.form.get('mood'))
        craftable_only = getCheck(request.form.get('craftable_only'))
        best_only = getCheck(request.form.get('best_only'))
        ordered = getCheck(request.form.get('ordered'))

        puni_target = [const_, luster, mood]
        settings = (puni_target,
                    (craftable_only, best_only, ordered))

        puni_data = puni.run(settings)
        zipPerm(puni_target, ordered, puni_data[0], puni_data[1])

        # return render_template("index.html", craftable_state = postCheck(craftable_only), best_state = postCheck(best_only), ordered_state = postCheck(ordered), results=results)

    # (?)
    else:
        return render_template("index.html", craftable_state=postCheck(True), best_state=postCheck(True), ordered_state=postCheck(False), results="")


def main():
    app.run(host="localhost", port=8080, debug=True)


if __name__ == "__main__":
    main()
