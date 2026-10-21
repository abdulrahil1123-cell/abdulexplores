import suv1 from "@/assets/suv1.jpg";
import suv2 from "@/assets/suv2.jpg";
import sedan1 from "@/assets/sedan1.jpg";
import sedan2 from "@/assets/sedan2.jpg";

export const RATES = { SUV: 2000, Sedan: 1000 } as const;
export type CarType = keyof typeof RATES;

export const PHONE = "+91 91217 05635";
export const EMAIL = "bookings@arrentals.in";
export const ADDRESS = "Road No. 12, Banjara Hills, Hyderabad, Telangana 500034";

export const cars: {
  name: string;
  type: CarType;
  image: string;
  seats: number;
  fuel: string;
  transmission: string;
}[] = [
  { name: "Toyota Fortuner", type: "SUV", image: suv1, seats: 7, fuel: "Diesel", transmission: "Automatic" },
  { name: "Mahindra XUV700", type: "SUV", image: suv2, seats: 7, fuel: "Diesel", transmission: "Manual / Automatic" },
  { name: "Honda City", type: "Sedan", image: sedan1, seats: 5, fuel: "Petrol", transmission: "Manual" },
  { name: "Hyundai Verna", type: "Sedan", image: sedan2, seats: 5, fuel: "Petrol", transmission: "Automatic" },
];

export const rentalTotal = (type: CarType, days: number) => RATES[type] * Math.max(1, Math.floor(days));
export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
