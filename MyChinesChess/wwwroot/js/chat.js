"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (/*user,*/ message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you
    // should be aware of possible script injection concerns.
    li.setAttribute('class', 'messages_item');
    /*onselect = ""*/
    //${ user }
    li.innerHTML = `
     <div class="show_name"> 
        <p style="margin: 0;">${message}</p>
    </div>
    <img src="https://scontent.fsgn2-5.fna.fbcdn.net/v/t39.30808-6/386515303_308790938456710_4456065279213934154_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Eh8xgvRigGMAX-m1uuI&_nc_ht=scontent.fsgn2-5.fna&oh=00_AfBiPIBaESp8xl6PDh0qQke2aofYzsDbqjNxATb--pTO2w&oe=65389DBE" class="image_avata" width="25" height="25" />  <p style="margin: 0;">${message}</p>`;
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});



document.getElementById("messageInput")
    .addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("sendButton").click();
        }
    });


function buttonSend() {
    /* var user = document.getElementById("userInput").value;*/
    var message = document.getElementById("messageInput").value;
    if (message === "") {
        return;
    } else {
        document.getElementById("messageInput").value = "";
        connection.invoke("SendMessage", /*user,*/ message).catch(function (err) {
            return console.error(err.toString());
        });
        event.preventDefault();
    }  
};


//document.getElementById("sendButton").addEventListener("click", function (event) {
//    /* var user = document.getElementById("userInput").value;*/
//    var message = document.getElementById("messageInput").value;
//    if (message === "") {
//        return;
//    } else {
//        document.getElementById("messageInput").value = "";
//        connection.invoke("SendMessage", /*user,*/ message).catch(function (err) {
//            return console.error(err.toString());
//        });
//        event.preventDefault();
//    }

//});

