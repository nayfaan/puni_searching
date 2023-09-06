import itertools
from input.__data import value, items, craftables, permutation


def run(settings):
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

    return (permutation, item_category_rank_matrix)


if __name__ == "__main__":
    from services.__tk_init import tk_init
    import os

    settings = tk_init()
    os.system('clear')
    print(run(settings))