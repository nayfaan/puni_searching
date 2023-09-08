var submit_button = $("#submit"),
    abort_button = $("#abort"),
    // clear_button = $("#clear"),

    __abort = false,

    results_table = $("#results-table");

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

function print_array(arr) {
    let s = "[";
    for (let a of arr) {
        s += (a + ", ");
    }
    return s.slice(0, -2) + "]";
}

function print_header(show_icons) {
    let thead_tr = $('<tr>')
        .append(
            $('<th>')
                .attr('colspan', '2')
        )

    if (show_icons) {
        thead_tr.append(
            $('<th>')
                .text("Img.")
        )
    }

    thead_tr
        .append(
            $('<th>')
                .text("Name")
        )
        .append(
            $('<th>')
                .text("Rank")
        )
        .append(
            $('<th>')
                .attr('colspan', '2')
                .text("Add. Attr.")
        );

    results_table
        .append(
            $('<caption>')
                .text("Results")
        )
        .append(
            $('<thead>')
                .append(
                    thead_tr
                )
        ).append(
            $('<tbody>')
                .attr('id', 'results')
        );
}

function print_result(item_combo, total_score, show_icons) {
    let tbody = results_table.find('tbody');

    tbody.append(
        $('<tr>')
            .append(
                $('<td>')
                    .attr('colspan', '100%')
                    .css({ 'text-align': 'left', 'color': 'silver' })
                    .append(
                        $('<b>')
                            .text("Score: " + print_array(total_score))
                    )
            )
    );
    for (let item of item_combo.sort(function (a, b) { return b[1] - a[1]; })) {
        let item_name = item[0][0];
        let item_attr = item[0][1];
        let item_rank = item[0][2];

        let item_full_attr = Array.from(items[item_name]);
        let item_base_attr = item_full_attr.splice(0, 4);
        let item_add_attr = item_full_attr;

        let img;
        if (show_icons) {
            let img_src = "./web/static/images/items/" + item_name.toLowerCase().replace(/[\s']/g, "-") + ".webp"
            img = $('<img>')
                .addClass("item_thumb")
                .attr('src', img_src)
                .attr('onerror', "this.onerror=null; this.src='./web/static/images/404.webp'");
        }

        let tr = $('<tr>');
        tr.append(
            $('<td>')
                .text(item[1])
        )
            .append(
                $('<td>')
                    .text(" * ")
            );

        if (show_icons) {
            tr.append(
                $('<td>')
                    .append(img));
        }

        tr.append(
            $('<td>')
                .text(item_name)
        ).append(
            $('<td>')
                .css("color", rank_color[item_rank])
                .append(
                    $('<b>')
                        .text("(" + item_rank + ")")
                )
        );

        if (item_add_attr.length) {
            tr.append(
                $('<td>')
                    .text(item_add_attr.join(" "))
            );
        }

        tbody.append(tr);
    }
    tbody
        .append(
            $('<tr>')
                .append(
                    $('<td>')
                        .attr('colspan', '100%')
                        .css({ "border-top": "2px solid black", "height": "1.5em" })
                )
        )
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
        if (__abort) break;
        let item_permutation = [];

        console.time('zip')
        for (let i of itertoolsCombinations(item_category_rank_matrix, p.length)) {
            if (__abort) break;
            item_permutation.push(zip([i, p]));
        }
        console.timeEnd('zip')
        console.log(p)
        console.log(item_permutation.length)
        console.log("")

        // if (new Set(p).size !== p.length) item_permutation = reduce_zip(item_permutation); //uneeded

        for (item_combo of item_permutation) {
            if (__abort) break;
            let total_score = sum_score(item_combo);

            if (!ordered) total_score.sort(function (a, b) { return a - b });

            if (JSON.stringify(total_score) == JSON.stringify(puni_target)) print_result(item_combo, total_score, show_icons);
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
        let categories = item_category.splice(1);
        let name = item_category[0];

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
    let [puni_target, [craftable_only, best_only, ordered, show_icons]] = settings;

    let item_category_matrix = cross_item_category(craftable_only, best_only);

    let item_category_rank_matrix = cross_item_category_rank(item_category_matrix, best_only);
    console.log(abort_button)
    abort_button.removeClass("hidden_btn").addClass("shown_btn");
    console.log(abort_button)
    // zipPerm(puni_target, ordered, show_icons, item_category_rank_matrix);
}

function clear_results() {
    $("#results-table").text("");
}

submit_button.on("click", function () {
    clear_results();

    // clear_button.removeClass("hidden_btn").addClass("shown_btn");

    let const_val = parseInt(
        $("#const_").val());
    let luster_val = parseInt(
        $("#luster").val());
    let mood_val = parseInt(
        $("#mood").val());

    let craftable_only = $("#craftable_only").is(":checked");
    let best_only = $("#best_only").is(":checked");
    let ordered = $("#ordered").is(":checked");
    let show_icons = $("#show_icons").is(":checked");

    let puni_target = [const_val, luster_val, mood_val]
    let settings = [puni_target, [craftable_only, best_only, ordered, show_icons]]

    print_header(show_icons);

    puni_calc(settings);

    __abort = false;
});

abort_button.on("click", function () {
    __abort = true;

    abort_button.removeClass("shown_btn").addClass("hidden_btn");
});