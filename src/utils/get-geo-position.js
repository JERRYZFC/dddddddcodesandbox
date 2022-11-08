export default function getGeoPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("No GeoLocation available...");
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 5 * 1000,
      // maximumAge: 5 * 60 * 1000 // use cache
      maximumAge: 0 // always fresh
    };

    const geoSuccess = position => {
      const { coords } = position;

      console.log("[GEO] position : ", coords);
      resolve(position);
    };

    const geoError = error => {
      // error.code can be:
      //   0: unknown error
      //   1: permission denied
      //   2: position unavailable (error response from location provider)
      //   3: timed out
      console.log("[GEO] ERROR:", error.code);
      reject(error);
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  });
}
