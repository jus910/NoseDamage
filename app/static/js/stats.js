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

const rainbow = [
  "255, 100, 140", 
  "255, 159, 64", 
  "255, 210, 70", 
  "230, 230, 100",
  "200, 255, 131",
  "150, 240, 150",
  "75, 192, 192",
  "54, 162, 235",
  "120, 130, 255",
  "140, 102, 255",
  "185, 140, 225",
  "248, 150, 220",
]


///////////// GRAPH FUNCTIONS /////////////

// Bar Graph
var create_bar = function(canvas_id, x_id, y_id, x_label, y_label, a_label, rgb_code="54, 162, 235") {
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

// Stacked Bar Graph
var create_stacked = function(canvas_id, x_id, stack_id, y_id, x_label, y_label, rgb_codes=rainbow) {
  const ctx = document.getElementById(canvas_id);
  x_values = convertData(x_id);
  stacks = convertData(stack_id)
  y_values = convertData(y_id);

  // Datasets -- Careful with input data (very specific structure)
  data_arr = [];
  const datadict = function(label, data, color = "") {
    return {"label": label, "data": data, "backgroundColor": color}
  };
  for (let m = 0; m < 12; m++) {
    color_arr = formatColor(rgb_codes[m]);
    bg_color = color_arr[0];
    data_arr.push(datadict(stacks[m], y_values.slice(5*m, 5*(m+1)), bg_color))
  };
  // console.log(data_arr);
  
  // Create Chart
  new Chart(ctx, {
    type: 'bar',
    data: {  
      labels: x_values,
      datasets: data_arr
    },
    options: {
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: x_label
          }
        },
        y: {
          stacked: true,
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
  removeHTML(stack_id);
  removeHTML(y_id);
  console.log("done.");

};


// // Donut Chart
// var create_donut = function(canvas_id, x_id, y_id, a_label, rgb_code="54, 162, 235") {
//   const ctx = document.getElementById(canvas_id);
//   x_values = convertData(x_id);
//   y_values = convertData(y_id);

//   // Format color strings
//   color_arr = formatColor(rgb_code);
//   bg_color = color_arr[1];  
//   bdr_color = color_arr[0];
  
//   // Create Chart
//   new Chart(ctx, {
//     type: 'doughnut',
//     data: {  
//       labels: x_values,
//       datasets: [{
//         label: a_label,
//         data: y_values,
//         // backgroundColor: bg_color,
//         // borderColor: bdr_color
//       }]
//     },
//     options: {
//     }
//   });

//   console.log("Donut Chart Created for " + canvas_id + ", deleting text...");
//   removeHTML(x_id);
//   removeHTML(y_id);
//   console.log("done.");

// };


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
create_stacked("total_fare",
  "fare_x", "fare_stack", "fare_y",
  "Year", "Total Fare ($)");