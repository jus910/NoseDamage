///////////// CONSTANTS /////////////

const rainbow = [
  "#ff648c",
  "#ff9f40",
  "#ffd246",
  "#e6e664",
  "#c8ff83",
  "#96f096",
  "#4bc0c0",
  "#36a2eb",
  "#7882ff",
  "#8c66ff",
  "#b98ce1",
  "#f896dc"
]

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

var semi_sheer = function(hex_code) {
  return hex_code+"AA";
}
var sheer = function(hex_code) {
  return hex_code+"80";
}

///////////// GRAPH FUNCTIONS /////////////

// Bar Graph
var create_bar = function(canvas_id, x_id, y_id, x_label, y_label, a_label, hex_code="#36a2eb") {
  const ctx = document.getElementById(canvas_id);
  x_values = convertData(x_id);
  y_values = convertData(y_id);

  // Format color strings
  bg_color = sheer(hex_code);  
  bdr_color = hex_code;
  
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

  console.log("Bar Graph Created for " + canvas_id + ".");

};

// Stacked Bar Graph
var create_stacked = function(canvas_id, x_id, stack_id, y_id, x_label, y_label, hex_codes=rainbow) {
  const ctx = document.getElementById(canvas_id);
  x_values = convertData(x_id);
  stacks = convertData(stack_id)
  y_values = convertData(y_id);

  // Datasets -- Careful with input data (very specific structure)
  data_arr = [];
  const datadict = function(label, data, color = "", color2 = "#FFFFFF") {
    return {"label": label, "data": data, "backgroundColor": color, "borderWidth": 1, "borderColor": color2}
  };
  for (let m = 0; m < 12; m++) {
    bg_color = sheer(hex_codes[m]);
    borderColor = hex_codes[m];
    data_arr.push(datadict(stacks[m], y_values.slice(5*m, 5*(m+1)), bg_color, borderColor))
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

  console.log("Bar Graph Created for " + canvas_id + ",");
};


// // Donut Chart
// var create_donut = function(canvas_id, x_id, y_id, a_label, hex_code="#36a2eb") {
//   const ctx = document.getElementById(canvas_id);
//   x_values = convertData(x_id);
//   y_values = convertData(y_id);

//   // Format color strings
//   bg_color = sheer(hex_code);  
//   bdr_color = hex_code;
  
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

//   console.log("Donut Chart Created for " + canvas_id + ".");
// };


///////////// BUTTONS /////////////
var toggle_vis = function(on_id, off_id) {
  document.getElementById(on_id).style.display = "block";
  document.getElementById(off_id).style.display = "none";
};

const toggle_to_m = function() {
  toggle_vis('by_m', 'by_yr');
};
const toggle_to_yr = function() {
  toggle_vis('by_yr', 'by_m');
};

button_to_m = document.getElementById('distance_chart_to_m');
button_to_m.addEventListener('click', toggle_to_m);
button_to_yr = document.getElementById('distance_chart_to_yr');
button_to_yr.addEventListener('click', toggle_to_yr);


///////////// COMMANDS /////////////

create_bar("distance_chart_yr", 
  "distance_x1", "distance_y1", 
  "Year", "Distance (mi)", 
  "Average Trip Distance", 
  "#36a2eb");
create_bar("distance_chart_m", 
  "distance_x2", "distance_y2", 
  "Month", "Distance (mi)", 
  "Average Trip Distance", 
  "#9966ff");
create_stacked("total_fare",
  "fare_x", "fare_stack", "fare_y",
  "Year", "Total Fare ($)");
toggle_to_yr();   // default
