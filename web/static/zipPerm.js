importScripts("./data.js"); importScripts("./itertoolsCombinations.js");

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

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

function calculate_score(categories, rank_index) {
    let [score_0, score_1, score_2] = [0, 0, 0];

    for (let category of categories) {
        let category_scores = value[category][0];
        let multiplier = value[category][1][rank_index];

        score_0 += multiplier * category_scores[0];
        score_1 += multiplier * category_scores[1];
        score_2 += multiplier * category_scores[2];
    }

    return [score_0, score_1, score_2]
}

function sum_score(feed_list) {
    let total = [20, 20, 20];

    for (let feed of feed_list) {
        [_, categories, rank_index] = feed[0];
        score_array = calculate_score(categories, rank_index)

        for (let i = 0; i < 3; i++) {
            total[i] += feed[1] * score_array[i];
        }
    }

    for (let i = 0; i < 3; i++) total[i] = clamp(0, total[i], 100);

    return total
}

function is_between(puni_target, puni_target_min, total_score) {
    let between = true;
    for (let i = 0; i < 3; i++) {
        if (!between) continue;
        if (!(total_score[i] <= puni_target[i] && puni_target_min[i] <= total_score[i])) between = false;
    }
    return between;
}

onmessage = function (e) {
    [puni_target, ordered, item_category_rank_matrix, is_range, max_type, puni_target_min] = e.data;

    if (!ordered) {
        puni_target.sort(function (a, b) { return a - b });
    }

    let success_match = false;
    let item_permutation = [];

    for (let p of permutation) {
        if (p.length <= max_type) {
            item_permutation = [];

            for (let i of itertoolsCombinations(item_category_rank_matrix, p.length)) {
                item_permutation.push(zip([i, p]));
            }
            console.log(p, item_permutation.length, JSON.stringify(item_permutation[0]))


            for (item_combo of item_permutation) {
                success_match = false;

                let total_score = sum_score(item_combo),
                    total_score_unsorted = Array.from(total_score);

                if (!is_range) {
                    if (!ordered) total_score.sort(function (a, b) { return a - b });
                    if (JSON.stringify(total_score) == JSON.stringify(puni_target)) success_match = true;
                } else {
                    if (is_between(puni_target, puni_target_min, total_score)) success_match = true;
                }

                if (success_match) postMessage([item_combo, total_score_unsorted]);
            }
        }
    }
    postMessage(true);
};