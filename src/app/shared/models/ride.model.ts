export interface Ride {
  id: string;
  employeeId: string;
  vehicleType: 'Bike' | 'Car';
  vehicleNo: string;
  vacantSeats: number;
  time: string; // HH:mm format
  pickupPoint: string;
  destination: string;
  bookedBy: string[]; // Array of employee IDs who booked this ride
  createdAt: Date;
}

export interface BookingRequest {
  employeeId: string;
  rideId: string;
}