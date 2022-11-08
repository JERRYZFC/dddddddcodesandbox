import { interval, of, from, timer, merge, pipe, Observable } from "rxjs";

import {
  map,
  filter,
  take,
  concatMap,
  delay,
  exhaustMap,
  mergeMap,
  switchMap
} from "rxjs/operators";

import getGeoPosition from "./utils/get-geo-position";

of(["Hola", "Adois"]).subscribe(
  next => console.log(next, " ..."),
  error => console.log("error", error),
  () => console.log("complete")
);

const getCurrentPosition$ = Observable.create(observer => {
  window.navigator.geolocation.getCurrentPosition(position => {
    observer.next(position);
    observer.complete();
  }, observer.error.bind(observer));
});

const onResult = result => console.log("getCurrentPosition$ : ", result);
const onError = err => console.warn("getCurrentPositon$ error: ", err);

// from(getGeoPosition()).subscribe(onResult, onError);
// getCurrentPosition$.subscribe(onResult, onError);

const watchPosition$ = Observable.create(observer => {
  const watchId = window.navigator.geolocation.watchPosition(
    position => {
      observer.next(position);
    },
    error => {
      // sending error will terminate the stream
      observer.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000
    }
  );

  return () => {
    window.navigator.geolocation.clearWatch(watchId);
  };
});

// watchPosition$.subscribe(
//   result => console.log("watchPosition$ :", result),
//   err => console.warn("watchPosition$ ERROR: ", err)
// );

// const subscription = interval(1000)
//   .pipe(exhaustMap(a => of(a).pipe(delay(1000))))
//   .subscribe(console.log);

// window.addEventListener("unload", subscription.unsubscribe);
