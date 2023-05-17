var addItem = function(text) {
  var list = document.getElementById("thelist");
  var newitem = document.createElement("li"); // creates an element with the property li, so it continues numbering the list
  newitem.innerHTML = text; 
  list.appendChild(newitem); 
};

// Adding Text
var addText = function(id, text) {
  var list = document.getElementById(id);
  var newitem = document.createElement("text");
  newitem.innerHTML = text; 
  list.appendChild(newitem); 
};

var removeItem = function(n) { // standard index convention starting at 0
  var listitems = document.getElementsByTagName('li');
  listitems[n].remove();
};

