const toggle = document.querySelector(".switch");
const directions = document.querySelectorAll(".directions");
const distanceHtml = document.querySelector(".distance");
const body = document.querySelector("body");
const randint = (max) => Math.trunc(Math.random() * max);
const currentLocation = { lat: undefined, lng: undefined };
const destinaton = { lat: undefined, lng: undefined };
const themeState = { value: false };
const openNow = { value: undefined, location: undefined };
toggle.addEventListener("click", (event) => {
  const distanceAway = document.querySelector(".distance-away");
  themeState.value = !themeState.value;
  if (!themeState.value) {
    toggle.style.backgroundColor = "#F1F1F1";
    body.style.backgroundColor = "#000000";
    distanceAway.style.color = "#F1F1F1";
    directions.forEach((item) => {
      !item.classList.contains("current")
        ? (item.style.backgroundColor = "rgba(255,255,255, 0.2)")
        : (item.style.backgroundColor = "#fba1a1");
    });
  } else {
    toggle.style.backgroundColor = "#000000";
    body.style.background = "#F9F5EB";
    distanceAway.style.color = "#000000";
    directions.forEach((item) => {
      !item.classList.contains("current")
        ? (item.style.backgroundColor = "#000000")
        : (item.style.backgroundColor = "#fba1a1");
    });
  }
});
getLocation();
setInterval(() => {
  if (
    currentLocation.lat &&
    currentLocation.lng &&
    destinaton.lat &&
    destinaton.lng
  ) {
    const distance = distanceFromCoordinates(
      currentLocation.lat,
      currentLocation.lng,
      destinaton.lat,
      destinaton.lng
    );
    const color = themeState.value ? "#000000" : "#F1F1F1";
    distanceHtml.innerHTML = `<h4 style='color:#FBA1A1'>${openNow.location}</h4>
                    <h4 style='color:${color}'class='distance-away'>${distance}km away</h4>
                            <h4 style='color:#FBA1A1'>${openNow.value}</h4>`;
    const angle = angleFromCoordinates(
      currentLocation.lat,
      currentLocation.lng,
      destinaton.lat,
      destinaton.lng
    );
    const index = getAngleIndex(angle);
    for (const [i, item] of directions.entries()) {
      if (index === i) {
        if (!item.classList.contains("current")) item.classList.add("current");
      } else {
        if (item.classList.contains("current"))
          item.classList.remove("current");
      }
    }
  }
}, 100);

function getLocation() {
  if (navigator.geolocation) {
    const firstTime = { value: false };
    navigator.geolocation.watchPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        currentLocation.lat = lat;
        currentLocation.lng = lng;
        if (!firstTime.value) {
          getApidata(lat, lng, firstTime);
        }
      },
      function (error) {
        console.log("Geolocation is not supported by this browser.");
        console.log(error);
      },
      { timeout: 100, enableHighAccuracy: true }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}
function getApidata(lat, lng, firstTime) {
  const apiKey = "AIzaSyBff72-8e65ZZzDkh51eSFHqsN79P_m098";
  const radius = 15000;
  const type = "restaurant";
  const keyword = "fast+food";
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lng}&radius=${radius}&type=${type}&keyword=${keyword}&key=${apiKey}`;
  const config = {
    method: "get",
    url: url,
    headers: {},
  };
  // api request for nearest location
  axios(config)
    .then((response) => response.data)
    .then((output) => {
      try {
        const data = output.results[randint(20)];
        const isOpen = data.opening_hours;
        const geometry = data.geometry;
        const lat = geometry.location.lat;
        const lng = geometry.location.lng;
        destinaton.lat = lat;
        destinaton.lng = lng;
        openNow.value = isOpen.open_now ? "Open Now" : "Not Open";
        openNow.location = data.name;
        firstTime.value = true;
      } catch (err) {
        console.log(err);
        firstTime.value = false;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function angleFromCoordinates(lat1, lon1, lat2, lon2) {
  var p1 = {
    x: lat1,
    y: lon1,
  };

  var p2 = {
    x: lat2,
    y: lon2,
  };
  // angle in degrees
  var angleDeg = Math.trunc(
    (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI
  );
  return angleDeg;
}
//  angleFromCoordinate(37.330604,-122.028947,37.3322109,-122.0329665);
function distanceFromCoordinates(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  return d.toFixed(2);
}
function getAngleIndex(angle) {
  let index;
  if (angle === 0 || angle === 360) {
    index = 3;
  } else if (angle === 90) {
    index = 0;
  } else if (angle === 180) {
    index = 9;
  } else if (angle === 270) {
    index = 6;
  } else if (angle > 0 && angle <= 45) {
    index = 2;
  } else if (angle > 45 && angle <= 90) {
    index = 1;
  } else if (angle > 90 && angle <= 145) {
    index = 11;
  } else if (angle > 145 && angle <= 180) {
    index = 10;
  } else if (angle > 180 && angle <= 225) {
    index = 8;
  } else if (angle > 225 && angle <= 270) {
    index = 7;
  } else if (angle > 270 && angle <= 315) {
    index = 5;
  } else {
    index = 4;
  }
  return index;
}
