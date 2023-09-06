import puni
from input.__data import items

import itertools
import re
from operator import itemgetter

# Flask: Web app wrapper
from flask import Flask, render_template, request, url_for, redirect
from flask import jsonify, make_response
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


def print_result(item_combo, total_score, show_icons):
    s = "<tr><td colspan='100%' style='text-align: left; color: silver;'><b>Score: " + \
        str(total_score) + "</b></td></tr>"

    for item in sorted(item_combo, key=itemgetter(1), reverse=True):
        item_name = item[0][0]
        item_attr = item[0][1]
        item_rank = item[0][2]
        item_base_attr = [i for i in items[item_name][0:4] if i is not None]

        item_add_attr = [i for i in item_attr if i not in item_base_attr]

        print_line = "<tr><td>" + str(item[1]) + "</td>" + "<td>*</td><td>"

        if show_icons:
            print_line += '<img class="item_thumb" src="images/items/' + re.sub("$", ".webp", re.sub(
                "[\s']", "-", item_name)) + '" onerror="this.onerror=null; this.src=\'images/404.webp\'">'

        print_line += "</td><td>" + item_name + \
            "</td><td>(" + item_rank + ")</td>"
        if item_add_attr:
            print_line += ("<td>Add </td><td>" +
                           ' '.join(item_add_attr) + "</td>")
        s += print_line + "</tr>"

    s += "<tr><td colspan='100%' style='border-top:2px solid black; height: 1.5em;'></td></tr>"
    return Markup(s)


def zipPerm(puni_target, ordered, show_icons, permutation, item_category_rank_matrix):
    for p in permutation:
        item_permutation = [list(zip(i, p)) for i in itertools.permutations(
            item_category_rank_matrix, len(p))]

        item_permutation = reduce_zip(item_permutation)
        for item_combo in item_permutation:
            total_score = sum_score(item_combo)

            total_score_sort = total_score[:]
            if not ordered:
                total_score_sort.sort()
                
            update_load(total_score)

            if total_score_sort == puni_target:
                update_load(print_result(item_combo, total_score, show_icons))


app = Flask(__name__,
            static_url_path="",
            static_folder="services/static",
            template_folder="")

# Initiate Turbo-Flask
turbo = Turbo(app)

with app.app_context():
    threading.Thread(target=update_load("")).start()

# Starting web app


@app.route("/", methods=["GET", "POST", "PUT"])
def index():

    # where this came from?
    if request.method == "GET":
        return render_template("index.html", craftable_state=postCheck(True), best_state=postCheck(True), ordered_state=postCheck(False), icons_state=postCheck(True), results="")

    # submit?
    elif request.method == "POST":
        turbo.push(turbo.replace(
            Markup("<tbody id='results'></tbody>"), 'results'))

        const_ = int(request.form.get('const_'))
        luster = int(request.form.get('luster'))
        mood = int(request.form.get('mood'))

        craftable_only = getCheck(request.form.get('craftable_only'))
        best_only = getCheck(request.form.get('best_only'))
        ordered = getCheck(request.form.get('ordered'))

        show_icons = getCheck(request.form.get('show_icons'))

        puni_target = [const_, luster, mood]
        settings = (puni_target,
                    (craftable_only, best_only, ordered))

        puni_data = puni.run(settings)
        zipPerm(puni_target, ordered, show_icons, puni_data[0], puni_data[1])

    # (?)
    else:
        return render_template("index.html", craftable_state=postCheck(True), best_state=postCheck(True), ordered_state=postCheck(False), icons_state=postCheck(True), results="")


def main():
    app.run(host="localhost", port=8080, debug=True)


if __name__ == "__main__":
    main()
