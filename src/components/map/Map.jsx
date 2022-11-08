import React, {
  Component,
  useState,
  useEffect,
  useMemo,
  useCallback
} from "react";
import MapGL, {
  GeolocateControl,
  FlyToInterpolator,
  Marker
} from "react-map-gl";

// helpers
import getGeoPosition from "../../utils/get-geo-position";

// components
import Pin from "./Pin";

import Chance from "chance";
const chance = new Chance();

const TOKEN_MAPBOX =
  "pk.eyJ1IjoiYWx1a2FjaCIsImEiOiJ3US1JLXJnIn0.xrpBHCwvzsX76YlO-08kjg";

const geolocateStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  margin: 10
};

const MAP_TRANSITION_DURATION = 3000;
const MAP_INITIAL_STATE = {
  viewport: {
    width: "100%",
    height: "300px",
    // height: "100vh",
    latitude: 41.5868,
    longitude: -93.625,
    zoom: 11,
    bearing: 0,
    pitch: 0
  },

  location: {
    latitude: null,
    longitude: null
  }
};

// type MapState = typeof MAP_INITIAL_STATE;
// type MapViewport = typeof MAP_INITIAL_STATE.viewport;

const getCurrentLocation = () => {};
const getRandomLocation = () => {
  const [latitude, longitude] = chance.coordinates({ fixed: 6 }).split(", ");
  const coords = { latitude: Number(latitude), longitude: Number(longitude) };
  console.log("[MAP] RND location: ", coords);

  return { ...coords, zoom: 5 };
};

const MapV2 = () => {
  const [viewport, setViewport] = useState(MAP_INITIAL_STATE.viewport);
  const [location, setLocation] = useState(MAP_INITIAL_STATE.location);

  const goToPoint = useCallback(
    ({ latitude, longitude, zoom = 15 }) => {
      setViewport({
        longitude,
        latitude,
        zoom,
        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: MAP_TRANSITION_DURATION
      });
    },
    [setViewport]
  );

  const testRandom = useCallback(() => goToPoint(getRandomLocation()), [
    goToPoint
  ]);

  useEffect(() => {
    console.log("[map] init...");

    const onWindowResize = () =>
      setViewport(prevState => ({
        ...prevState,
        width: window.innerWidth
      }));

    window.addEventListener("resize", onWindowResize);
    return () => window.removeEventListener("resize", onWindowResize);
  }, []);

  const hasLocation = !!(location.latitude && location.longitude);

  return (
    <React.Fragment>
      <button onClick={getCurrentLocation}>Test location ?</button>
      <button onClick={testRandom}>RND location ?</button>

      <MapGL
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxApiAccessToken={TOKEN_MAPBOX}
        {...viewport}
        onViewportChange={viewport => setViewport(viewport)}
      >
        {hasLocation && (
          <Marker latitude={location.latitude} longitude={location.longitude}>
            <Pin size={20} />
          </Marker>
        )}
      </MapGL>
    </React.Fragment>
  );
};

class Map extends Component {
  state = MAP_INITIAL_STATE;

  componentDidMount() {
    window.addEventListener("resize", this._onWindowResize);
  }

  _onViewportChange = viewport => this.setState({ viewport });

  _onWindowResize = () => {
    console.log("[MAP] resize...");

    this.setState(prevState => {
      return {
        viewport: {
          ...prevState.viewport,
          width: window.innerWidth
          // height: window.innerHeight
        }
      };
    });
  };

  goToPoint = ({ latitude, longitude, zoom = 15 }) => {
    this._onViewportChange({
      longitude,
      latitude,
      zoom,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: MAP_TRANSITION_DURATION
    });
  };

  getCurrentLocation = async () => {
    console.log("[MAP] get current location...");

    try {
      const location = await getGeoPosition();

      console.log("got it ! ", location);
      const { coords } = location;
      const { latitude, longitude } = coords;

      // center map to point
      this.goToPoint({ latitude, longitude });

      setTimeout(() => {
        this.setState({ location: { latitude, longitude } });
      }, MAP_TRANSITION_DURATION);
    } catch (err) {
      console.error("[MAP] LOCATION ERR: ", err);
    }
  };

  getRandomLocation = async () => {
    const [latitude, longitude] = chance.coordinates({ fixed: 6 }).split(", ");
    const coords = { latitude: Number(latitude), longitude: Number(longitude) };
    console.log("[MAP] RND location: ", coords);

    this.goToPoint({ ...coords, zoom: 5 });
  };

  render() {
    const { getCurrentLocation, getRandomLocation, _onViewportChange } = this;
    const { location } = this.state;
    const hasLocation = !!(location.latitude && location.longitude);

    return (
      <React.Fragment>
        <button onClick={getCurrentLocation}>Test location ?</button>
        <button onClick={getRandomLocation}>RND location ?</button>

        <MapGL
          mapStyle="mapbox://styles/mapbox/light-v9"
          mapboxApiAccessToken={TOKEN_MAPBOX}
          {...this.state.viewport}
          onViewportChange={_onViewportChange}
        >
          {/* <GeolocateControl
            style={geolocateStyle}
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            onViewportChange={_onViewportChange}
          /> */}
          {hasLocation && (
            <Marker latitude={location.latitude} longitude={location.longitude}>
              <Pin size={20} />
            </Marker>
          )}
        </MapGL>
      </React.Fragment>
    );
  }
}

export default MapV2;
