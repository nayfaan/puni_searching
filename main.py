import json

def run():
    value_stream = open("input/value.txt", 'r')
    value = json.load(value_stream)
    value_stream.close()
    
    items_stream = open("input/items.txt", 'r')
    items = json.load(items_stream)
    items_stream.close()
    
    print(json.dumps(value, sort_keys=True, indent=4))
    print(json.dumps(items, sort_keys=True, indent=4))
    
    rank = {
        "S": 5,
        "A": 4,
        "B": 3,
        "C": 2,
        "D": 1,
        "E": 0
        }
if __name__ == "__main__":
    run()
