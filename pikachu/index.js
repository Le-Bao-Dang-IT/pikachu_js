$(document).ready(function () {
    let row = 12;
    let col = 12;
    let click = false;
    let board = [];
    let indexF;
    let indexL;
    let score = 0;
    let lv = 1;
    let swapCount = 0;

    function createBoard() {
        // Tạo 1 mảng 0
        for (let i = 0; i < row; i++) {
            board[i] = [];
            for (let j = 0; j < col; j++) {
                board[i][j] = 0;
            }
        }
        // Bỏ các số ngẩu nhiên vào mảng
        while (!isFull()) {
            let rd = parseInt(Math.random() * 37 + 1);
            let p1 = randomXY();
            let p2 = randomXY();
            if (!isBorder(p1) && !isBorder(p2) && board[p1[0]][p1[1]] === 0 && board[p2[0]][p2[1]] === 0 && !(p1[0] === p2[0] && p1[1] === p2[1])) {
                board[p1[0]][p1[1]] = rd;
                board[p2[0]][p2[1]] = rd;
                console.log(" " + p1 + p2);
            }

        }
    }

    console.log(board);

    createBoard();

    function isFull() { // kiểm tra không có ô nào trống
        for (let i = 1; i < row - 1; i++) {
            for (let j = 1; j < col - 1; j++) {
                if (board[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    function isBorder(p) { // Kiểm tra cái ô ở ngoài cùng
        return (p[0] === 0 || p[0] === row - 1 || p[1] === 0 || p[1] === col - 1);
    }

    function randomXY() { // Lấy ngầu nhiên vị trí X Y
        let rdX = parseInt(Math.random() * (row - 2) + 1);
        let rdY = parseInt(Math.random() * (col - 2) + 1);
        return [rdX, rdY];
    }

    show();  // In ra màn hình
    // time();  // Thời gian

    // Chọn và kiểm tra 2 hình bất kỳ
    $(document).on('click', '.cell', function () {
        let classList = $(this).attr("class").split(/\s+/);
        $(this).css('border', '5px red solid')
        console.log(classList[classList.length - 1]);
        if (!click) {
            indexF = classList[classList.length - 1].split('-');
            click = true;
        } else {
            indexL = classList[classList.length - 1].split('-');
            click = false;
            $('.cell').css('border', 'none')
            if (!(indexF[1] === indexL[1] && indexF[2] === indexL[2]) && checkTowIndex()) { // Nếu giữa 2 hình có đường đi thì ăn được => ghi điểm
                score += 10;
                remove();
                document.getElementById('score').innerText = score;
                if (lv === 2) {
                    boardAllLeft(indexF[1], indexF[2], indexL[1], indexL[2]);
                    $('.row').remove();
                    show();
                }
                if (lv === 3) {
                    boardAllMid(indexF[1], indexF[2], indexL[1], indexL[2]);
                    $('.row').remove();
                    show();
                }
                if (lv === 4) {
                    boardRote();
                    $('.row').remove();
                    show();
                }
                console.log(board)
                if (isWinner()) {
                    alert("You win");
                    window.location.reload();
                }
            }
        }
    })

    function isWinner() { // Kiểm tra chiến thắng
        for (let i = 1; i < row - 1; i++) {
            for (let j = 1; j < col - 1; j++) {
                if (board[i][j] > 0) {
                    return false;
                }
            }
        }
        return true;
    }

    function show() { // in ra màn hình trò chơi
        for (let i = 0; i < row; i++) {
            let r = $('<div>').addClass('row');
            for (let j = 0; j < col; j++) {
                let icon = "";
                if (board[i][j] > 0) {
                    icon = "icon/icon" + board[i][j] + ".png";
                    let cell = $('<div>').addClass('col cell border cell-' + i + '-' + j);
                    let img = $('<img alt="" src="">').addClass('img img-' + i + '-' + j).attr('src', icon);
                    cell.append(img)
                    r.append(cell);
                }
                if (board[i][j] == 0) {
                    let cell = $('<div>').addClass('col cell border display-non cell-' + i + '-' + j);
                    let img = $('<img alt="" src="">').addClass('img img-none').attr('src', icon);
                    cell.append(img)
                    r.append(cell);
                }
                if (board[i][j] == -1) {
                    let cell = $('<div>').addClass('col cell border  cell-' + i + '-' + j);
                    let imgs = $('<img alt="" src="">').addClass('img ').attr('src', "icon/wall.png");
                    cell.append(imgs)
                    r.append(cell);
                }

            }
            $('#game').append(r);
        }
    }

    function remove() { // Xóa hình đã ăn
        board[indexF[1]][indexF[2]] = 0;
        board[indexL[1]][indexL[2]] = 0;
        $('.row').remove();
        show();
    }


    // Tìm đường đi giữa 2 hình trên cùng 1 hàng
    function checkLineX(y1, y2, x) {
        let min = Math.min(y1, y2);
        let max = Math.max(y1, y2);
        for (let i = min + 1; i < max; i++) {
            if (board[x][i] > 0 || board[x][i] === -1) { // Nếu các ô ở giữa 2 hình vẫn còn => không ăn được
                return false;
            }
        }
        // Nếu các ô ở giữa không có
        return true;
    };

    // Tìm đường đi giữa 2 hình trên cùng 1 cột
    function checkLineY(x1, x2, y) {
        let min = Math.min(x1, x2);
        let max = Math.max(x1, x2);
        for (let i = min + 1; i < max; i++) {
            if (board[i][y] > 0 || board[i][y] === -1) { // Nếu các ô ở giữa vẫn còn => không ăn được
                return false;
            }
        }
        // Nếu các ô giữa không có
        return true;

    }

    // Tìm đường đi giữa 2 hình trong phạm vi hình chữ nhật mở rộng theo chiều ngang
    function checkZX(x1, y1, x2, y2) {
        x1 = parseInt(x1);
        x2 = parseInt(x2);
        y1 = parseInt(y1);
        y2 = parseInt(y2)
        let minY = y1;
        let minX = x1;
        let maxY = y2;
        let maxX = x2;
        if (y1 > y2) {
            minY = y2;
            minX = x2;
            maxY = y1;
            maxX = x1;
        }
        for (let i = minY; i <= maxY; i++) {
            if (i > minY && (board[minX][i] > 0 || board[minX][i] === -1)) {
                return false;
            }
            if (board[maxX][i] === 0 || i === maxY) {
                if (checkLineY(minX, maxX, i)) {
                    if (checkLineX(i, maxY, maxX)) {
                        return true;
                    }
                }

            }
        }
        return false;
    }

    // Tìm đường đi giữa 2 hình theo phạm vi hình chữ nhật mở rộng theo chiều dọc
    function checkZY(x1, y1, x2, y2) {
        x1 = parseInt(x1);
        x2 = parseInt(x2);
        y1 = parseInt(y1);
        y2 = parseInt(y2)
        let minY = y1;
        let minX = x1;
        let maxY = y2;
        let maxX = x2;
        if (x1 > x2) {
            minY = y2;
            minX = x2;
            maxY = y1;
            maxX = x1;
        }
        for (let i = minX; i <= maxX; i++) {
            if (i > minX && (board[i][minY] > 0 || board[i][minY] === -1)) {
                return false;
            }
            if ((board[i][maxY] === 0 || i === maxX)) {
                if (checkLineX(minY, maxY, i)) {
                    if (checkLineY(i, maxX, maxY)) {
                        return true;
                    }
                }

            }
        }
        return false;
    }

    //  Tìm đường đi giữa 2 hình theo hình chữ U theo chiều ngang
    function checkUX(x1, y1, x2, y2, type) {
        x1 = parseInt(x1);
        x2 = parseInt(x2);
        y1 = parseInt(y1);
        y2 = parseInt(y2)
        let minY = y1;
        let minX = x1;
        let maxY = y2;
        let maxX = x2;
        if (y1 > y2) { // Tìm tọa độ ô có cột lớn nhất
            minY = y2;
            minX = x2;
            maxY = y1;
            maxX = x1;
        }
        let i = maxY + type;
        let row = minX;
        let col = maxY;
        if (type === -1) { // type = -1 => chiều từ phải sang trái
            col = minY;
            i = minY + type;
            row = maxX;
        }
        if ((board[row][col] === 0 || minY === maxY) && checkLineX(minY, maxY, row)) {
            while (board[minX][i] === 0 && board[maxX][i] === 0) {
                if (checkLineY(minX, maxX, i)) {
                    return true;
                }
                i += type;
            }
        }
        return false;
    }

    // Tìm đường đi giữa 2 hình theo hình chữ U theo chiều dọc
    function checkUY(x1, y1, x2, y2, type) {
        x1 = parseInt(x1);
        x2 = parseInt(x2);
        y1 = parseInt(y1);
        y2 = parseInt(y2);
        let minY = y1;
        let minX = x1;
        let maxY = y2;
        let maxX = x2;
        if (x1 > x2) { // Tìm tọa độ ô có hàng lớn nhất
            minY = y2;
            minX = x2;
            maxY = y1;
            maxX = x1;
        }
        let i = maxX + type;
        let col = minY;
        let row = maxX;
        if (type === -1) {
            row = minX;
            i = minX + type;
            col = maxY;
        }
        console.log(minY)
        if ((board[row][col] === 0 || minX === maxX) && checkLineY(minX, maxX, col)) {
            while (board[i][minY] === 0 && board[i][maxY] === 0) {
                if (checkLineX(minY, maxY, i)) {
                    return true;
                }
                i += type;
            }
        }
        return false;
    }

    // Tìm đường đi giữa hai hình

    function checkTowIndex(x1, y1, x2, y2) {
        if ((board[indexF[1]][indexF[2]] === board[indexL[1]][indexL[2]]) && board[indexF[1]][indexF[2]] !== -1 && board[indexL[1]][indexL[2]] !== -1
        ) {
            if (indexF[1] === indexL[1]) {
                if (checkLineX(indexF[2], indexL[2], indexL[1])) {
                    remove();
                    return true;
                }
            }
            if (indexF[2] === indexL[2]) {
                if (checkLineY(indexF[1], indexL[1], indexL[2])) {
                    remove();
                    return true;
                }
            }
            if (checkZX(indexF[1], indexF[2], indexL[1], indexL[2])) {
                remove();
                return true;

            }
            if (checkZY(indexF[1], indexF[2], indexL[1], indexL[2])) {
                remove();
                return true;

            }
            if (checkUX(indexF[1], indexF[2], indexL[1], indexL[2], 1)) {
                remove();
                return true;

            }
            if (checkUX(indexF[1], indexF[2], indexL[1], indexL[2], -1)) {
                remove();
                return true;
            }
            if (checkUY(indexF[1], indexF[2], indexL[1], indexL[2], 1)) {
                remove();
                return true;
            }
            if (checkUY(indexF[1], indexF[2], indexL[1], indexL[2], -1)) {
                remove();
                return true
            }
        }
        return false;
    }

    // Hoán đổi vị trí
    function swap() {
        for (let i = 1; i < row - 1; i++) {
            for (let j = 1; j < col - 1; j++) {
                if (board[i][j] !== 0) {
                    let p1 = randomXY();
                    if (!isBorder(p1) && board[p1[0]][p1[1]] !== 0 && p1[0] !== i && p1[1] !== j) {
                        let temp = board[i][j];
                        board[i][j] = board[p1[0]][p1[1]];
                        board[p1[0]][p1[1]] = temp;
                    }
                }
            }
        }
        swapCount += 1;
    }

    // Đổi vị trí khi cần
    $('#swap').click(function () {
        if (swapCount > 3) {
            alert("Đã hết số lần đổi");
            return;
        }
        swap();
        $('.row').remove();
        show();
        let width = document.getElementById("time").style.width;
        console.log(width)
        width -= 50;
        document.getElementById("time").style.width = width + 'px';
    })
    // làm mới game
    $('#new-game').click(function () {
        window.location.reload()
    })
    let id;
    // Đếm ngược thời gian

        const element = document.getElementById("time");
        let width = 300;
         id = setInterval(frame, 2000);

        function frame() {
            if (width === 0) {
                clearInterval(id);
                alert("Time out");
                window.location.reload();
            } else {
                width--;
                element.style.width = width + 'px';
            }
        }

    function boardAllLeft(x1, y1, x2, y2) { // Level 2 tất cả các hình đổ dồn về bên trái
        x1 = parseInt(x1);
        x2 = parseInt(x2);
        y1 = parseInt(y1);
        y2 = parseInt(y2)
        let minY = y1;
        let minX = x1;
        let maxY = y2;
        let maxX = x2;
        if (y1 > y2) {
            minY = y2;
            minX = x2;
            maxY = y1;
            maxX = x1;
        }
        let temp;

        for (let i = maxY + 1; i < board[maxX].length; i++) {
            temp = board[maxX][i];
            board[maxX][i] = board[maxX][i - 1];
            board[maxX][i - 1] = temp;
        }
        for (let i = minY + 1; i < board[minX].length; i++) {
            temp = board[minX][i];
            board[minX][i] = board[minX][i - 1];
            board[minX][i - 1] = temp;
        }
    }

    function boardRote() { // Level 4 sau khi các cặp hình được ăn thì các hình ở phía ngoài cùng sẽ đổi vị cho nhau
        console.log("boardRote")
        let temp;
        for (let i = 1; i < row - 1; i++) {
            for (let j = 1; j < col - 1; j++) {
                if ((i === 2 || i === row - 1) && j === 1) {
                    temp = board[i][j];
                    board[i][j] = board[i - 1][j];
                    board[i - 1][j] = temp;
                }

                if ((i === 1 || i === row - 3) && j === col - 2) {
                    temp = board[i][j];
                    board[i][j] = board[i + 1][j];
                    board[i + 1][j] = temp;
                }
                if (i === 1 && j < col - 3 && j > 1) {
                    temp = board[i][j];
                    board[i][j] = board[i][j + 1];
                    board[i][j + 1] = temp;
                }
                if (i === row - 2 && j > 2 && j < row - 2) {
                    temp = board[i][j];
                    board[i][j] = board[i][j - 1];
                    board[i][j - 1] = temp;
                }
                if (j === 1 && i > 2) {
                    temp = board[i][j];
                    board[i][j] = board[i - 1][j];
                    board[i - 1][j] = temp;
                }
                if (j === col - 2 && i < row - 3) {
                    temp = board[i][j];
                    board[i][j] = board[i + 1][j];
                    board[i + 1][j] = temp;
                }
            }
        }
    }

    function boardAllMid(x1, y1, x2, y2) { // Level 3 tất cả các hình đổ dồn về chính giữa
        x1 = parseInt(x1);
        x2 = parseInt(x2);
        y1 = parseInt(y1);
        y2 = parseInt(y2);
        let mid = (row - 2) / 2;
        let minY = y1;
        let minX = x1;
        let maxY = y2;
        let maxX = x2;
        if (y1 > mid && y2 > mid && y1 > y2) {
            minY = y2;
            minX = x2;
            maxY = y1;
            maxX = x1;
        }
        if (y1 < mid && y2 < mid && y1 > y2) {
            maxY = y2;
            maxX = x2;
            minY = y1
            minX = x1;
        }
        let temp;
        if (maxY > mid) {

            for (let i = maxY + 1; i < board[maxX].length; i++) {
                temp = board[maxX][i];
                board[maxX][i] = board[maxX][i - 1];
                board[maxX][i - 1] = temp;
                console.log("left: " + board[maxX][y1])
            }
        }
        if (minY > mid) {
            for (let i = minY + 1; i < board[minX].length; i++) {
                temp = board[minX][i];
                board[minX][i] = board[minX][i - 1];
                board[minX][i - 1] = temp;
            }
        }

        if (maxY <= mid) {
            for (let i = maxY - 1; i > 0; i--) {
                temp = board[maxX][i];
                board[maxX][i] = board[maxX][i + 1];
                board[maxX][i + 1] = temp;
            }
        }
        if (minY <= mid) {
            console.log("rightMax: " + board[maxX][y1])
            for (let i = minY - 1; i > 0; i--) {
                temp = board[minX][i];
                board[minX][i] = board[minX][i + 1];
                board[minX][i + 1] = temp;
            }
            console.log("rightMin: " + board[maxX][y1])
        }


    }

    function wallInBoard() { //level 5 trò chơi xuất hiện vật cản như tường
        // Tạo 1 mảng 0
        for (let i = 0; i < row; i++) {
            board[i] = [];
            for (let j = 0; j < col; j++) {
                board[i][j] = 0;
            }
        }
        let wallCount = 0;
        while (wallCount < 10) {
            let p1 = randomXY();
            if (!isBorder(p1) && board[p1[0]][p1[1]] !== -1) {
                board[p1[0]][p1[1]] = -1;
                wallCount+=1;
            }


        }
        // Bỏ các số ngẩu nhiên vào mảng
        while (!isFull()) {
            let rd = parseInt(Math.random() * 37 + 1);
            let p1 = randomXY();
            let p2 = randomXY();
            if (!isBorder(p1) && !isBorder(p2)
                && board[p1[0]][p1[1]] === 0 && board[p2[0]][p2[1]] === 0
                && !(p1[0] === p2[0] && p1[1] === p2[1])) {
                board[p1[0]][p1[1]] = rd;
                board[p2[0]][p2[1]] = rd;
                console.log(" " + p1 + p2);
            }
            console.log(wallCount)
        }
    }



    function reload() {
        $('.row').remove();
        createBoard();
        show();
        clearInterval(id);
        id = setInterval(frame,2000);
        score = 0;
        document.getElementById('score').innerText = score;
    }

    $('.lv1').click(function () {
        lv = 1;
        reload();
    })
    $('.lv2').click(function () {
        lv = 2;
        reload();
    })
    $('.lv3').click(function () {
        lv = 3;
        reload();
    })
    $('.lv4').click(function () {
        lv = 4;
        reload();
    })
    $('.lv5').click(function () {
        lv = 1;
        // reload();
        wallInBoard();
        $('.row').remove();
        show();
    })
    $('lv6').click(function () {
        lv = 6;
        reload();
    })

})
