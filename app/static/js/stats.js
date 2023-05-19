///////////// HELPER FUNCTIONS /////////////

var removeHTML = function(id) { 
  var element = document.getElementById(id);
  element.innerHTML = "";
};

var convertData = function(e_id) { // From innerHTML to array
  var values = document.getElementById(e_id).innerHTML;
  values = values.replace(/'/g, '"');
  // console.log(values); 
  values = JSON.parse(values);
  // console.log(values);
  return values;
}

var formatColor = function(rgb_code) {
  solid = 'rgb(' + rgb_code + ')' ;
  sheer = 'rgb(' + rgb_code + ', 0.2)';
  return [solid, sheer];
}


///////////// GRAPH FUNCTIONS /////////////

// Bar Graph
var create_bar = function(canvas_id, x_id, y_id, x_label, y_label, a_label, rgb_code) {
  const ctx = document.getElementById(canvas_id);
  x_values = convertData(x_id);
  y_values = convertData(y_id);

  // Format color strings
  color_arr = formatColor(rgb_code);
  bg_color = color_arr[1];  
  bdr_color = color_arr[0];
  
  // Create Chart
  new Chart(ctx, {
    type: 'bar',
    data: {  
      labels: x_values,
      datasets: [{
        label: a_label,
        data: y_values,
        borderWidth: 1,
        backgroundColor: bg_color,
        borderColor: bdr_color
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: x_label
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: y_label
          }
        }
      }
    }
  });

  console.log("Bar Graph Created for " + canvas_id + ", deleting text...");
  removeHTML(x_id);
  removeHTML(y_id);
  console.log("done.");

};

// Donut Graph
var create_donut = function(canvas_id, x_id, y_id, a_label, rgb_code) {
  const ctx = document.getElementById(canvas_id);
  x_values = convertData(x_id);
  y_values = convertData(y_id);

  // Format color strings
  color_arr = formatColor(rgb_code);
  bg_color = color_arr[1];  
  bdr_color = color_arr[0];
  
  // Create Chart
  new Chart(ctx, {
    type: 'doughnut',
    data: {  
      labels: x_values,
      datasets: [{
        label: a_label,
        data: y_values,
        // backgroundColor: bg_color,
        // borderColor: bdr_color
      }]
    },
    options: {
    }
  });

  console.log("Donut Chart Created for " + canvas_id + ", deleting text...");
  removeHTML(x_id);
  removeHTML(y_id);
  console.log("done.");

};


///////////// COMMANDS /////////////

create_bar("distance_chart_yr", 
  "distance_x1", "distance_y1", 
  "Year", "Distance (mi)", 
  "Average Trip Distance", 
  "54, 162, 235");
create_bar("distance_chart_m", 
  "distance_x2", "distance_y2", 
  "Month", "Distance (mi)", 
  "Average Trip Distance", 
  "153, 102, 255");