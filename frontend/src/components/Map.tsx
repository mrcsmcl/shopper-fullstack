import React, { useEffect, useState } from "react";
import { GoogleMap, Polyline, Marker } from "@react-google-maps/api";

type MapProps = {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  route: string;
};

const containerStyle = {
  width: "100%",
  height: "400px",
};

const Map: React.FC<MapProps> = ({ origin, destination, route }) => {
  const [path, setPath] = useState<google.maps.LatLngLiteral[]>([]);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);

  const isValidCoordinate = (coord: { lat: number; lng: number }) =>
    coord &&
    typeof coord.lat === "number" &&
    typeof coord.lng === "number" &&
    isFinite(coord.lat) &&
    isFinite(coord.lng);

  useEffect(() => {
    if (window.google && window.google.maps.geometry && route) {
      const decodedPath = window.google.maps.geometry.encoding.decodePath(route);
      const pathCoords = decodedPath.map((point) => ({
        lat: point.lat(),
        lng: point.lng(),
      }));
      setPath(pathCoords);

      const newBounds = new window.google.maps.LatLngBounds();
      pathCoords.forEach((point) => newBounds.extend(point));

      if (isValidCoordinate(origin)) newBounds.extend(origin);
      if (isValidCoordinate(destination)) newBounds.extend(destination);

      setBounds(newBounds);
    }
  }, [route, origin, destination]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={13}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
      }}
      onLoad={(map) => {
        if (bounds) {
          map.fitBounds(bounds);
        }
      }}
    >
      {isValidCoordinate(origin) && <Marker position={origin} label="A" />}
      {isValidCoordinate(destination) && <Marker position={destination} label="B" />}
      {path.length > 0 && <Polyline path={path} options={{ strokeColor: "#FF0000", strokeWeight: 4 }} />}
    </GoogleMap>
  );
};

export default Map;
