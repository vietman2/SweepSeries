from random import choice, randrange

def random_color_generator():
    return f'#{randrange(256):02X}{randrange(256):02X}{randrange(256):02X}'

def random_nickname_generator():
    with open('core/data/nickname/adjectives.txt', 'r', encoding='utf-8') as adj_file:
        adjectives = adj_file.read().split(',')

    with open('core/data/nickname/characters.txt', 'r', encoding='utf-8') as char_file:
        characters = char_file.read().split(',')

    adjectives = [adj.strip() for adj in adjectives]
    characters = [char.strip() for char in characters]

    random_adj = choice(adjectives)
    random_char = choice(characters)

    return f'{random_adj} {random_char}'
