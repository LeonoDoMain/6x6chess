/**
 * author leono
 * description 6x6棋
 * date 2023/5/20
 */

class Piece {
    constructor(type, color) {
        this.type = type;
        this.color = color;
    }
}

const board = [];
const ghistory = [];
const gstatus = {
    selected: false,
    turn: {
        counter: 1,
        color: "black",
        nextTurn: (position) => {
            judgeDeath();
            gstatus.turn.counter++;
            gstatus.turn.color = ((gstatus.turn.counter - 1) % 4 > 1) ? "red" : "black";
            gstatus.turn.position = position;
        },
        position: {
            i: -1,
            j: -1
        }
    }
}

const move = (last_position, position) => {
    const p1 = board[last_position.i][last_position.j];
    const p2 = board[position.i][position.j];

    if (p1.type === "blank" || !(p2.type === "blank")) return false;

    let success = false;

    if (p1.type === "soldier") {
        // 判断p2是不是在p1毗邻的位置
        if (
            Math.abs(position.i - last_position.i) + Math.abs(position.j - last_position.j) === 1
        ) {
            success = true;
        }
    }
    // 仿造上面的soldier写一个horse的else if，要求horse可以走周围8格
    else if (p1.type === "horse") {
        // 判断p2是不是在p1 8面毗邻的位置
        if (
            (Math.abs(position.i - last_position.i) + Math.abs(position.j - last_position.j) <= 2) &&
            !(Math.pow(position.i - last_position.i, 2) + Math.pow(position.j - last_position.j, 2) === 4)
        ) {
            success = true;
        }
    }
    if (success) {
        [board[last_position.i][last_position.j], board[position.i][position.j]] = [board[position.i][position.j], board[last_position.i][last_position.j]];
        gstatus.selected = false;
        gstatus.turn.nextTurn(position);
    }
    return success;
}

// const pieceClicked = (i, j) => {
//     // 这里改变选择状态
//     if (gstatus.selected.show) {
//         // 移动或者取消
//         if (gstatus.selected.position.i === i && gstatus.selected.position.j === j) {
//             // 取消选择
//             gstatus.selected.show = false;
//         }
//         else {
//             move(gstatus.selected.position, { i, j });
//         }
//     }
//     else {
//         // 第一次选择
//         if (board[i][j].color !== gstatus.turn.color) return;
//         if (i === gstatus.turn.position.i &&
//             j === gstatus.turn.position.j) {
//             return;
//         }
//         gstatus.selected.show = true;
//         gstatus.selected.position = { i, j };
//     }
//     // 这里改变棋盘状态
//     if (gstatus.selected.show) {
//         gstatus.selected.last_position = gstatus.selected.position;
//         boardElement.children[gstatus.selected.last_position.i].children[gstatus.selected.last_position.j].style.border = "";
//         boardElement.children[gstatus.selected.position.i].children[gstatus.selected.position.j].style.border = "black solid 1pt";
//     }
//     else {
//         boardElement.children[gstatus.selected.position.i].children[gstatus.selected.position.j].style.border = "";
//     }
//     refreshBoard();
//     refreshStatus();
// }

const pieceClicked = (i, j) => {
    const lastOperation = ghistory[ghistory.length - 1];
    const clickedPiece = board[i][j];
    if (!lastOperation) {
        // 第一次点击
        if (clickedPiece.color === gstatus.turn.color) {
            // 颜色正确
            ghistory.push({ piece: clickedPiece, position: { i, j }, selected: true });
        } else {
            return;
        }
    } else {
        if (lastOperation.selected) {
            // 如果已有棋子被选择
            if (i === lastOperation.position.i && j === lastOperation.position.j) {
                // 撤销选择
                ghistory.pop();
            } else {
                // 尝试移动
                if (move(lastOperation.position, { i, j })) {
                    ghistory.push({ piece: clickedPiece, position: { i, j }, selected: false });
                }
            }
        } else {
            // 如果没有棋子被选择
            if (clickedPiece.color === gstatus.turn.color) {
                if (lastOperation.position.i === i && lastOperation.position.j === j) return;
                ghistory.push({ piece: clickedPiece, position: { i, j }, selected: true });
            }
            else return;
        }
    }
    refreshBoard();
    refreshStatus();
}

const refreshBoard = () => {
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            let text = "";
            if (board[i][j].type === "blank") {
                text = "";
            }
            else if (board[i][j].type === "horse") {
                text = "马";
            }
            else if (board[i][j].type === "soldier") {
                text = "兵";
            }
            else if (board[i][j].type === "chariot") {
                text = "车";
            }
            boardElement.children[i].children[j].innerHTML = text;
            boardElement.children[i].children[j].style.color = board[i][j].color;
        }
    }
    if (ghistory.length >= 2)
        boardElement.children[ghistory[ghistory.length - 2].position.i].children[ghistory[ghistory.length - 2].position.j]
            .style.border = "";
    if (ghistory.length) boardElement.children[ghistory[ghistory.length - 1].position.i].children[ghistory[ghistory.length - 1].position.j].style.border =
        ghistory[ghistory.length - 1].selected ? "black solid 1pt" : "";
}

const initBoard = () => {
    for (let i = 0; i < 6; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < 6; j++) {
            const td = document.createElement('td');
            td.onclick = () => {
                pieceClicked(i, j);
            }
            tr.appendChild(td);
        }
        boardElement.appendChild(tr);
    }
    refreshBoard();
}

// const refreshBoard = () => {
//     for (let i = 0; i < 6; i++) {
//         for (let j = 0; j < 6; j++) {
//             let text = "";
//             if (board[i][j].type === "blank") {
//                 text = "";
//             }
//             else if (board[i][j].type === "horse") {
//                 text = "马";
//             }
//             else if (board[i][j].type === "soldier") {
//                 text = "兵";
//             }
//             else if (board[i][j].type === "chariot") {
//                 text = "车";
//             }
//             boardElement.children[i].children[j].innerHTML = text;
//             boardElement.children[i].children[j].style.color = board[i][j].color;
//         }
//     }
// }

const refreshStatus = () => {
    statusElement.children[0].innerHTML = `turn ${gstatus.turn.counter}\
    , ${gstatus.turn.color}'s turn\
    , last position: ${gstatus.turn.position.i}, ${gstatus.turn.position.j}`;
}

const judgeDeath = () => {
    const findDeadA = (map) => {
        let linkedBlocksGroups = new Array();
        const isInLinkedBlocksGroups = (block) => {
            for (let blocks of linkedBlocksGroups) if (blocks.some((b) => b.position.i === block.i && b.position.j === block.j)) return true;
            return false;
        }
        const lookAround = (block, linkedBlocks) => {
            const aroundBlocks = [[block.i - 1, block.j], [block.i + 1, block.j], [block.i, block.j - 1], [block.i, block.j + 1]];
            linkedBlocks.push({ position: block, alive: !!(aroundBlocks.some((b) => map[b[0]]?.[b[1]] === "C")) });
            for (const [nr, nc] of aroundBlocks) {
                if (map[nr]?.[nc] === "A") {
                    if (!isInLinkedBlocksGroups({ i: nr, j: nc }))
                        lookAround({ i: nr, j: nc }, linkedBlocks);
                }
            }
        }
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                if (map[i][j] === "A") {
                    if (isInLinkedBlocksGroups({ i, j })) continue;
                    let linkedBlocks = new Array();
                    linkedBlocksGroups.push(linkedBlocks);
                    lookAround({ i, j }, linkedBlocks);
                }
            }
        }

        return linkedBlocksGroups;
    }
    const allLinkedBlocksGroups = new Array();
    for (color of ["red", "black"]) {
        let map = Array(6).fill(0).map(() => Array(6).fill("C"));
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                if (board[i][j].color === color) {
                    map[i][j] = "A";
                }
            }
        }
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                if (board[i][j].color !== color && board[i][j].color !== null) {
                    map[i][j] = "B";
                }
            }
        }
        allLinkedBlocksGroups.push(findDeadA(map));
    }
    for (const linkedBlocksGroups of allLinkedBlocksGroups) {
        for (const linkedBlocks of linkedBlocksGroups) {
            if (linkedBlocks.some((b) => b.alive)) continue;
            for (const block of linkedBlocks) {
                board[block.position.i][block.position.j] = new Piece("blank", null);
            }
        }
    }
    refreshBoard();
}

const init = () => {
    boardElement = document.querySelector("#board");
    statusElement = document.querySelector("#status");
    board.push(...[
        [new Piece("soldier", "red"), new Piece("horse", "red"), new Piece("soldier", "red"), new Piece("blank", null), new Piece("blank", null), new Piece("blank", null)],
        [new Piece("soldier", "black"), new Piece("soldier", "black"), new Piece("soldier", "black"), new Piece("blank", null), new Piece("blank", null), new Piece("blank", null)],
        [new Piece("blank", null), new Piece("blank", null), new Piece("blank", null), new Piece("blank", null), new Piece("blank", null), new Piece("blank", null)],
        [new Piece("blank", null), new Piece("horse", "black"), new Piece("blank", null), new Piece("blank", null), new Piece("blank", null), new Piece("blank", null)],
        [new Piece("blank", null), new Piece("horse", "black"), new Piece("soldier", "red"), new Piece("blank", null), new Piece("blank", null), new Piece("blank", null)],
        [new Piece("blank", null), new Piece("horse", "black"), new Piece("blank", null), new Piece("blank", null), new Piece("blank", null), new Piece("blank", null)]
    ]);
    initBoard();
}