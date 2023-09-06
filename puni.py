import itertools
# import os
from input.__data import value, items, craftables, permutation
# from services.__tk_init import tk_init


def clamp(low, num, high):
    return max(min(high, num), low)


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


def run(settings):
    # os.system('clear')
    results = ""
    (target, (cratable_only, best_only, ordered)) = settings

    if best_only:
        rank = {"S": 5}
    else:
        rank = {"S": 5, "A": 4, "B": 3, "C": 2, "D": 1, "E": 0}

    item_category_matrix = list()

    for item, data in items.items():
        if not (cratable_only and item not in craftables):
            base_attr = [i for i in data[0:4] if i is not None]
            add_attr = [i for i in data[4:6] if i is not None]

            add_attr_comb = [[item] + base_attr]

            if add_attr:
                for L in range(1, len(add_attr)+1):
                    for subet in itertools.combinations(add_attr, L):
                        add_attr_comb.append(
                            [item] + base_attr + [i for i in subet if i is not None])

            item_category_matrix += add_attr_comb

    item_category_rank_matrix = list()
    for item_category in item_category_matrix:
        name = item_category[0]
        categories = item_category[1:]

        if not (best_only and not categories == [i for i in items[name] if i is not None]):
            for rank_name, rank_index in rank.items():
                score_0 = 0
                score_1 = 0
                score_2 = 0

                for category in categories:
                    category_scores = value[category][0]
                    multiplier = value[category][1][rank_index]

                    score_0 += multiplier * category_scores[0]
                    score_1 += multiplier * category_scores[1]
                    score_2 += multiplier * category_scores[2]

                item_category_rank_matrix.append(
                    (name, tuple(categories), rank_name, (score_0, score_1, score_2)))
    

    if not ordered:
        target.sort()
    for p in permutation:
        item_permutation = [list(zip(i, p)) for i in itertools.permutations(
            item_category_rank_matrix, len(p))]

        item_permutation = reduce_zip(item_permutation)

        for item_combo in item_permutation:
            total_score = sum_score(item_combo)

            total_score_sort = total_score[:]
            if not ordered:
                total_score_sort.sort()

            if total_score_sort == target:
                results += print_result(item_combo, total_score)
    
    return results


if __name__ == "__main__":
    from services.__tk_init import tk_init
    settings = tk_init()
    
    print(run(settings))
