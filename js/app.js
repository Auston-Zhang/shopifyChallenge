var nominatedList = new Set();

const nominateLimit = 5;
var currNominatedNum = 0;



function checkSearchResultButton() {
  console.log("checkButton:" + nominatedList);

  $("#movieSearchResult").find("button").each(function () {

    if (!nominatedList.has((this).id)) {


      $(this).prop('disabled', false);
      console.log(this.id + " Not Disabled");

    }
    else if (nominatedList.has((this).id)) {

      console.log(this.id + " Disabled");
      $(this).prop('disabled', true);

    }
  });


}


$('#searchButton').on('submit', function (ev) {

  // clear the prevous search outcome
  $("#movieSearchResult").empty();
  /*  
 
   */
  // perform search and show the result
  ev.preventDefault();
  var value = $('input[name=movieSearchBar]').val();


  $.getJSON('https://www.omdbapi.com/?&apikey=2170dc30&type=movie&s=' + value, function (data) {
    var items = [];
    var count = 0;

    $.each(data.Search, function (entryIndex, entry) {

      var nominateImdbID = this.imdbID;

      if (!nominatedList.has(nominateImdbID)) {

        items.push('<li class="list-group-item d-flex justify-content-between align-items-center"><p>' + this.Title + " (" + this.Year + ")"
          + '</p><button type="button" class="btn btn-warning btn-sm" id="' + nominateImdbID + '">Nominate ' + count + '</button></li>');
        // check if the item is already in the nominated list

        count++;
      }
      else {
        items.push('<li class="list-group-item d-flex justify-content-between align-items-center"><p>' + this.Title + " (" + this.Year + ")"
          + '</p><button type="button" class="btn btn-warning btn-sm" id="' + nominateImdbID + '"disabled>Nominate ' + count + '</button></li>');
        // check if the item is already in the nominated list
        count++;

      }

    });

    $("<ul/>", {
      "class": "list-group",
      html: items.join("")
    }).appendTo("#movieSearchResult");
  });

  console.log(nominatedList);

});

// add click listener to the dynamically created buttons
// 1. pop up the alert 
// 2. disable the button
// 3. add the record to the nominated list
$('#movieSearchResult').on('click', 'button', function () {
  if (!nominatedList.has(this.id)) {
    alert("Not included");
  }


  //if the user has nominated less than 5 movies
  if (currNominatedNum < nominateLimit) {

    currNominatedNum++;
    nominatedList.add(this.id);
    console.log(this.id);

    alert("Nominated!");

    $(this).prop('disabled', true);

    var butt = $("<button></button>").text("Text.");

    $(this).parent("li").children("p").clone().appendTo("#nominatedMovies").append('   <button type="button" class="btn btn-warning btn-sm" id="' + this.id + '">Remove</button>');
    $(this).parent("li").children("p").clone().appendTo("#nominatedList");

    //$("#nominatedMovies").children("li").appendChild(butt);
  }
  //if the use has already nominated 5 movies, then the user cannot continue to nominate
  else {
    alert("Already nominated 5 movies! This will not be added to the list.");
  }

});


// when click remove button, the list item should be deleted
$('#nominatedMovies').on('click', 'button', function () {

  $(this).parent("p").remove();
  nominatedList.delete(this.id);
  currNominatedNum--;

  alert("Removed!");
  checkSearchResultButton();

});