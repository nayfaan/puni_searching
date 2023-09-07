// function reduce_zip(z) {
//     let s = new Set();
//     for (i of z) {
//         s.add(new Set(i));
//     }
//     return Array.from(s).map((set) => Array.from(set));
// }

function sum_score(feed_list) {
    let total = [20, 20, 20];

    for (let feed of feed_list) for (let i = 0; i < 3; i++) total[i] += feed[1] * feed[0][3][i];
    
    for (let i = 0; i < 3; i++) total[i] = clamp(0, total[i], 100);

    return total
}

function clamp(min, num, max) {
    return num <= min
        ? min
        : num >= max
            ? max
            : num
}

function print_result(item_combo, total_score, show_icons) {
    //     s = "<tr><td colspan='100%' style='text-align: left; color: silver;'><b>Score: " + \
    //     str(total_score) + "</b></td></tr>"

    //     for item in sorted(item_combo, key = itemgetter(1), reverse = True):
    //         item_name = item[0][0]
    //     item_attr = item[0][1]
    //     item_rank = item[0][2]
    //     item_base_attr = [i for i in items[item_name][0: 4]if i is not None]

    //     item_add_attr = [i for i in item_attr if i not in item_base_attr]

    //     print_line = "<tr><td>" + str(item[1]) + "</td>" + "<td>*</td><td>"

    //     if show_icons:
    //         print_line += '<img class="item_thumb" src="images/items/' + re.sub("$", ".webp", re.sub(
    //             "[\s']", "-", item_name)) + '" onerror="this.onerror=null; this.src=\'images/404.webp\'">'

    //     print_line += "</td><td>" + item_name + \
    //     "</td><td>(" + item_rank + ")</td>"
    //     if item_add_attr:
    //         print_line += ("<td>Add </td><td>" +
    //             ' '.join(item_add_attr) + "</td>")
    //     s += print_line + "</tr>"

    //     s += "<tr><td colspan='100%' style='border-top:2px solid black; height: 1.5em;'></td></tr>"
    //     return Markup(s)
}

function zip(arrays) {
    return arrays[0].map(function (_, i) {
        return arrays.map(function (array) { return array[i] })
    });
}

function itertoolsCombinations(arr, size) {
    const result = [];

    function c(current, start) {
        if (current.length === size) {
            result.push([...current]);
            return;
        }

        for (let i = start; i < arr.length; i++) {
            current.push(arr[i]);
            c(current, i + 1);
            current.pop();
        }
    }

    c([], 0);

    return result;
}

function zipPerm(puni_target, ordered, show_icons, item_category_rank_matrix) {
    if (!ordered) {
        puni_target.sort(function (a, b) { return a - b })
    }

    for (let p of permutation) {
        // add abort functionality
        let item_permutation = [];

        for (let i of itertoolsCombinations(item_category_rank_matrix, p.length)) {
            item_permutation.push(zip([i, p]));
        }

        // if (new Set(p).size !== p.length) item_permutation = reduce_zip(item_permutation); //uneeded

        for (item_combo of item_permutation) {
            let total_score = sum_score(item_combo);

            if (!ordered) total_score.sort(function (a, b) { return a - b });

            if (total_score==puni_target) print_result(item_combo, total_score, show_icons);
        }
    }
}

function cross_item_category(craftable_only, best_only) {
    let item_category_matrix = [[]];
    for (let item in items) {
        if (!(craftable_only && !craftables.includes(item))) {
            let data = items[item];

            let all_attr_subset
            if (!best_only) {
                let base_attr = data.slice(0, 4).filter(e => e);
                let add_attr = data.slice(4, 6).filter(e => e);

                all_attr_subset = [[item].concat(base_attr)];

                if (add_attr.length) {
                    for (let L = 1; L <= add_attr.length; L++) {
                        for (let add_attr_subset of itertoolsCombinations(add_attr, L)) {
                            all_attr_subset.push(
                                [item].concat(base_attr, add_attr_subset.filter(e => e)))
                        }
                    }
                }
            }
            else {
                let full_attr = data.filter(e => e);
                all_attr_subset = [[item].concat(full_attr)];
            }

            item_category_matrix = item_category_matrix.concat(all_attr_subset);
        }
    }

    item_category_matrix.shift();
    return item_category_matrix;
}

function cross_item_category_rank(item_category_matrix, best_only) {
    if (best_only) var rank = { "S": 5 };
    else var rank = {
        S: 5,
        A: 4,
        B: 3,
        C: 2,
        D: 1,
        E: 0
    };

    let item_category_rank_matrix = [];
    for (let item_category of item_category_matrix) {
        let name = item_category[0];

        let categories = item_category.splice(1);

        for (let rank_name in rank) {
            let rank_index = rank[rank_name];
            let [score_0, score_1, score_2] = [0, 0, 0];

            for (let category of categories) {
                let category_scores = value[category][0];
                let multiplier = value[category][1][rank_index];

                score_0 += multiplier * category_scores[0];
                score_1 += multiplier * category_scores[1];
                score_2 += multiplier * category_scores[2];
            }

            let item_category_rank = [name, categories, rank_name, [score_0, score_1, score_2]];
            item_category_rank_matrix.push(item_category_rank);
        }
    }

    return item_category_rank_matrix;
}

function puni_calc(settings) {
    let [puni_target, [craftable_only, best_only, ordered]] = settings;

    let item_category_matrix = cross_item_category(craftable_only, best_only);

    let item_category_rank_matrix = cross_item_category_rank(item_category_matrix, best_only);

    zipPerm(puni_target, ordered, show_icons, item_category_rank_matrix);
}

function clear_results() {
    $("#results").text("");
}

var submit_button = $("#submit");
var abort_button = $("#abort");
var clear_button = $("#clear");

submit_button.on("click", function () {
    clear_results();

    // abort_button.removeClass("hidden_btn").addClass("shown_btn");
    // clear_button.removeClass("hidden_btn").addClass("shown_btn");

    let const_val = parseInt($("#const_").val());
    let luster_val = parseInt($("#luster").val());
    let mood_val = parseInt($("#mood").val());

    let craftable_only = $("#craftable_only").is(":checked");
    let best_only = $("#best_only").is(":checked");
    let ordered = $("#ordered").is(":checked");
    let show_icons = $("#show_icons").is(":checked");

    let puni_target = [const_val, luster_val, mood_val]
    let settings = [puni_target, [craftable_only, best_only, ordered]]

    puni_calc(settings);
});

abort_button.on("click", function () {


    abort_button.removeClass("shown_btn").addClass("hidden_btn");
});


