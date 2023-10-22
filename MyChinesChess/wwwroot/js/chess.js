
var matrix = [];
var app = new Vue({
    el: '#app',
    data: {
        chessNode: [],
        top: 0,
        left: 0

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
            if (id.indexOf('ma') >= 0) {
                var gapI = Math.abs(nodeEnd.i - nodeStart.i);
                var gapJ = Math.abs(nodeEnd.j - nodeStart.j);
                if (!((gapI == 1 && gapJ == 2) || (gapJ == 1 && gapI == 2))) {
                    return;
                }
                if ((gapI == 1 && gapJ == 2) && (nodeEnd.j > nodeStart.j)) {
                    if (matrix[nodeStart.i][nodeStart.j + 1].id != "") {
                        return;
                    }
                }
                if ((gapI == 1 && gapJ == 2) && (nodeEnd.j < nodeStart.j)) {
                    if (matrix[nodeStart.i][nodeStart.j - 1].id != "") {
                        return;
                    }
                }

                if ((gapI == 2 && gapJ == 1) && (nodeEnd.i > nodeStart.i)) {
                    if (matrix[nodeStart.i + 1][nodeStart.j].id != "") {
                        return;
                    }
                }
                if ((gapI == 2 && gapJ == 1) && (nodeEnd.i < nodeStart.i)) {
                    if (matrix[nodeStart.i - 1][nodeStart.j].id != "") {
                        return;
                    }
                }
                if (nodeEnd.id != "" && nodeEnd.id.indexOf('do') > 0) {
                    return;
                }
                else {
                    if (nodeEnd.id != "")//quan den
                    {
                        objRemove = { id: nodeEnd.id };
                    }

                }
            }



            var para = [{ id: id, fromi: nodeStart.i, fromj: nodeStart.j, toi: nodeEnd.i, toj: nodeEnd.j }];
            if (objRemove != null) {
                para.push(objRemove);
            }
            axios({
                url: '/api/chess/move-check-node',
                method: 'Post',
                responseType: 'Json',
                data: para
            }).then((response) => {


            });


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