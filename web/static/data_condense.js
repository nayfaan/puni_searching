function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

const rank_convert = {
    5: "S",
    4: "A",
    3: "B",
    2: "C",
    1: "D",
    0: "E"
}

const category_convert = {
    0: "(Water)",
    1: "(Plant)",
    2: "(Uni)",
    3: "(Flower)",
    4: "(Medicinal)",
    5: "(Poison)",
    6: "(Elixir)",
    7: "(Sand)",
    8: "(Stone)",
    9: "(Ore)",
    10: "(Gemstone)",
    11: "(Gunpowder)",
    12: "(Fuel)",
    13: "(Food 1)",
    14: "(Fruit)",
    15: "(Beehive)",
    16: "(Mushroom)",
    17: "(Seafood)",
    18: "(Bug)",
    19: "(Thread)",
    20: "(Lumber)",
    21: "(Gas)",
    22: "(Puniball)",
    23: "(Animal Product)",
    24: "(Dragon)",
    25: "(Mystery)",
    26: "(Supplement)",
    27: "(General Goods)",
    28: "(Metal)",
    29: "(Jewel)",
    30: "(Spice)",
    31: "(Seed)",
    32: "(Food 2)",
    33: "(Medicine)",
    34: "(Bomb)",
    35: "(Magic Tool)",
    36: "(Ingot)",
    37: "(Cloth)"
}

const item_convert = {
    0: "Clean Water",
    1: "Goat's Milk",
    2: "Plant Essence",
    3: "Roteswasser Tonic",
    4: "Foamy Water",
    5: "Jade Water",
    6: "Ether Aqua",
    7: "Nameless Grass",
    8: "Fodder",
    9: "Lucky Clover",
    10: "Blue Clover",
    11: "Poison Grass",
    12: "Wasser Wheat",
    13: "Maple Leaf",
    14: "Sweet Leaf",
    15: "Rosen Leaf",
    16: "Ancient Branch",
    17: "Uni",
    18: "Silver Uni",
    19: "Gold Uni",
    20: "Health Flower",
    21: "Northern Wind Flower",
    22: "Sunny Honey Flower",
    23: "Blessed Pure Flower",
    24: "Memorial Mist Flower",
    25: "Serene Moon Flower",
    26: "Nightglow Flower",
    27: "Lantern Grass",
    28: "Bubble Grass",
    29: "Serenity Flower",
    30: "Spring Princess",
    31: "Esplante",
    32: "Delphi Rose",
    33: "Taun",
    34: "Tall Taun",
    35: "Mutant Taun",
    36: "Triplet Taun",
    37: "Crimson Grass",
    38: "Bitter Root",
    39: "Sapling Branch",
    40: "Medicine Moss",
    41: "Fertile Soil",
    42: "Medium Medicine",
    43: "Kumine Fruit",
    44: "Kumine Poison",
    45: "Rotten Tree Bark",
    46: "Resentful Scream",
    47: "Mushroom Powder",
    48: "Death's Grief",
    49: "Forest Sage",
    50: "Dunkelheit",
    51: "Soft Sand",
    52: "Burning Sand",
    53: "Ashen Sand",
    54: "Polluted Humus",
    55: "Emerald Glass",
    56: "Sandstone",
    57: "Nectar Rock",
    58: "Eroded Stone",
    59: "Ancient Pillar",
    60: "Coral Stone",
    61: "Cave Coral",
    62: "Riverstone",
    63: "Blue Flame Riverstone",
    64: "Waterside Moss Stone",
    65: "Stalactite Fragment",
    66: "Ethereal Stone",
    67: "Crimson Ore",
    68: "Aqua Ore",
    69: "Lightning Ore",
    70: "Amatite Ore",
    71: "Koberinite",
    72: "Pentanite",
    73: "Mordinite",
    74: "Goldinite",
    75: "Cometstone",
    76: "Degenesis Stone",
    77: "Septrin",
    78: "Small Crystal",
    79: "Unknown Gemstone",
    80: "Shell Pearl",
    81: "Marbled Stone",
    82: "Amber Fragment",
    83: "Amber Crystal",
    84: "Magnemalmoa",
    85: "Holy Arbor Crystal",
    86: "Rainbow Gemstone",
    87: "Dried Lumber",
    88: "Flame Black Sand",
    89: "Magma Powder",
    90: "Scrap Paper",
    91: "Flammable Bark",
    92: "Palma Bark",
    93: "Natural Oil",
    94: "Smokey Charcoal",
    95: "Palma Charcoal",
    96: "Wild Potato",
    97: "Beast Meat",
    98: "Fresh Meat",
    99: "Kurken Fruit",
    100: "Unknown Egg",
    101: "Rainbow Grape",
    102: "Palma Fruit",
    103: "Fresh Berry",
    104: "Oil Tree Fruit",
    105: "Nectar Fruit",
    106: "Beehive",
    107: "Silver Beehive",
    108: "Gold Beehive",
    109: "Eicheloa",
    110: "Dream Mushroom",
    111: "Mushroom Colony",
    112: "Jupitonion",
    113: "Golden Crown",
    114: "Pretty Shell",
    115: "Sardine",
    116: "Exofish",
    117: "Spikey",
    118: "Selior",
    119: "Purumuru",
    120: "Crab",
    121: "Xisor",
    122: "Sawe Fish",
    123: "Mace Fish",
    124: "Myria Fish",
    125: "Lake Master",
    126: "Underworld Master",
    127: "Seven Stars",
    128: "Honey Ant",
    129: "Lantern Fly",
    130: "Rose Bee",
    131: "Giant Beetle",
    132: "Bomb Dragoon",
    133: "Spear Worm",
    134: "Amber Fly",
    135: "Lapis Papillion",
    136: "Heavy Wyrm",
    137: "Trihorn",
    138: "Restraint Silk",
    139: "Tough Vine",
    140: "Cotton Grass",
    141: "Arbor Ivy",
    142: "Eiche",
    143: "Tough Log",
    144: "Mossy Driftwood",
    145: "Palma",
    146: "Fossil Tree",
    147: "Fragrant Honey Tree",
    148: "Underworld Rotwood",
    149: "Holy Arbor Branch",
    150: "Wing Plant",
    151: "Sky Bubble",
    152: "Crispy Mushroom",
    153: "Rotwood Miasma",
    154: "Blue Puniball",
    155: "Green Puniball",
    156: "Red Puniball",
    157: "Black Puniball",
    158: "Silver Puniball",
    159: "Gold Puniball",
    160: "Large Feather",
    161: "Animal Hide",
    162: "Mythical Hide",
    163: "Large Bone",
    164: "Snake Slough",
    165: "Beast Fossil",
    166: "Fairystone Fragment",
    167: "Dark Crystal Fragment",
    168: "Holy Stone Fragment",
    169: "Magic Tome Piece",
    170: "Old Magic Tome",
    171: "Underworld Core",
    172: "Holy Tree Leaf",
    173: "Maple Bark",
    174: "Honey Tree Branch",
    175: "Spirit Flower",
    176: "Spirit Feather",
    177: "Rusted Sword",
    178: "Old Knight Emblem",
    179: "Beast Venom Pouch",
    180: "Lunatic Poison Lance",
    181: "Beast Fin",
    182: "Earth Fish Fang",
    183: "Beast Shell",
    184: "Beast Spirit Armor",
    185: "Beast Scales",
    186: "Atonement Stinger",
    187: "Fire Core",
    188: "Ice Core",
    189: "Lightning Core",
    190: "Wind Core",
    191: "Dark Core",
    192: "Dragon Meat",
    193: "Dragon Wing",
    194: "Dragon Egg",
    195: "Dragon's Eye",
    196: "Giant Puniball",
    197: "Giant Claw",
    198: "Fairy Segment",
    199: "Golem Core",
    200: "Heroic Spirit",
    201: "Eternal Fire",
    202: "Shining Sand",
    203: "Solflower",
    204: "Eternal Crystal",
    205: "Stinky Trash",
    206: "Broken Item",
    207: "Burnt Ash",
    208: "Explosive Uni",
    209: "Ice Caltrop",
    210: "Craft",
    211: "Bomb",
    212: "Ice Bomb",
    213: "Plajig",
    214: "Luft",
    215: "Norden Brand",
    216: "Lightning Bell",
    217: "Bubble Bullet",
    218: "Rose Bomb",
    219: "Kleid Ice Bomb",
    220: "Strahl Plajig",
    221: "Ratsel Luft",
    222: "Fire Bottle",
    223: "Genesis Hammer",
    224: "Vanish Siegel",
    225: "Lunar Lamp",
    226: "Eternal Fear",
    227: "Philosopher's Book",
    228: "Grass Beans",
    229: "Dry Biscuit",
    230: "Blessing Ointment",
    231: "Puni Jelly",
    232: "Rasen Pudding",
    233: "Trickling Breeze",
    234: "Restoration Bottle",
    235: "Nectar",
    236: "Healing Ball",
    237: "Dynamic Syrup",
    238: "Cocktail Leb",
    239: "Goddess Cup",
    240: "Elixir",
    241: "Fish Oil",
    242: "War Powder",
    243: "Thorny Embrace",
    244: "Energianica",
    245: "Sundry Remedy",
    246: "Poison Smoke",
    247: "Mystic Robe",
    248: "Miracle Ebonyal",
    249: "Heroic Geist",
    250: "Astronomical Clock",
    251: "Red Supplement",
    252: "Blue Supplement",
    253: "Yellow Supplement",
    254: "Green Supplement",
    255: "Polish Powder",
    256: "Zettel",
    257: "Delicious Bait",
    258: "Alchemy Paint",
    259: "Delphi Rose Incense",
    260: "Ingot",
    261: "Bronze Eisen",
    262: "Staltium",
    263: "Criminea",
    264: "Goldoterion",
    265: "Cloth",
    266: "Natural Cloth",
    267: "Beastial Air",
    268: "Sorcery Rose",
    269: "Eldrocode",
    270: "Pearl Crystal",
    271: "Amberlite",
    272: "Spirinite",
    273: "Saint's Diamond",
    274: "Arc en Ciel",
    275: "Honey",
    276: "Eltz Sugar",
    277: "Traveler's Water Orb",
    278: "Super Pure Water",
    279: "Healing Chip",
    280: "Holy Drop",
    281: "Poison Cube",
    282: "Taboo Drop",
    283: "Lightning Sand",
    284: "Marblestone",
    285: "Gunpowder Base",
    286: "Blue Flame Ember",
    287: "Mixing Oil",
    288: "Meltstone",
    289: "Flour",
    290: "Gelatin Powder",
    291: "Alchemy Fibers",
    292: "Heaven's String",
    293: "Composite Plate",
    294: "Holy Nut",
    295: "Mist Liquid",
    296: "Feather Draft",
    297: "Puni Leather",
    298: "Master Leather",
    299: "Glass Flower",
    300: "Spirit Bottle",
    301: "Crystal Element",
    302: "Philosopher's Stone",
    303: "Plant Seed",
    304: "Stone Seed",
    305: "Fire Seed",
    306: "Water Seed",
    307: "Mystic Seed",
    308: "Salt Grass",
    309: "Fairystone Block",
    310: "Building Material",
    311: "Stone Material",
    312: "Seaweed Soil",
    313: "Soft Rubber Stone",
    314: "Monster Attractor",
    315: "Powerful Fish Bait",
    316: "Resonance Orb",
    317: "Prosthetic Arm",
    318: "Super Steel Gear",
    319: "Red Stone"
}