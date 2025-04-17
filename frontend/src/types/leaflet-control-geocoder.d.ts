// src/types/leaflet-control-geocoder.d.ts

declare module "leaflet-control-geocoder" {
  import * as L from "leaflet";

  interface GeocoderOptions {
    collapsed?: boolean;
    position?: "topleft" | "topright" | "bottomleft" | "bottomright";
    geocoder?: any; // You can type this if you need
    defaultMarkGeocode?: boolean;
  }

  export function geocoder(options?: GeocoderOptions): L.Control;
}
