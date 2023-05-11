const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [-74.0060, 40.7128],
  zoom: 10,
  accessToken: "pk.eyJ1IjoicnlhbmxhdSIsImEiOiJjbGNkaTl6MjAxN2VxM3BwNHpseXYxN3BtIn0.NSi2H99_zl3PfrdhjGp6AA"
});


map.on('load', () => {
  map.addLayer({
    id: 'trips',
    type: 'circle',
    source: {
      type: 'geojson',
      data: '/static/data/trips.geojson'
    },
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
        "#00ff00",
        "pickup",
        "#ff0000",
        '#ccc'
      ]
    }
  });
});

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
    `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
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