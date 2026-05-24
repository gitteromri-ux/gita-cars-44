/* ============================================================
   MAP TRACKING — MapLibre live tracking
   Atlanta → Savannah → Atlantic → Med → Haifa → Lod
   ============================================================ */

window.MapTracking = (function() {

  // Route waypoints [lng, lat]
  const route = [
    { lng: -84.388, lat: 33.749, label: 'Atlanta, GA',   day: 0  },  // origin
    { lng: -81.099, lat: 32.083, label: 'Savannah Port', day: 3  },
    { lng: -65.0,   lat: 33.0,   label: 'Mid Atlantic',  day: 7  },
    { lng: -30.0,   lat: 34.5,   label: 'Mid Atlantic 2', day: 10 },
    { lng: -12.45,  lat: 35.18,  label: 'W of Lisbon',   day: 12 },  // current
    { lng:  -5.4,   lat: 36.0,   label: 'Gibraltar',     day: 14 },
    { lng:  10.0,   lat: 37.5,   label: 'Mediterranean', day: 18 },
    { lng:  25.0,   lat: 35.0,   label: 'East Med',      day: 22 },
    { lng:  34.99,  lat: 32.815, label: 'Haifa Port',    day: 24 },
    { lng:  34.89,  lat: 31.951, label: 'Lod',           day: 28 }
  ];

  let map, shipMarker, currentIdx = 4;

  function init() {
    if (typeof maplibregl === 'undefined') return;

    map = new maplibregl.Map({
      container: 'trackMap',
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap · © Carto'
          }
        },
        layers: [{
          id: 'simple-tiles',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: 18
        }]
      },
      center: [-20, 35],
      zoom: 2.4,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
    map.addControl(new maplibregl.AttributionControl({ compact: true }));

    map.on('load', onMapLoad);
  }

  function onMapLoad() {
    // Add route line — past (solid) + future (dashed)
    const pastCoords = route.slice(0, currentIdx + 1).map(p => [p.lng, p.lat]);
    const futureCoords = route.slice(currentIdx).map(p => [p.lng, p.lat]);

    map.addSource('past-route', {
      type: 'geojson',
      data: { type: 'Feature', geometry: { type: 'LineString', coordinates: pastCoords } }
    });
    map.addLayer({
      id: 'past-route',
      type: 'line',
      source: 'past-route',
      paint: {
        'line-color': '#4A8BFF',
        'line-width': 3,
        'line-opacity': 0.95
      }
    });

    map.addSource('future-route', {
      type: 'geojson',
      data: { type: 'Feature', geometry: { type: 'LineString', coordinates: futureCoords } }
    });
    map.addLayer({
      id: 'future-route',
      type: 'line',
      source: 'future-route',
      paint: {
        'line-color': '#4A8BFF',
        'line-width': 2,
        'line-opacity': 0.4,
        'line-dasharray': [2, 2]
      }
    });

    // Start marker — Atlanta (green)
    const startEl = document.createElement('div');
    startEl.className = 'start-marker';
    new maplibregl.Marker({ element: startEl })
      .setLngLat([route[0].lng, route[0].lat])
      .setPopup(new maplibregl.Popup({ offset: 14, closeButton: false }).setText('יציאה: Atlanta, GA · 25.09'))
      .addTo(map);

    // End marker — Lod (orange)
    const endEl = document.createElement('div');
    endEl.className = 'end-marker';
    new maplibregl.Marker({ element: endEl })
      .setLngLat([route[route.length - 1].lng, route[route.length - 1].lat])
      .setPopup(new maplibregl.Popup({ offset: 14, closeButton: false }).setText('יעד: לוד, ישראל · ETA 25.10'))
      .addTo(map);

    // Ship marker — current position (pulsing)
    const shipEl = document.createElement('div');
    shipEl.className = 'ship-marker';
    shipEl.innerHTML = '⛴';
    shipMarker = new maplibregl.Marker({ element: shipEl })
      .setLngLat([route[currentIdx].lng, route[currentIdx].lat])
      .setPopup(new maplibregl.Popup({ offset: 18, closeButton: false }).setHTML(
        '<div style="direction:rtl;font-family:Heebo,sans-serif;font-size:12px;color:#050B1A;font-weight:700">Atlantic Sky<br>יום 12 · 18 קשרים</div>'
      ))
      .addTo(map);

    // Draw daily progress bars
    renderDailyChart();

    // Start ship animation drift
    startDrift();
  }

  function renderDailyChart() {
    const chart = document.getElementById('dpChart');
    if (!chart) return;
    const today = 12;
    const total = 38;
    let html = '';
    for (let i = 1; i <= total; i++) {
      // Generate pseudo-random progress per day
      const h = i <= today ? 30 + Math.sin(i * 0.5) * 25 + 25 : 18;
      const cls = i < today ? '' : i === today ? 'is-today' : 'is-future';
      html += `<div class="dp-bar ${cls}" style="height:${h}%"></div>`;
    }
    chart.innerHTML = html;
  }

  // Smoothly drift the ship around current position as mock real-time updates
  let driftT = 0;
  function startDrift() {
    const baseLat = route[currentIdx].lat;
    const baseLng = route[currentIdx].lng;
    const coordRead = document.getElementById('coordRead');
    const speedRead = document.getElementById('speedRead');

    setInterval(() => {
      driftT += 0.04;
      const dLat = Math.sin(driftT) * 0.04;
      const dLng = Math.cos(driftT * 0.8) * 0.06;
      const newLat = baseLat + dLat;
      const newLng = baseLng + dLng;
      if (shipMarker) shipMarker.setLngLat([newLng, newLat]);
      if (coordRead) coordRead.textContent = `${newLat.toFixed(2)}°N · ${Math.abs(newLng).toFixed(2)}°W`;

      const speed = 17.5 + Math.sin(driftT * 0.3) * 1.2;
      if (speedRead) speedRead.textContent = `${speed.toFixed(1)} קשרים`;
    }, 3000);
  }

  return { init };
})();
