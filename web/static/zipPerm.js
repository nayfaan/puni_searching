importScripts("./data.js"); importScripts("./itertoolsCombinations.js");

var complete = false;

function zip(arrays) {
    return arrays[0].map(function (_, i) {
        return arrays.map(function (array) { return array[i] })
    });
}

function clamp(min, num, max) {
    return num <= min
        ? min
        : num >= max
            ? max
            : num
}

function sum_score(feed_list) {
    let total = [20, 20, 20];

    for (let feed of feed_list) for (let i = 0; i < 3; i++) total[i] += feed[1] * feed[0][3][i];

    for (let i = 0; i < 3; i++) total[i] = clamp(0, total[i], 100);

    return total
}

function is_between(puni_target, puni_target_min, total_score){
    let between = true;
    for(let i = 0; i < 3; i++){
        if (!between) continue;
        if (!(total_score[i] <= puni_target[i] && puni_target_min[i] <= total_score[i])) between = false;
    }
    return between;
}

onmessage = function (e) {
    [puni_target, ordered, show_icons, item_category_rank_matrix, is_range, puni_target_min] = e.data

    if (!ordered) {
        puni_target.sort(function (a, b) { return a - b })
    }

    let success_match = false;

    for (let p of permutation) {
        let item_permutation = [];

        for (let i of itertoolsCombinations(item_category_rank_matrix, p.length)) {
            item_permutation.push(zip([i, p]));
        }

        for (item_combo of item_permutation) {
            success_match = false;

            let total_score = sum_score(item_combo),
                total_score_unsorted = Array.from(total_score);

            if (!is_range){
                if (!ordered) total_score.sort(function (a, b) { return a - b });
                if (JSON.stringify(total_score) == JSON.stringify(puni_target)) success_match = true;
            }else{
                if (is_between(puni_target, puni_target_min, total_score)) success_match = true;
            }

            if (success_match) postMessage([item_combo, total_score_unsorted, show_icons]);
        }
    }
    postMessage(true);
};