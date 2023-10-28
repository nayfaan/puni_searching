var submit_button = $("#submit"),
    range_checkbox = $("#range"),
    ordered_checkbox = $("#ordered"),
    results_table = $("#results-table");
var show_icons = true;
var tbody;

function start_zip_worker() {
    if (typeof (Worker) !== "undefined") {
        if (typeof (w) == "undefined") {
            w = new Worker("./web/static/zipPerm.js");
        }
        w.onmessage = function (event) {
            if (event.data !== true) {
                let [item_combo, total_score_unsorted] = event.data
                print_result(item_combo, total_score_unsorted, show_icons);
            }
            else conclude_calc();
        };
    } else {
        results_table.text("ERROR: Web Worker support required. Please use a more updated browser.");
    }
}

function stop_zip_worker() {
    w.terminate();
    w = undefined;
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
    thead_tr = null;

    tbody = results_table.find('tbody');
}

function print_result(item_combo, total_score, show_icons) {
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
    for (let [item_data, item_count] of item_combo.sort(function (a, b) { return b[1] - a[1]; })) {
        let [item_name_index, item_attr, item_rank_index] = item_data;
        item_rank = rank_convert[item_rank_index];
        item_name = item_convert[item_name_index]

        let item_orig_full_attr = Array.from(items[item_name_index]);
        let item_orig_base_attr = item_orig_full_attr.splice(0, 4).filter(e => e !== null);

        let item_add_attr = item_attr.filter(i => !item_orig_base_attr.includes(i))
        item_add_attr = item_add_attr.map(function (element){
            return category_convert[element];
        });

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
                .text(item_count)
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
        img = null;

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
        tr = null;
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

function cross_item_category(craftable_only, best_only) {
    let item_category_matrix = [[]];
    for (let item in items) {
        item = parseInt(item)
        if (!(craftable_only && !craftables.includes(item))) {
            let data = items[item];

            let all_attr_subset
            if (!best_only) {
                let base_attr = data.slice(0, 4).filter(e => e !== null);
                let add_attr = data.slice(4, 6).filter(e => e !== null);

                all_attr_subset = [[item].concat(base_attr)];

                if (add_attr.length) {
                    for (let L = 1; L <= add_attr.length; L++) {
                        for (let add_attr_subset of itertoolsCombinations(add_attr, L)) {
                            all_attr_subset.push(
                                [item].concat(base_attr, add_attr_subset.filter(e => e !== null)))
                        }
                    }
                }
            }
            else {
                let full_attr = data.filter(e => e !== null);
                all_attr_subset = [[item].concat(full_attr)];
            }

            item_category_matrix = item_category_matrix.concat(all_attr_subset);
        }
    }

    item_category_matrix.shift();
    return item_category_matrix;
}

function cross_item_category_rank(item_category_matrix, best_only) {
    if (best_only) var rank = [5];
    else var rank = [5,4,3,2,1,0];

    let item_category_rank_matrix = [];
    for (let item_category of item_category_matrix) {
        let categories = item_category.splice(1);
        let name = item_category[0];

        for (let i in rank) {
            let rank_index = rank[i];

            let item_category_rank = [name, categories, rank_index];
            item_category_rank_matrix.push(item_category_rank);
        }
    }

    return item_category_rank_matrix;
}

function conclude_calc() {
    stop_zip_worker();

    tbody
        .append(
            $('<tr>')
                .append(
                    $('<td>')
                        .attr('colspan', '100%')
                        .css({ "height": "1.5em" })
                )
        )
        .append(
            $('<tr>')
                .append(
                    $('<td>')
                        .attr('colspan', '100%')
                        .append(
                            $('<strong>')
                                .append(
                                    $('<span>')
                                        .addClass("tooltip")
                                        .text("[END OF RESULTS]")
                                        .append(
                                            $('<span>')
                                                .addClass("tooltiptext")
                                                .text("If the table is empty, there are no valid results for your settings. Please alter your settings and try again.")
                                        )
                                )
                        )
                )
        )

    submit_button.prop("disabled", false);
}

function puni_calc(settings) {
    let [puni_target, [craftable_only, best_only, ordered, is_range, max_type], puni_target_min] = settings;
    
    let item_category_matrix = cross_item_category(craftable_only, best_only);
    let item_category_rank_matrix = cross_item_category_rank(item_category_matrix, best_only);

    start_zip_worker();
    w.postMessage([puni_target, ordered, item_category_rank_matrix, is_range, max_type, puni_target_min]);
}

function clear_results() {
    $("#results-table").text("");
}

var ordered_checkbox_cookie

range_checkbox.on("change", function(){
    if (range_checkbox.is(":checked")){
        $(".stat_cell").css("display", "table-cell");
        $(".stat_row").css("display", "table-row");

        ordered_checkbox_cookie = ordered_checkbox.is(":checked")
        ordered_checkbox.prop("disabled", true);
        ordered_checkbox.prop("checked", true);

        $("#ordered_div").css("display", "none");
    }else{
        $(".stat_range").css("display", "none");

        ordered_checkbox.prop("disabled", false);
        ordered_checkbox.prop("checked", ordered_checkbox_cookie);

        $("#ordered_div").css("display", "inherit");
    }
});

submit_button.on("click", function () {
    submit_button.prop("disabled", true);
    clear_results();

    let const_val = parseInt(
        $("#const_").val());
    let luster_val = parseInt(
        $("#luster").val());
    let mood_val = parseInt(
        $("#mood").val());

    let const_val_min = parseInt(
        $("#const_min").val());
    let luster_val_min = parseInt(
        $("#luster_min").val());
    let mood_val_min = parseInt(
        $("#mood_min").val());

    let craftable_only = $("#craftable_only").is(":checked");
    let best_only = $("#best_only").is(":checked");
    let ordered = $("#ordered").is(":checked");
    show_icons = $("#show_icons").is(":checked");
    let is_range = $("#range").is(":checked");
    let max_type = parseInt($("#max_type").val());

    let puni_target = [const_val, luster_val, mood_val]
    let puni_target_min = [const_val_min, luster_val_min, mood_val_min]
    let settings = [puni_target, [craftable_only, best_only, ordered, is_range, max_type], puni_target_min]

    print_header(show_icons);
    puni_calc(settings);
});