"use client";

import { useEffect, useState } from "react";

type GeoState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "resolved"; lat: number; lng: number }
  | { status: "denied" }
  | { status: "unavailable" };

export function useGeolocation(): GeoState {
  const [state, setState] = useState<GeoState>({ status: "idle" });

  useEffect(() => {
    if (!navigator?.geolocation) {
      setState({ status: "unavailable" });
      return;
    }

    setState({ status: "pending" });

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const newLat = pos.coords.latitude;
        const newLng = pos.coords.longitude;

        setState((prev) => {
          if (
            prev.status === "resolved" &&
            Math.abs(prev.lat - newLat) < 0.0001 &&
            Math.abs(prev.lng - newLng) < 0.0001
          ) {
            return prev;
          }
          return {
            status: "resolved",
            lat: newLat,
            lng: newLng,
          };
        });
      },
      (err) => {
        setState(
          err.code === GeolocationPositionError.PERMISSION_DENIED
            ? { status: "denied" }
            : { status: "unavailable" }
        );
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  return state;
}
