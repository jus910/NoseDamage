const colors = ['#00ff00', '#ff0000'];

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [-74.0060, 40.7128],
  zoom: 10,
  accessToken: "pk.eyJ1IjoicnlhbmxhdSIsImEiOiJjbGNkaTl6MjAxN2VxM3BwNHpseXYxN3BtIn0.NSi2H99_zl3PfrdhjGp6AA"
});


map.on('load', () => {
  map.addSource('trip-data', {
    type: 'geojson',
    data: '/static/data/trips.geojson',
    cluster: true,
    // "distance" between clusters
    clusterRadius: 150,
    clusterProperties: {
      // count up the number of pickups and dropoffs in each cluster
      'pickup': ['+', ['case', ["==", "pickup", ['get', 'point_type']], 1, 0]],
      'dropoff': ['+', ['case', ["==", "dropoff", ['get', 'point_type']], 1, 0]],
    }
  })

  // only renders unclustered points due to filter
  map.addLayer({
    id: 'trips',
    type: 'circle',
    source: 'trip-data',
    filter: ['!=', 'cluster', true],
    paint: {
      // Make circles larger as the user zooms from z12 to z22.
      'circle-radius': {
        'base': 1.75,
        'stops': [
          [12, 2],
          [22, 180]
        ]
      },
      "circle-color": [
        "match",
        ["get", "point_type"],
        "dropoff",
        colors[0],
        "pickup",
        colors[1],
        '#ccc'
      ]
    }
  });

  // src: https://docs.mapbox.com/mapbox-gl-js/example/cluster-html/
  // objects for caching and keeping track of HTML marker objects (for performance)
  const markers = {};
  let markersOnScreen = {};

  function updateMarkers() {
    const newMarkers = {};
    const features = map.querySourceFeatures('trip-data');

    // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
    // and add it to the map if it's not there already
    for (const feature of features) {
      const coords = feature.geometry.coordinates;
      const props = feature.properties;
      if (!props.cluster) continue;
      const id = props.cluster_id;

      let marker = markers[id];
      if (!marker) {
        const el = createDonutChart(props);
        marker = markers[id] = new mapboxgl.Marker({
          element: el
        }).setLngLat(coords);
      }
      newMarkers[id] = marker;

      if (!markersOnScreen[id]) marker.addTo(map);
    }
    // for every marker we've added previously, remove those that are no longer visible
    for (const id in markersOnScreen) {
      if (!newMarkers[id]) markersOnScreen[id].remove();
    }
    markersOnScreen = newMarkers;
  }

  // after the GeoJSON data is loaded, update markers on the screen on every frame
  map.on('render', () => {
    if (!map.isSourceLoaded('trip-data')) return;
    updateMarkers();
  });
});

// code for creating an SVG donut chart from feature properties
function createDonutChart(props) {
  const offsets = [];
  const counts = [
    props.dropoff,
    props.pickup,
  ];
  let total = 0;
  for (const count of counts) {
    offsets.push(total);
    total += count;
  }
  const fontSize =
    total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
  const r =
    total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
  const r0 = Math.round(r * 0.6);
  const w = r * 2;

  let html = `<div>
    <svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" style="font: ${fontSize}px sans-serif; display: block">`;


  for (let i = 0; i < counts.length; i++) {
    html += donutSegment(
      offsets[i] / total,
      (offsets[i] + counts[i]) / total,
      r,
      r0,
      colors[i]
    );
  }
  html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white" />
    <text dominant-baseline="central" transform="translate(${r}, ${r})">
    ${total.toLocaleString()}
    </text>
    </svg>
    </div>`;

  const el = document.createElement('div');
  el.innerHTML = html;
  return el.firstChild;
}

function donutSegment(start, end, r, r0, color) {
  if (end - start === 1) end -= 0.00001;
  const a0 = 2 * Math.PI * (start - 0.25);
  const a1 = 2 * Math.PI * (end - 0.25);
  const x0 = Math.cos(a0),
    y0 = Math.sin(a0);
  const x1 = Math.cos(a1),
    y1 = Math.sin(a1);
  const largeArc = end - start > 0.5 ? 1 : 0;

  // draw an SVG path
  return `<path d="M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${r + r * y0
    } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${r + r0 * x1
    } ${r + r0 * y1} A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${r + r0 * y0
    }" fill="${color}" />`;
}



// Popups -- Will change to display route instead of popup box
map.on('click', (event) => {
  const features = map.queryRenderedFeatures(event.point, {
    layers: ['trips']
  });
  if (!features.length) {
    return;
  }
  const feature = features[0];

  const popup = new mapboxgl.Popup({ offset: [0, -15] })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(
      `<p>${JSON.stringify(feature.properties)}</p>`
    )
    .addTo(map);
});

offButton = document.getElementById("toggleOff");
offButton.addEventListener("click", () => {
    map.setLayoutProperty(
      'trips',
      'visibility', 
      'none'
    )
});
onButton = document.getElementById("toggleOn");
onButton.addEventListener("click", () => {
  map.setLayoutProperty(
    'trips',
    'visibility', 
    'visible'
  )
});