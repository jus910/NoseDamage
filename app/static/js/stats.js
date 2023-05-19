var removeHTML = function(id) { 
  var element = document.getElementById(id);
  element.innerHTML = "";
};

// Chart

var create_bar = function(canvas_id, x_id, y_id) {
  const ctx = document.getElementById(canvas_id);
  var x_values = document.getElementById(x_id).innerHTML;
  var y_values = document.getElementById(y_id).innerHTML;

  x_values = JSON.parse(x_values)
  y_values = JSON.parse(y_values)
  // console.log(x_values)  
  // console.log(y_values)

  new Chart(ctx, {
    type: 'bar',
    data: {  
      labels: x_values,
      datasets: [{
        label: 'Average Trip Distance ',
        data: y_values,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Year"
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Distance (mi)"
          }
        }
      }
    }
  });

  console.log("Bar Graph Created, deleting text...");
  removeHTML(x_id);
  removeHTML(y_id);
  console.log("done.");

};


create_bar("distance_chart", "distance_x", "distance_y");

