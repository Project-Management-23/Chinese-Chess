
var matrix = [];
var app = new Vue({
    el: '#app',
    data: {
        chessNode: [],
        top: 0,
        left: 0,
        nodeStartI: -1,
        nodeStartJ: -1,
        nodeEndI: -1,
        nodeEndJ: -1,

    },
    methods: {
        getChessNode() {
            axios({
                url: '/api/chess/loadChessBoard',
                method: 'GET',
                responseType: 'Json',

            }).then((response) => {
                this.chessNode = response.data.chessNode;
                matrix = response.data.maxtrix;

            });
        },
        dragStart(event) {
            this.top = event.clientY;
            this.left = event.clientX;
        },
        getIndexByTopLef(top, left, matrix) {
            var obj = {};
            for (var i = 0; i < matrix.length; i++) {
                for (var j = 0; j < matrix[i].length; j++) {
                    console.log(Math.abs(matrix[i][j].top - top));
                    console.log(Math.abs(matrix[i][j].left - left));
                    if (Math.abs(matrix[i][j].top - top) < 20 && Math.abs(matrix[i][j].left - left) < 20) {
                        obj.i = i;
                        obj.j = j;
                        obj.id = matrix[i][j].id;
                        return obj;
                    }
                }
            }
            return null;
        },
        chongTuong(stopJ, id) {
            var check = 0;
            var flag = false;
            for (let i = 0; i <= 9; i++) {
                if (matrix[i][stopJ].id && !(matrix[i][stopJ].id.indexOf("chutuong") >= 0)) {
                    check++;
                }
                if (matrix[i][stopJ].id.indexOf("chutuong") >= 0 && matrix[i][stopJ].id != id) {
                    flag = true;
                }
            }
            if (flag == true && check < 1) {
                return false;
            }
            return true;
        },
        getIndex(left, top, typeofMove) {
            if (typeofMove == "stop") {
                this.nodeEndI = -1;
                this.nodeEndJ = -1;
            }
            if (typeofMove == "start") {
                this.nodeStartI = -1;
                this.nodeStartJ = -1;
            }
            for (var i = 0; i <= 9; i++) {
                for (var j = 0; j <= 8; j++) {
                    if (Math.abs(matrix[i][j].top - top) < 20 && Math.abs(matrix[i][j].left - left) < 20) {
                        if (typeofMove == "stop") {
                            this.nodeEndI = i;
                            this.nodeEndJ = j;
                            return;
                        }
                        if (typeofMove == "start") {
                            this.nodeStartI = i;
                            this.nodeStartJ = j;
                            return;
                        }
                    }
                }
            }
        },
        hasChessNode(left, top, id) {
            this.nodeEndI = -1;
            this.nodeEndJ = -1;
            this.getIndex(left, top, "stop");
            var idPointStop = matrix[this.nodeEndI][this.nodeEndJ].id;

            if (idPointStop == "") {
                return 0; /// khong co quan co nao tai vi tri nay
            }
            if (id.indexOf("do") >= 0) {
                if (idPointStop.indexOf("do") >= 0) {
                    return 1; //quan cung loai do
                }
                else
                    return -1; //quan khac loai
            }
            if (id.indexOf("den") >= 0) {
                if (idPointStop.indexOf("den") >= 0) {
                    return 1; //quan cung loai den
                }
                else
                    return -1; //quan khac loai
            }

        },
        sendMoveList(movelist) {
            if (objRemove != null) {
                movelist.push(objRemove);
            }
            axios({
                url: '/api/chess/move-check-node',
                method: 'Post',
                responseType: 'Json',
                data: para
            }).then((response) => {
            });
        },
        anQuanCo(id) {
            if (id.indexOf("chutuongdo") >= 0) {
                alert("Đen thắng");
                isOver = true;
            }
            if (id.indexOf("chutuongden") >= 0) {
                alert("Đỏ thắng")
                isOver = true;
            }
            var movelist = [{ id: id, top: 999, left: 999, visible: false }];
            this.sendMoveList(movelist);
        },
        xuLyNuocDi(stopI, startI, stopJ, startJ, id) {
            if (this.hasChessNode(matrix[stopI][stopJ].left, matrix[stopI][stopJ].top, matrix[startI][startJ].id) == -1) {
                this.anQuanCo(matrix[stopI][stopJ].id);
            }
            var node = $("#" + id);
            node.css({ 'top': matrix[stopI][stopJ].top + 'px' });
            node.css({ 'left': matrix[stopI][stopJ].left + 'px' });
            this.$set(matrix[startI][startJ], "id", "");

            return true;
        },
        kiemTraDuongCheo(stopI, startI, stopJ, startJ) {
            if (stopI > startI && stopJ > startJ) {
                if (matrix[stopI - 1][stopJ - 1].id)
                    return 1;
            }
            if (stopI > startI && stopJ < startJ) {
                if (matrix[stopI - 1][stopJ + 1].id)
                    return 1;
            }
            if (stopI < startI && stopJ > startJ) {
                if (matrix[stopI + 1][stopJ - 1].id)
                    return 1;
            }
            if (stopI < startI && stopJ < startJ) {
                if (matrix[stopI + 1][stopJ + 1].id)
                    return 1;
            }
            return 0;
        },
        kiemTraDuongThang(stopI, startI, stopJ, startJ) {
            var check = 0;
            if (stopI > startI && stopJ == startJ) {
                for (let i = startI + 1; i < stopI; i++) {
                    if (matrix[i][stopJ].id)
                        check++;
                }
            }
            if (stopI == startI && stopJ < startJ) {
                for (let i = stopJ + 1; i < startJ; i++) {
                    if (matrix[stopI][i].id)
                        check++;
                }
            }
            if (stopI < startI && stopJ == startJ) {
                for (let i = startI + 1; i < startI; i++) {
                    if (matrix[i][stopJ].id)
                        check++;
                }
            }
            if (stopI == startI && stopJ < startJ) {
                for (let i = stopJ + 1; i < stopJ; i++) {
                    if (matrix[startI][i].id)
                        check++;
                }
            }
            return check;
        },
        kiemTraDuongDiQuanMa(stopI, startI, stopJ, startJ) {
            if ((stopI - startI) == 2) {
                if (matrix[startI + 1][startJ].id)
                    return 1;
            }
            if ((stopI - startI) == -2) {
                if (matrix[startI - 1][startJ].id)
                    return 1;
            }
            if ((stopJ - startJ) == 2) {
                if (matrix[startI][startJ + 1].id)
                    return 1;
            }
            if ((stopJ - startJ) == -2) {
                if (matrix[startI][startJ - 1].id)
                    return 1;
            }
            return 0;
        },
        
        dragEnd(event) {
            var id = event.currentTarget.id;
            var moveX = event.clientX - this.left;
            var moveY = event.clientY - this.top;
            moveX = moveX + event.currentTarget.offsetLeft;
            moveY = moveY + event.currentTarget.offsetTop;

            var nodeStart = this.getIndexByTopLef(event.currentTarget.offsetTop, event.currentTarget.offsetLeft, matrix);
            var nodeEnd = this.getIndexByTopLef(moveY, moveX, matrix);
            if (nodeEnd == null) {
                return;
            }
            var objRemove = null;
            
            //Tướng
            if (id.indexOf("chutuongdo") >= 0) {
                var gapI = Math.abs(nodeEnd.i - nodeStart.i);
                var gapJ = Math.abs(nodeEnd.j - nodeStart.j);
                if (((gapI == 0 && gapJ == 1) ||
                        (gapI == 1 && gapJ == 0)) &&
                    (nodeEnd.j >= 3 && nodeEnd.j <= 5 && nodeEnd.i >= 0 && nodeEnd.i <= 2) &&
                    this.chongTuong(nodeEnd.j, id) &&
                    this.hasChessNode(matrix[nodeEnd.i][nodeEnd.j].left, matrix[nodeEnd.i][nodeEnd.j].top,
                        matrix[nodeStart.i][nodeStart.j].id) != 1) {
                    flag = this.xuLyNuocDi(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j, id);
                }
            }
            if (id.indexOf("chutuongden") >= 0) {
                var gapI = Math.abs(nodeEnd.i - nodeStart.i);
                var gapJ = Math.abs(nodeEnd.j - nodeStart.j);
                if (((gapI == 0 && gapJ == 1) ||
                        (gapI == 1 && gapJ == 0)) &&
                    (nodeEnd.j >= 3 && nodeEnd.j <= 5 && nodeEnd.i >= 7 && nodeEnd.i <= 9) &&
                    this.chongTuong(nodeEnd.j, id) &&
                    this.hasChessNode(matrix[nodeEnd.i][nodeEnd.j].left, matrix[nodeEnd.i][nodeEnd.j].top,
                        matrix[nodeStart.i][nodeStart.j].id) != 1) {
                    flag = this.xuLyNuocDi(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j, id);
                }
            }

            //Sĩ
            if ((id.indexOf("sido1") >= 0 || id.indexOf("sido2") >= 0) ) {
                var gapI = Math.abs(nodeStart.i - nodeEnd.i);
                var gapJ = Math.abs(nodeStart.j - nodeEnd.j);
                if ((gapI == 1 && gapJ == 1)
                    && (nodeEnd.j >= 3 && nodeEnd.j <= 5 &&
                        nodeEnd.i >= 0 && nodeEnd.i <= 2) &&
                    this.hasChessNode(matrix[nodeEnd.i][nodeEnd.j].left, matrix[nodeEnd.i][nodeEnd.j].top,
                        matrix[nodeStart.i][nodeStart.j].id) != 1) {

                    flag = this.xuLyNuocDi(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j, id);
                }
            }
            if ((id.indexOf("siden1") >= 0 || id.indexOf("siden2") >= 0) ) {
                var gapI = Math.abs(nodeStart.i - nodeEnd.i);
                var gapJ = Math.abs(nodeStart.j - nodeEnd.j);
                if ((gapI == 1 && gapJ == 1)
                    && (nodeEnd.j >= 3 && nodeEnd.j <= 5 &&
                        nodeEnd.i >= 7 && nodeEnd.i <= 9) &&
                    this.hasChessNode(matrix[nodeEnd.i][nodeEnd.j].left, 
                        matrix[nodeEnd.i][nodeEnd.j].top,
                        matrix[nodeStart.i][nodeStart.j].id) != 1) {

                    flag = this.xuLyNuocDi(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j,id);
                }
            }

            //tượng
            if ((id.indexOf("tuongdo1") >= 0 || id.indexOf("tuongdo2") >= 0)) {
                var gapI = Math.abs(nodeStart.i - nodeEnd.i);
                var gapJ = Math.abs(nodeStart.j - nodeEnd.j);
                if ((gapI == 2 && gapJ == 2) &&
                    this.kiemTraDuongCheo(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j) == 0 &&
                    (nodeEnd.j >= 0 && nodeEnd.j <= 8 && nodeEnd.i >= 0 && nodeEnd.i <= 4) &&
                    this.hasChessNode(matrix[nodeEnd.i][nodeEnd.j].left, 
                        matrix[nodeEnd.i][nodeEnd.j].top, 
                        matrix[nodeStart.i][nodeStart.j].id) != 1) {

                    flag = this.xuLyNuocDi(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j, id);
                }
            }
            if ((id.indexOf("tuongden1") >= 0 || id.indexOf("tuongden2") >= 0)) {
                var gapI = Math.abs(nodeStart.i - nodeEnd.i);
                var gapJ = Math.abs(nodeStart.j - nodeEnd.j);
                if ((gapI == 2 && gapJ == 2) &&
                    this.kiemTraDuongCheo(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j) == 0 &&
                    (nodeEnd.j >= 0 && nodeEnd.j <= 8 && nodeEnd.i >= 5 && nodeEnd.i <= 9) &&
                    this.hasChessNode(matrix[nodeEnd.i][nodeEnd.j].left,
                        matrix[nodeEnd.i][nodeEnd.j].top,
                        matrix[nodeStart.i][nodeStart.j].id) != 1) {

                    flag = this.xuLyNuocDi(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j, id);
                }
            }

            //Xe
            if ((id.indexOf("xedo1") >= 0 || id.indexOf("xedo2") >= 0) ) {
                if ((nodeStart.i == nodeEnd.i || nodeStart.j == nodeEnd.j) &&
                    this.kiemTraDuongThang(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j) == 0 &&
                    (nodeEnd.j >= 0 && nodeEnd.j <= 8 && nodeEnd.i >= 0 && nodeEnd.i <= 9) &&
                    this.hasChessNode(matrix[nodeEnd.i][nodeEnd.j].left, 
                        matrix[nodeEnd.i][nodeEnd.j].top, 
                        matrix[nodeStart.i][nodeStart.j].id) != 1) {

                    flag = this.xuLyNuocDi(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j, id);
                }
            }
            if ((id.indexOf("xeden1") >= 0 || id.indexOf("xeden2") >= 0) ) {
                if ((nodeStart.i == nodeEnd.i || nodeStart.j == nodeEnd.j) &&
                    this.kiemTraDuongThang(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j) == 0 &&
                    (nodeEnd.j >= 0 && nodeEnd.j <= 8 && nodeEnd.i >= 0 && nodeEnd.i <= 9) &&
                    this.hasChessNode(matrix[nodeEnd.i][nodeEnd.j].left,
                        matrix[nodeEnd.i][nodeEnd.j].top,
                        matrix[nodeStart.i][nodeStart.j].id) != 1) {

                    flag = this.xuLyNuocDi(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j, id);
                }
            }

            //Pháo
            if ((id.indexOf("phaodo1") >= 0 || id.indexOf("phaodo2") >= 0)) {
                if ((nodeStart.i == nodeEnd.i || nodeStart.j == nodeEnd.j) &&
                    (nodeEnd.j >= 0 && nodeEnd.j <= 8 && nodeEnd.i >= 0 && nodeEnd.i <= 9) &&
                    this.hasChessNode(matrix[nodeEnd.i][nodeEnd.j].left, 
                        matrix[nodeEnd.i][nodeEnd.j].top,
                        matrix[nodeStart.i][nodeStart.j].id) != 1) {

                    if (this.kiemTraDuongThang(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j) == 0 &&
                        this.hasChessNode(matrix[nodeEnd.i][nodeEnd.j].left,
                            matrix[nodeEnd.i][nodeEnd.j].top,
                            matrix[nodeStart.i][nodeStart.j].id) == 0) {
                        flag = this.xuLyNuocDi(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j, id);
                    }
                    if (this.kiemTraDuongThang(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j) == 1 &&
                        matrix[nodeEnd.i][nodeEnd.j].id) {
                        flag = this.xuLyNuocDi(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j, id);
                    }
                }
            }
            if ((id.indexOf("phaoden1") >= 0 || id.indexOf("phaoden2") >= 0)) {
                if ((nodeStart.i == nodeEnd.i || nodeStart.j == nodeEnd.j) &&
                    (nodeEnd.j >= 0 && nodeEnd.j <= 8 && nodeEnd.i >= 0 && nodeEnd.i <= 9) &&
                    this.hasChessNode(matrix[nodeEnd.i][nodeEnd.j].left,
                        matrix[nodeEnd.i][nodeEnd.j].top,
                        matrix[nodeStart.i][nodeStart.j].id) != 1) {

                    if (this.kiemTraDuongThang(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j) == 0 &&
                        this.hasChessNode(matrix[nodeEnd.i][nodeEnd.j].left,
                            matrix[nodeEnd.i][nodeEnd.j].top,
                            matrix[nodeStart.i][nodeStart.j].id) == 0) {
                        flag = this.xuLyNuocDi(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j, id);
                    }
                    if (this.kiemTraDuongThang(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j) == 1 &&
                        matrix[nodeEnd.i][nodeEnd.j].id) {
                        flag = this.xuLyNuocDi(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j, id);
                    }
                }
            }
            
            //Mã
            if ((id.indexOf("maden1") >= 0 || id.indexOf("maden2") >= 0)) {
                if (((Math.abs(nodeEnd.i - nodeStart.i) == 1 &&
                            Math.abs(nodeEnd.j - nodeStart.j) == 2) ||
                        (Math.abs(nodeEnd.i - nodeStart.i) == 2 &&
                            Math.abs(nodeEnd.j - nodeStart.j) == 1)) &&
                    this.kiemTraDuongDiQuanMa(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j) == 0 &&
                    (nodeEnd.j >= 0 && nodeEnd.j <= 8 && nodeEnd.i >= 0 && nodeEnd.i <= 9) &&
                    this.hasChessNode(matrix[nodeEnd.i][nodeEnd.j].left,
                        matrix[nodeEnd.i][nodeEnd.j].top,
                        matrix[nodeStart.i][nodeStart.j].id) != 1) {

                    flag = this.xuLyNuocDi(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j,id);
                }
            }
            if ((id.indexOf("mado1") >= 0 || id.indexOf("mado2") >= 0)) {
                if (((Math.abs(nodeEnd.i - nodeStart.i) == 1 &&
                            Math.abs(nodeEnd.j - nodeStart.j) == 2) ||
                        (Math.abs(nodeEnd.i - nodeStart.i) == 2 &&
                            Math.abs(nodeEnd.j - nodeStart.j) == 1)) &&
                    this.kiemTraDuongDiQuanMa(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j) == 0 &&
                    (nodeEnd.j >= 0 && nodeEnd.j <= 8 && nodeEnd.i >= 0 && nodeEnd.i <= 9) &&
                    this.hasChessNode(matrix[nodeEnd.i][nodeEnd.j].left,
                        matrix[nodeEnd.i][nodeEnd.j].top,
                        matrix[nodeStart.i][nodeStart.j].id) != 1) {

                    flag = this.xuLyNuocDi(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j,id);
                }
            }

            //Tốt
            if ((id.indexOf("totdo1") >= 0 || id.indexOf("totdo2") >= 0 ||
                id.indexOf("totdo3") >= 0 || id.indexOf("totdo4") >= 0 ||
                id.indexOf("totdo5") >= 0)) {
                if ((nodeStart.i == nodeEnd.i || nodeStart.j == nodeEnd.j) &&
                    ((nodeStart.j == nodeEnd.j && nodeEnd.i - nodeStart.i == 1 &&
                            nodeEnd.i >= 3 && nodeEnd.i <= 4) ||
                        ((nodeEnd.i - nodeStart.i == 1 ||
                            Math.abs(nodeEnd.j - nodeStart.j) == 1) && 
                            nodeEnd.i >= 5 && nodeEnd.i <= 9)) &&
                    this.hasChessNode(matrix[nodeEnd.i][nodeEnd.j].left,
                        matrix[nodeEnd.i][nodeEnd.j].top,
                        matrix[nodeStart.i][nodeStart.j].id) != 1) {

                    flag = this.xuLyNuocDi(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j, id);
                }
            }
            if ((id.indexOf("totden1") >= 0 || id.indexOf("totden2") >= 0 ||
                id.indexOf("totden3") >= 0 || id.indexOf("totden4") >= 0 ||
                id.indexOf("totden5") >= 0)) {
                if ((nodeStart.i == nodeEnd.i || nodeStart.j == nodeEnd.j) &&
                    ((nodeStart.j == nodeEnd.j && nodeEnd.i - nodeStart.i == -1
                            && nodeEnd.i >= 5 && nodeEnd.i <= 6) ||
                        ((nodeEnd.i - nodeStart.i == -1 ||
                                Math.abs(nodeEnd.j - nodeStart.j) == 1) &&
                            nodeEnd.i >= 0 && nodeEnd.i <= 4)) &&
                    app.hasChessNode(matrix[nodeEnd.i][nodeEnd.j].left,
                        matrix[nodeEnd.i][nodeEnd.j].top,
                        matrix[nodeStart.i][nodeStart.j].id) != 1) {

                    flag = app.xuLyNuocDi(nodeEnd.i, nodeStart.i, nodeEnd.j, nodeStart.j, id);
                }
            }
            
        }
    },
    mounted: function () {
        this.getChessNode();

        //ReceiveChessMove
        var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
        connection.on("ReceiveChessMove", function (message) {
            console.log(message);
            var response = JSON.parse(message);
            matrix[response[0].fromi][response[0].fromj].id = "";
            var nodeEnd = matrix[response[0].toi][response[0].toj];
            nodeEnd.id = response[0].id;


            var obj = document.getElementById(response[0].id);
            obj.style.top = nodeEnd.top + 'px';
            obj.style.left = nodeEnd.left + 'px';

            if (response.length > 1) {
                var temp = document.getElementById(response[1].id);
                temp.style.display = "none";
            }
        });
        connection.start().then(function () {

        }).catch(function (err) {
            return console.error(err.toString());
        });
    }
});