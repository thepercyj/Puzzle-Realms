input = '''
 1 
111
 1

 22
22 
2

3
33
3
3

44
 4
44

5
5
5
5

66
6

 7
 7
 7
77

 8
88
88

 9
 9
99
9 

aa
aa

  b
  b
bbb

c
c
cc
'''


def trim_line(x):
    for i in range(len(x), 0, -1):
        if x[i - 1] != ' ':
            return x[0:i]
    return ''


def pad(x, n):
    x = x + '        '
    return x[:n]


def trim_shape(x):
    # print(x)
    n = max([len(trim_line(line)) for line in x.split('\n')])
    ans = [pad(line, n) for line in x.split('\n') if trim_line(line) != '']
    # print(ans)
    return ans


def horizintal_mirror(piece):
    return [x[::-1] for x in piece]


def vertical_mirror(piece):
    return piece[::-1]


def rotate(piece):
    n = len(piece[0])
    ans = [[] for _ in range(n)]
    for line in piece:
        for i, col in enumerate(line):
            ans[i].append(col)
    ans = [''.join(x) for x in ans]
    return ans


def to_str(piece):
    return '\n'.join(piece)


def print_board_html(board, i):
    ans = []
    ans.append(f"solution {i}<br> <table>")
    for row in board:
        ans.append('<tr>')
        for cell in row:
            ans.append(f"<td class='s{cell}'></td>")
        ans.append('</tr>')
    ans.append('</table>\n')
    with open('solution.html', 'a') as fd:
        fd.writelines(ans)


def print_board(board):
    print('---------------')
    for line in board:
        print(''.join(line))


def get_call_rotations(piece):
    h = {}

    def add(x):
        h[to_str(x)] = x

    for i in range(4):
        add(piece)
        add(horizintal_mirror(piece))
        add(vertical_mirror(piece))
        add(horizintal_mirror(vertical_mirror(piece)))
        piece = rotate(piece)
    return h.values()


def print_piece(v):
    print('.' * (len(v[0]) + 2))
    for x in v:
        print('.' + x + '.')
    print('\n')
    return
    lines = x
    m = len(lines)
    n = max(len(line) for line in lines)
    print('.' * (m + 2))
    for oline in lines:
        line = trim_line(oline)
        line = line + (m - len(line)) * ' '
        print('.' + line + '.')
    print('.' * (m + 2), '\n')


def make_rotations():
    ans = []
    for x in input.split('\n\n'):
        r = get_call_rotations(trim_shape(x))
        ans.append(list(r))
        '''print(len(r),'='*50)
        for r2 in r:
          print_piece(r2)'''
    return ans


def make_board(n, m):
    return [[' '] * n for i in range(m)]


import copy


def copy_board(board):
    return copy.deepcopy(board)


def has_islands(board):
    m = len(board)
    n = len(board[0])
    mark = [[' '] * len(line) for line in board]

    def count_island(i, j):
        if i < 0 or j < 0 or j >= n or i >= m:
            return 0
        nonlocal mark, board
        if mark[i][j] == ' ' and board[i][j] == ' ':
            mark[i][j] = '*'
            return 1 + count_island(i - 1, j) + count_island(i + 1, j) + count_island(i, j - 1) + count_island(i, j + 1)
        return 0

    num_islands = 0
    for i in range(m):
        for j in range(n):
            if mark[i][j] == ' ' and board[i][j] == ' ':
                ans = count_island(i, j)
                # if ans<3:
                #  return True
                if num_islands:
                    return True
                num_islands += 1
    return False


def get_placements(board, pivot_rotations):
    m = len(board)
    n = len(board[0])
    for r in pivot_rotations:
        m1 = len(r)
        n1 = len(r[0])
        for i in range(0, m - m1 + 1):
            for j in range(0, n - n1 + 1):
                def good_placement():
                    for i1 in range(m1):
                        for j1 in range(n1):
                            if r[i1][j1] != ' ' and board[i + i1][j + j1] != ' ':
                                return
                    new_board = copy_board(board)
                    for i1 in range(m1):
                        for j1 in range(n1):
                            if r[i1][j1] != ' ':
                                new_board[i + i1][j + j1] = r[i1][j1]
                    if not has_islands(new_board):
                        yield new_board

                yield from good_placement()


def write_style():
    with open('solution.html', 'w') as fd:
        fd.write('''
<link rel="stylesheet" href="style.css">

</style>
''')


def main():
    write_style()
    r = make_rotations()
    board = make_board(11, 5)
    left = list(range(len(r)))
    count = 0
    i = 0

    def f(board, left):
        nonlocal count
        count += 1
        if False and count % 1000 == 0:
            print(left)
            print_board(board)

        if (len(left) == 0):
            print('solution!')
            print_board(board)
            nonlocal i
            i += 1
            print_board_html(board, i)
            return
            # exit(1)
        pivot = left[0]
        rest = left[1:]
        pivot_rotations = r[pivot]
        for new_board in get_placements(board, pivot_rotations):
            f(new_board, rest)

    f(board, left)


main()



