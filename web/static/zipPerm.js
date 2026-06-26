importScripts("./data.js");

var score_item_category_rank_matrix;
var score_list;
var pos_cap;
var neg_cap;
var puni_target;
var puni_target_min;
var ordered;
var is_range;
var low_band;
var high_band;
var worker_count;
var worker_index;

function clamp(min, num, max) {
    return num <= min ? min : num >= max ? max : num;
}

function encode_vec(v) {
    return (v[0] + 512) * 1048576 + (v[1] + 512) * 1024 + (v[2] + 512);
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
    let score_code = null;

    for (let x of score_list_repeat) {
        let x_code = encode_vec(x);
        if (condensed_score_list_repeat.length == 0 && repeat == 0) {
            score = x;
            score_code = x_code;
            repeat = 1;
        } else if (x_code == score_code) {
            repeat++;
        } else {
            condensed_score_list_repeat.push([score, repeat]);
            score = x;
            score_code = x_code;
            repeat = 1;
        }
    }
    condensed_score_list_repeat.push([score, repeat]);

    return condensed_score_list_repeat;
}

function perm_with_repeat(arr) {
    const sorted = arr.slice().sort((a, b) => encode_vec(a) - encode_vec(b));
    const codes = sorted.map(encode_vec);
    const result = [];
    const used = new Set();

    function permute(curr, curr_codes) {
        if (curr.length === sorted.length) {
            const permutation_key = curr_codes.join("|");
            if (!used.has(permutation_key)) {
                result.push([...curr]);
                used.add(permutation_key);
            }
            return;
        }

        for (let i = 0; i < sorted.length; i++) {
            if (used.has(i) || (i > 0 && codes[i] === codes[i - 1] && !used.has(i - 1))) {
                continue;
            }

            curr.push(sorted[i]);
            curr_codes.push(codes[i]);
            used.add(i);

            permute(curr, curr_codes);

            curr.pop();
            curr_codes.pop();
            used.delete(i);
        }
    }

    permute([], []);
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

        postMessage({ type: "result", item_combo: item_combo, total_score_unsorted: total_score_unsorted });
    }
}

function determine_match(score_list_repeat) {
    let success_match = false;

    let total_score = sum_score(score_list_repeat);
    let total_score_unsorted = Array.from(total_score);

    if (!is_range) {
        if (!ordered) total_score.sort(function (a, b) { return a - b });
        if (total_score[0] === puni_target[0] && total_score[1] === puni_target[1] && total_score[2] === puni_target[2]) success_match = true;
    } else {
        if (is_between(puni_target, puni_target_min, total_score)) success_match = true;
    }

    if (success_match) {
        let condensed_score_list_repeat = condense_score_list_repeat(score_list_repeat);
        post_success_match(condensed_score_list_repeat, total_score_unsorted);
    }
}

function evaluate_leaf(chosen_idx, chosen_count, depth) {
    let score_list_repeat = [];
    for (let j = 0; j < depth; j++) {
        let v = score_list[chosen_idx[j]];
        for (let c = 0; c < chosen_count[j]; c++) score_list_repeat.push(v);
    }

    let score_pos_neg = score_separate_pos_neg(score_list_repeat);
    if (check_require_perm(score_pos_neg)) {
        let score_list_perm = perm_with_repeat(score_list_repeat);
        for (let score_list_perm_item of score_list_perm) {
            determine_match(score_list_perm_item);
        }
    } else {
        determine_match(score_list_repeat);
    }
}

function reachable(pp0, pp1, pp2, pn0, pn1, pn2, slots_left, start) {
    let pc = pos_cap[start], nc = neg_cap[start];

    let mx = 20 + pp0 + slots_left * pc[0]; if (mx > 100) mx = 100;
    let mn = 20 + pn0 + slots_left * nc[0]; if (mn < 0) mn = 0;
    if (mx < low_band[0] || mn > high_band[0]) return false;

    mx = 20 + pp1 + slots_left * pc[1]; if (mx > 100) mx = 100;
    mn = 20 + pn1 + slots_left * nc[1]; if (mn < 0) mn = 0;
    if (mx < low_band[1] || mn > high_band[1]) return false;

    mx = 20 + pp2 + slots_left * pc[2]; if (mx > 100) mx = 100;
    mn = 20 + pn2 + slots_left * nc[2]; if (mn < 0) mn = 0;
    if (mx < low_band[2] || mn > high_band[2]) return false;

    return true;
}

function search_tier(k) {
    let n = score_list.length;
    if (k <= n) {
        let chosen_idx = new Array(k);
        let chosen_count = new Array(k);

        function rec(depth, start, used_slots, pp0, pp1, pp2, pn0, pn1, pn2) {
            if (depth === k) {
                if (used_slots === 6) evaluate_leaf(chosen_idx, chosen_count, k);
                return;
            }

            let types_left = k - depth;
            let slots_left = 6 - used_slots;
            if (slots_left < types_left) return;
            if (!reachable(pp0, pp1, pp2, pn0, pn1, pn2, slots_left, start)) return;

            let max_start = n - types_left;
            let max_count = slots_left - (types_left - 1);

            for (let i = start; i <= max_start; i++) {
                if (depth === 0 && (i % worker_count) !== worker_index) continue;

                let v = score_list[i];
                let vp0 = v[0] > 0 ? v[0] : 0, vp1 = v[1] > 0 ? v[1] : 0, vp2 = v[2] > 0 ? v[2] : 0;
                let vn0 = v[0] < 0 ? v[0] : 0, vn1 = v[1] < 0 ? v[1] : 0, vn2 = v[2] < 0 ? v[2] : 0;

                let cp0 = 0, cp1 = 0, cp2 = 0, cn0 = 0, cn1 = 0, cn2 = 0;
                chosen_idx[depth] = i;
                for (let c = 1; c <= max_count; c++) {
                    cp0 += vp0; cp1 += vp1; cp2 += vp2;
                    cn0 += vn0; cn1 += vn1; cn2 += vn2;
                    chosen_count[depth] = c;
                    rec(depth + 1, i + 1, used_slots + c,
                        pp0 + cp0, pp1 + cp1, pp2 + cp2,
                        pn0 + cn0, pn1 + cn1, pn2 + cn2);
                }
            }
        }

        rec(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    postMessage({ type: "tierdone", k: k });
}

function build_caps() {
    let n = score_list.length;
    pos_cap = new Array(n + 1);
    neg_cap = new Array(n + 1);
    pos_cap[n] = [0, 0, 0];
    neg_cap[n] = [0, 0, 0];
    for (let i = n - 1; i >= 0; i--) {
        let v = score_list[i];
        pos_cap[i] = [
            Math.max(pos_cap[i + 1][0], v[0] > 0 ? v[0] : 0),
            Math.max(pos_cap[i + 1][1], v[1] > 0 ? v[1] : 0),
            Math.max(pos_cap[i + 1][2], v[2] > 0 ? v[2] : 0)
        ];
        neg_cap[i] = [
            Math.min(neg_cap[i + 1][0], v[0] < 0 ? v[0] : 0),
            Math.min(neg_cap[i + 1][1], v[1] < 0 ? v[1] : 0),
            Math.min(neg_cap[i + 1][2], v[2] < 0 ? v[2] : 0)
        ];
    }
}

function build_band() {
    if (!ordered) {
        let lo = Math.min(puni_target[0], puni_target[1], puni_target[2]);
        let hi = Math.max(puni_target[0], puni_target[1], puni_target[2]);
        low_band = [lo, lo, lo];
        high_band = [hi, hi, hi];
    } else if (is_range) {
        low_band = [puni_target_min[0], puni_target_min[1], puni_target_min[2]];
        high_band = [puni_target[0], puni_target[1], puni_target[2]];
    } else {
        low_band = [puni_target[0], puni_target[1], puni_target[2]];
        high_band = [puni_target[0], puni_target[1], puni_target[2]];
    }
}

onmessage = function (e) {
    let msg = e.data;

    if (msg.cmd === "init") {
        score_item_category_rank_matrix = msg.score_item_category_rank_matrix;
        puni_target = msg.puni_target;
        puni_target_min = msg.puni_target_min;
        ordered = msg.ordered;
        is_range = msg.is_range;
        worker_count = msg.worker_count;
        worker_index = msg.worker_index;

        if (!ordered) puni_target.sort(function (a, b) { return a - b });

        score_list = Object.keys(score_item_category_rank_matrix).map((s) => JSON.parse(s));

        build_caps();
        build_band();
    } else if (msg.cmd === "tier") {
        search_tier(msg.k);
    }
};
