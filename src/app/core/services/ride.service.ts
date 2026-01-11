import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Ride } from '../../shared/models/ride.model';

@Injectable({
  providedIn: 'root'
})
export class RideService {
  private rides = new BehaviorSubject<Ride[]>([]);
  public rides$ = this.rides.asObservable();
  private BUFFER_TIME = 60; // minutes

  constructor() {}

  // Add a new ride
  addRide(ride: Omit<Ride, 'id' | 'bookedBy' | 'createdAt'>): boolean {
    const currentRides = this.rides.value;
    
    // Check if vehicle number is already used
    const vehicleExists = currentRides.some(r => r.vehicleNo === ride.vehicleNo);
    if (vehicleExists) {
      console.error('Vehicle number already exists');
      return false;
    }

    // Check if employee has booked any ride within ±60 minutes of the new ride time
    const bookedRideConflict = currentRides.some(r => 
      r.bookedBy.includes(ride.employeeId) && this.isTimeMatching(r.time, ride.time)
    );
    
    if (bookedRideConflict) {
      console.error('Cannot add ride. You have a booked ride within ±60 minutes of this time.');
      return false;
    }
    
    // Check if employee already has a ride at the same time
    const employeeRideExists = currentRides.some(
      r => r.employeeId === ride.employeeId && 
           this.isSameTime(r.time, ride.time)
    );
    
    if (employeeRideExists) {
      console.error('Employee already has a ride at this time');
      return false;
    }

    const newRide: Ride = {
      ...ride,
      id: this.generateId(),
      bookedBy: [],
      createdAt: new Date()
    };

    this.rides.next([...currentRides, newRide]);
    return true;
  }

  // Book a ride
  bookRide(employeeId: string, rideId: string): boolean {
    const currentRides = this.rides.value;
    const ride = currentRides.find(r => r.id === rideId);

    if (!ride) {
      console.error('Ride not found');
      return false;
    }

    // Check if employee is the ride creator
    if (ride.employeeId === employeeId) {
      console.error('Cannot book your own ride');
      return false;
    }

    // Check if employee already booked this ride
    if (ride.bookedBy.includes(employeeId)) {
      console.error('Employee already booked this ride');
      return false;
    }

    // Check if seats are available
    if (ride.vacantSeats <= 0) {
      console.error('No vacant seats available');
      return false;
    }

    // Check if employee already has a ride at the same time
    const hasConflict = currentRides.some(
      r => r.bookedBy.includes(employeeId) && 
           this.isSameTime(r.time, ride.time)
    );

    if (hasConflict) {
      console.error('Employee already has a booking at this time');
      return false;
    }

    // Update the ride
    const updatedRide = {
      ...ride,
      vacantSeats: ride.vacantSeats - 1,
      bookedBy: [...ride.bookedBy, employeeId]
    };

    const updatedRides = currentRides.map(r => r.id === rideId ? updatedRide : r);
    this.rides.next(updatedRides);
    return true;
  }

  // Get rides with time matching (buffer time +/- 60 minutes)
  getAvailableRides(time: string, vehicleType?: 'Bike' | 'Car'): Observable<Ride[]> {
    return new Observable(observer => {
      this.rides$.subscribe(rides => {
        const filtered = rides.filter(ride => 
          this.isTimeMatching(ride.time, time) &&
          ride.vacantSeats > 0 &&
          (!vehicleType || ride.vehicleType === vehicleType)
        );
        observer.next(filtered);
      });
    });
  }

  // Get rides by vehicle type
  getRidesByVehicleType(vehicleType: 'Bike' | 'Car'): Observable<Ride[]> {
    return new Observable(observer => {
      this.rides$.subscribe(rides => {
        const filtered = rides.filter(
          ride => ride.vehicleType === vehicleType && ride.vacantSeats > 0
        );
        observer.next(filtered);
      });
    });
  }

  // Helper method to check if times are within buffer
  private isTimeMatching(rideTime: string, requestedTime: string): boolean {
    const rideMinutes = this.timeToMinutes(rideTime);
    const requestedMinutes = this.timeToMinutes(requestedTime);
    const diff = Math.abs(rideMinutes - requestedMinutes);
    return diff <= this.BUFFER_TIME;
  }

  // Helper method to check if times are exactly the same
  private isSameTime(time1: string, time2: string): boolean {
    return time1 === time2;
  }

  // Convert HH:mm to minutes
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Check if a vehicle number is already used in existing rides
  public isVehicleNoTaken(vehicleNo: string): boolean {
    return this.rides.value.some(r => r.vehicleNo === vehicleNo);
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}