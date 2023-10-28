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

function sum_score(score_list) {
    let temp_score_list = Array.from(score_list);
    temp_score_list.unshift([20, 20, 20]);
    let total = temp_score_list.reduce((r, a) => r.map((b, i) => clamp(0, a[i] + b, 100)));
    return total;
}

function is_between(puni_target, puni_target_min, total_score) {
    let between = true;
    for (let i = 0; i < 3; i++) {
        if (!between) continue;
        if (!(total_score[i] <= puni_target[i] && puni_target_min[i] <= total_score[i])) between = false;
    }
    return between;
}

function score_separate_pos_neg(score_list_repeat) {
    let pos = [0, 0, 0],
        neg = [0, 0, 0];

    for (let score of score_list_repeat) {
        for (let i in score) {
            if (score[i] > 0) pos[i] += score[i];
            else if (score[i] < 0) neg[i] += score[i];
        }
    }

    return [pos, neg];
}

function check_require_perm(score_pos_neg) {
    let [pos, neg] = score_pos_neg;
    let require_perm = false;

    for (let i = 0; i < 3; i++) {
        if ((pos[i] > 80 && neg[i] != 0) || (pos[i] != 0 && neg[i] < -20)) require_perm = true;
    }

    return require_perm;
}

function condense_score_list_repeat(score_list_repeat) {
    let condensed_score_list_repeat = [];
    let score = [],
        repeat = 0;

    for (let x of score_list_repeat) {
        if (condensed_score_list_repeat.length == 0 && repeat == 0) {
            score = x;
            repeat = 1;
        } else if (JSON.stringify(x) == JSON.stringify(score)) {
            repeat++;
        } else {
            condensed_score_list_repeat.push([score, repeat]);
            score = x;
            repeat = 1;
        }
    }
    condensed_score_list_repeat.push([score, repeat]);

    return condensed_score_list_repeat;
}

function perm_with_repeat(arr) {
    const result = [];
    const used = new Set();

    function permute(curr) {
        if (curr.length === arr.length) {
            const permutationString = JSON.stringify(curr);
            if (!used.has(permutationString)) {
                result.push([...curr]);
                used.add(permutationString);
            }
            return;
        }

        for (let i = 0; i < arr.length; i++) {
            if (used.has(i) || (i > 0 && JSON.stringify(arr[i]) === JSON.stringify(arr[i - 1]) && !used.has(i - 1))) {
                continue; // Skip duplicates
            }

            curr.push(arr[i]);
            used.add(i);

            permute(curr);

            curr.pop();
            used.delete(i);
        }
    }

    arr.sort((a, b) => JSON.stringify(a) > JSON.stringify(b) ? 1 : -1);
    permute([]);
    return result;
}

function generateCombinations(dictionary) {
    const keys = Object.keys(dictionary);
    const combinations = [];

    function combineArrays(index, currentCombination) {
        if (index === keys.length) {
            combinations.push({ ...currentCombination });
            return;
        }

        const key = keys[index];
        const array = dictionary[key];

        for (const element of array) {
            currentCombination[key] = element;
            combineArrays(index + 1, currentCombination);
            delete currentCombination[key];
        }
    }

    combineArrays(0, {});
    return combinations;
}

function post_success_match(condensed_score_list_repeat, total_score_unsorted) {
    let unique_score_array = []
    for (let condensed_score of condensed_score_list_repeat) {
        unique_score_array.push(condensed_score[0]);
    }
    unique_score_array = unique_score_array.filter((t = {}, a => !(t[a] = a in t)));

    let unique_score_array_options = {}
    unique_score_array.forEach((e) => unique_score_array_options[JSON.stringify(e)] = score_item_category_rank_matrix[JSON.stringify(e)])

    let unique_item_list = generateCombinations(unique_score_array_options);

    for (let unique_item_combo of unique_item_list) {
        let item_combo = [];
        for (let condensed_score of condensed_score_list_repeat) {
            let [score_array, repeat] = condensed_score;
            let score_array_str = JSON.stringify(score_array)

            let item_data = [unique_item_combo[score_array_str], repeat];
            item_combo.push(item_data);
        }

        postMessage([item_combo, total_score_unsorted]);
    }
}

function determine_match(score_list_repeat, settings) {
    let [is_range, ordered, puni_target, puni_target_min] = settings;
    let success_match = false;

    let total_score = sum_score(score_list_repeat);
    let total_score_unsorted = Array.from(total_score);

    if (!is_range) {
        if (!ordered) total_score.sort(function (a, b) { return a - b });
        if (JSON.stringify(total_score) == JSON.stringify(puni_target)) success_match = true;
    } else {
        if (is_between(puni_target, puni_target_min, total_score)) success_match = true;
    }

    let condensed_score_list_repeat = condense_score_list_repeat(score_list_repeat)
    if (success_match) post_success_match(condensed_score_list_repeat, total_score_unsorted);
}

onmessage = function (e) {
    [puni_target, ordered, score_item_category_rank_matrix, is_range, max_type, puni_target_min] = e.data;
    let settings = [is_range, ordered, puni_target, puni_target_min];

    let score_list = Object.keys(score_item_category_rank_matrix).map((e) => JSON.parse(e));

    if (!ordered) {
        puni_target.sort(function (a, b) { return a - b });
    }

    let item_permutation = [];

    for (let p of permutation) {
        if (p.length <= max_type) {
            item_permutation = [];

            for (let i of itertoolsCombinations(score_list, p.length)) {
                let item_combo = zip([i, p]);
                let score_list_repeat = [];

                for (let feed of item_combo) {
                    let [score_array, repeat_count] = feed;
                    for (let i = 0; i < repeat_count; i++) {
                        score_list_repeat.push(score_array);
                    }
                }

                let score_pos_neg = score_separate_pos_neg(score_list_repeat);
                let require_perm = check_require_perm(score_pos_neg);

                if (require_perm) {
                    let score_list_perm = perm_with_repeat(score_list_repeat);

                    for (score_list_perm_item of score_list_perm) {
                        determine_match(score_list_perm_item, settings);
                    }
                } else {
                    determine_match(score_list_repeat, settings);
                }
            }
        }
    }
    postMessage(true);
};