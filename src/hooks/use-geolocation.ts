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

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          status: "resolved",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
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
  }, []);

  return state;
}
