export interface UserLocation {
    lat: number | null;
    lng: number | null;
    country?: string | null;
    city?: string | null;
    district?: string | null;
    street?: string | null;
    postalCode?: string | null;
    formattedAddress?: string | null;
}
