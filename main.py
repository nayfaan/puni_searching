import json
import itertools

from __data import value, items, craftables, rank, permutation

def minmax(low, num, high):
    return max(min(high, num), low)


def sum_score(feed_list):
    total = [0, 0, 0]
    for feed in feed_list:
        total = [total[i] + feed[1] * feed[0][3][i] for i in range(len(feed[0][3]))]

    total = [minmax(0, 20 + t, 100) for t in total]
    return total

def print_result(item_combo,total_score):    
    print("Score:", total_score)
    
    for item in item_combo:
        item_name = item[0][0]
        item_attr = item[0][1]
        item_rank = item[0][2]
        item_base_attr = [i for i in items[item_name][0:4] if i is not None]
        
        item_add_attr = [i for i in item_attr if i not in item_base_attr]
        
        print_line = str(item[1]) + " * " + item_name + " (" + item_rank + ")"
        if item_add_attr:
            print_line += (" | " + str(item_add_attr))
        print(print_line)
        
    print()

def run():
    cratable_only = None
    while not (cratable_only or cratable_only == False):
        cratable_only_input = input("Use craftables only? ")
        cratable_only_input = cratable_only_input.lower()
        if cratable_only_input in ["y", "yes", "t", "true", 1]:
            cratable_only = True
        if cratable_only_input in ["n", "no", "f", "false", 0]:
            cratable_only = False
    
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
                [name, categories, rank_name, [score_0, score_1, score_2]]) 
    
    for p in permutation:
        item_permutation = [list(zip(i, p)) for i in itertools.permutations(item_category_rank_matrix, len(p))]
        
        for item_combo in item_permutation:
            total_score = sum_score(item_combo)
            
            total_score_sort = total_score[:]
            total_score_sort.sort()
            
            if total_score_sort == [94, 100, 100]:
                 print_result(item_combo,total_score)


if __name__ == "__main__":
    run()
