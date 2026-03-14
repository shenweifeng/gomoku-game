// 游戏状态
const BOARD_SIZE = 15;
let board = [];
let currentPlayer = 'black'; // 玩家执黑
let gameOver = false;
let moveHistory = [];

// 初始化棋盘
function initBoard() {
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    currentPlayer = 'black';
    gameOver = false;
    moveHistory = [];
    renderBoard();
    updateStatus('黑方回合');
}

// 渲染棋盘
function renderBoard() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            // 添加星位（天元和四个角星）
            if (isStarPoint(row, col)) {
                cell.classList.add('star');
            }

            // 添加棋子
            if (board[row][col]) {
                const piece = document.createElement('div');
                piece.className = `piece ${board[row][col]}`;
                cell.appendChild(piece);
            }

            cell.addEventListener('click', () => handleClick(row, col));
            boardEl.appendChild(cell);
        }
    }
}

// 判断是否为星位点
function isStarPoint(row, col) {
    const starPoints = [[3, 3], [3, 11], [11, 3], [11, 11], [7, 7]];
    return starPoints.some(([r, c]) => r === row && c === col);
}

// 处理点击
function handleClick(row, col) {
    if (gameOver || board[row][col] || currentPlayer !== 'black') {
        return;
    }

    // 玩家落子
    makeMove(row, col, 'black');

    // 检查胜负
    if (checkWin(row, col, 'black')) {
        gameOver = true;
        highlightWinningPieces(row, col, 'black');
        updateStatus('黑方获胜！');
        return;
    }

    // 检查平局
    if (isBoardFull()) {
        gameOver = true;
        updateStatus('平局！');
        return;
    }

    // AI回合
    currentPlayer = 'white';
    updateStatus('白方思考中...');

    setTimeout(() => {
        const aiMove = getAIMove();
        makeMove(aiMove.row, aiMove.col, 'white');

        if (checkWin(aiMove.row, aiMove.col, 'white')) {
            gameOver = true;
            highlightWinningPieces(aiMove.row, aiMove.col, 'white');
            updateStatus('白方获胜！');
            return;
        }

        if (isBoardFull()) {
            gameOver = true;
            updateStatus('平局！');
            return;
        }

        currentPlayer = 'black';
        updateStatus('黑方回合');
    }, 300);
}

// 落子
function makeMove(row, col, player) {
    board[row][col] = player;
    moveHistory.push({ row, col, player });
    renderBoard();
}

// 更新状态显示
function updateStatus(text) {
    document.getElementById('status').textContent = text;
}

// 检查获胜
function checkWin(row, col, player) {
    const directions = [
        [[0, 1], [0, -1]],   // 水平
        [[1, 0], [-1, 0]],   // 垂直
        [[1, 1], [-1, -1]], // 对角线
        [[1, -1], [-1, 1]]  // 反对角线
    ];

    for (const [dir1, dir2] of directions) {
        let count = 1;

        // 正方向
        let r = row + dir1[0];
        let c = col + dir1[1];
        while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
            count++;
            r += dir1[0];
            c += dir1[1];
        }

        // 反方向
        r = row + dir2[0];
        c = col + dir2[1];
        while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
            count++;
            r += dir2[0];
            c += dir2[1];
        }

        if (count >= 5) {
            return true;
        }
    }

    return false;
}

// 高亮获胜棋子
function highlightWinningPieces(row, col, player) {
    const directions = [
        [[0, 1], [0, -1]],
        [[1, 0], [-1, 0]],
        [[1, 1], [-1, -1]],
        [[1, -1], [-1, 1]]
    ];

    for (const [dir1, dir2] of directions) {
        const pieces = [[row, col]];

        // 正方向
        let r = row + dir1[0];
        let c = col + dir1[1];
        while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
            pieces.push([r, c]);
            r += dir1[0];
            c += dir1[1];
        }

        // 反方向
        r = row + dir2[0];
        c = col + dir2[1];
        while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
            pieces.push([r, c]);
            r += dir2[0];
            c += dir2[1];
        }

        if (pieces.length >= 5) {
            pieces.forEach(([pr, pc]) => {
                const cell = document.querySelector(`.cell[data-row="${pr}"][data-col="${pc}"] .piece`);
                if (cell) {
                    cell.classList.add('winning');
                }
            });
            return;
        }
    }
}

// 检查棋盘是否已满
function isBoardFull() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (!board[row][col]) {
                return false;
            }
        }
    }
    return true;
}

// AI相关函数
function getAIMove() {
    let bestScore = -Infinity;
    let bestMoves = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (!board[row][col]) {
                const score = evaluatePosition(row, col);
                if (score > bestScore) {
                    bestScore = score;
                    bestMoves = [{ row, col }];
                } else if (score === bestScore) {
                    bestMoves.push({ row, col });
                }
            }
        }
    }

    // 随机选择最佳位置之一
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

// 评估位置分数
function evaluatePosition(row, col) {
    let score = 0;

    // 评估进攻价值（白方AI）
    score += evaluateForPlayer(row, col, 'white') * 1.1;

    // 评估防守价值（阻止黑方）
    score += evaluateForPlayer(row, col, 'black');

    // 中心位置加分
    const center = Math.floor(BOARD_SIZE / 2);
    const distFromCenter = Math.abs(row - center) + Math.abs(col - center);
    score += (BOARD_SIZE - distFromCenter) * 0.5;

    return score;
}

// 为特定玩家评估位置
function evaluateForPlayer(row, col, player) {
    const directions = [
        [0, 1],   // 水平
        [1, 0],   // 垂直
        [1, 1],   // 对角线
        [1, -1]   // 反对角线
    ];

    let totalScore = 0;

    for (const [dr, dc] of directions) {
        const line = getLine(row, col, dr, dc, player);
        totalScore += scoreLine(line, player);
    }

    return totalScore;
}

// 获取一条线上的棋子情况
function getLine(row, col, dr, dc, player) {
    const line = {
        count: 1,
        openEnds: 0,
        blocked: 0
    };

    // 正方向
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        if (board[r][c] === player) {
            line.count++;
            r += dr;
            c += dc;
        } else if (!board[r][c]) {
            line.openEnds++;
            break;
        } else {
            line.blocked++;
            break;
        }
    }

    // 边界情况
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) {
        line.blocked++;
    }

    // 反方向
    r = row - dr;
    c = col - dc;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        if (board[r][c] === player) {
            line.count++;
            r -= dr;
            c -= dc;
        } else if (!board[r][c]) {
            line.openEnds++;
            break;
        } else {
            line.blocked++;
            break;
        }
    }

    // 边界情况
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) {
        line.blocked++;
    }

    return line;
}

// 根据连子情况评分
function scoreLine(line, player) {
    const { count, openEnds, blocked } = line;

    // 五连 - 必胜
    if (count >= 5) {
        return 100000;
    }

    // 被双堵
    if (blocked >= 2) {
        return 0;
    }

    // 活四
    if (count === 4 && openEnds === 2) {
        return 10000;
    }

    // 冲四
    if (count === 4 && openEnds === 1) {
        return 1000;
    }

    // 活三
    if (count === 3 && openEnds === 2) {
        return 1000;
    }

    // 冲三
    if (count === 3 && openEnds === 1) {
        return 100;
    }

    // 活二
    if (count === 2 && openEnds === 2) {
        return 100;
    }

    // 冲二
    if (count === 2 && openEnds === 1) {
        return 10;
    }

    return count;
}

// 悔棋
function undoMove() {
    if (gameOver || moveHistory.length < 2) {
        return;
    }

    // 撤销AI和玩家的最后一步
    for (let i = 0; i < 2; i++) {
        const lastMove = moveHistory.pop();
        board[lastMove.row][lastMove.col] = null;
    }

    currentPlayer = 'black';
    updateStatus('黑方回合');
    renderBoard();
}

// 事件监听
document.getElementById('restart').addEventListener('click', initBoard);
document.getElementById('undo').addEventListener('click', undoMove);

// 初始化游戏
initBoard();