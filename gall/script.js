
// Send message
var messageInput = document.getElementById('messageInput');
var submitButton = document.getElementById('submitButton');

submitButton.addEventListener('click', function() {
    var user = firebase.auth().currentUser;
    writeUserMessage(user.uid, user.displayName, messageInput.value);
    messageInput.value = '';
});

// Write a message to the database
function writeUserMessage(uid, name, text) {
    firebase.database().ref('messages').push({
        uid: uid,
        name: name,
        text: text,
        timestamp: Date.now()
    });
}