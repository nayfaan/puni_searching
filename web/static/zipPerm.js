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

onmessage = function (e) {
    [puni_target, ordered, show_icons, item_category_rank_matrix] = e.data

    if (!ordered) {
        puni_target.sort(function (a, b) { return a - b })
    }

    for (let p of permutation) {
        let item_permutation = [];

        for (let i of itertoolsCombinations(item_category_rank_matrix, p.length)) {
            item_permutation.push(zip([i, p]));
        }

        for (item_combo of item_permutation) {
            let total_score = sum_score(item_combo),
                total_score_unsorted = Array.from(total_score);

            if (!ordered) total_score.sort(function (a, b) { return a - b });

            if (JSON.stringify(total_score) == JSON.stringify(puni_target)) postMessage([item_combo, total_score_unsorted, show_icons]);
        }
    }
    postMessage(true);
};