export interface Author {
  avatar: string;
  bio: string;
  birthdate: null;
  birthdate_format: null;
  locations: {
    address: string;
    city: string;
    country: string;
    id: number;
    lat: number;
    lng: number;
    location_no: number;
  }[];
  name: string;
  phone: string;
  public_email: string;
  role: string;
  sex: null;
  surname: string;
  user_id: number;
  username: string;
}
