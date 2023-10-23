

var app = new Vue({
    el: '#app',
    data: {
        rooms: []
    },
    methods: {
        getListRoom() {
            axios.get('/api/room/getroom')
                .then(response => {
                    if (response.data.message == "success") {
                        this.rooms = response.data.data;
                    }
                }).catch(error => {
                    console.log(error);
                }).finally();
        },
        createRoom() {
            var name = document.getElementById("txtName").value;
            console.log(name);
            var payload = { RoomName: name };
            axios.post('/api/room/insertroom', {
                rmodel: payload
            }).then(response => {
                if (response.data.message == "success") {
                    this.getListRoom();
                }
            }).catch(error => {
                console.log(error);
            }).finally();
        }
    },
    mounted: function () {
        this.getListRoom();
    }
})