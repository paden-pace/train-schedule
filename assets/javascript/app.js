
$(document).ready(function(){

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyC-yc_z3Rq2DlxixCpSlaeTj3bxnGrAerQ",
		authDomain: "train-time-pjp.firebaseapp.com",
		databaseURL: "https://train-time-pjp.firebaseio.com",
		storageBucket: "train-time-pjp.appspot.com",
		messagingSenderId: "1030367313016"
	};
	firebase.initializeApp(config);

	// Create a variable to reference the database.
	var database = firebase.database();

	// Initial Variables
	var name = "";
	var dest = "";
	var first = 0;
	var freq = 0;
	

	// Submit Button Click
	$("#submit-button").on("click", function(event) {
		event.preventDefault();


		// Grab values from text boxes
		name = $("#nameInput").val().trim();
		dest = $("#destInput").val().trim();
		first = $("#firstInput").val().trim();
		freq = $("#freqInput").val().trim();


		// First Time (pushed back 1 year to make sure it comes before current time)
		var firstTime = moment(first, "hh:mm").subtract(1, "years");

		// Current Time
		var currentTime = moment();

	   // Difference between the times
		var diffTime = moment().diff(moment(firstTime), "minutes");

	    // Time apart (remainder)
		var remainTime = diffTime % freq;

	   // Minute Until Train
		var minAway = freq - remainTime;

	   // Next Train
		var nextTrain = moment().add(minAway, "minutes");
		var next = (moment(nextTrain).format("hh:mm"));


		// Code for handling the push
		database.ref().push({
			name: name,
			dest: dest,
			freq: freq,
			next: next,
			minAway: minAway,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});
	});

	// Firebase watcher + initial loader HINT: .on("value")
	database.ref().on("child_added", function(snapshot) {

		// storing the snapshot.val() in a variable for convenience
		var snapValue = snapshot.val();
		
		// Getting an array of each key In the snapshot object
		var snapValueArr = Object.keys(snapValue);

		// Finding the last user's key
		var lastIndex = snapValueArr.length - 1;

		var lastKey = snapValueArr[lastIndex];

		// Using the last user's key to access the last added user object
		var lastObj = snapValue[lastKey]	

	// 	// Handle the errors
	}, function(errorObject) {
		console.log("Errors handled: " + errorObject.code);
	});

    database.ref().orderByChild("dateAdded").limitToLast(10).on("child_added", function(snapshot) {

    var markup = "<tr><td>" + snapshot.val().name + "</td><td>" + snapshot.val().dest + "</td><td>" + snapshot.val().freq + "</td><td>" + snapshot.val().next + "</td><td>" + snapshot.val().minAway + "</td></tr>";
		$("#curTrainTable").append(markup);
    });

});