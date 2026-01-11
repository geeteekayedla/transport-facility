import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RideService } from '../../../core/services/ride.service';
import { Ride } from '../../../shared/models/ride.model';

@Component({
  selector: 'app-browse-rides',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './browse-rides.component.html',
  styleUrls: ['./browse-rides.component.css']
})
export class BrowseRidesComponent implements OnInit {
  filterForm!: FormGroup;
  rides: Ride[] = [];
  message = '';
  messageType: 'success' | 'error' = 'success';
  showRides = false;

  constructor(
    private fb: FormBuilder,
    private rideService: RideService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      employeeId: [''],
      time: ['', Validators.required],
      vehicleType: ['']
    });
  }

  searchRides(): void {
    const { employeeId, time, vehicleType } = this.filterForm.value;

    if (!time) {
      this.message = 'Please enter a time';
      this.messageType = 'error';
      this.showRides = false;
      return;
    }

    this.rideService.getAvailableRides(time, vehicleType || undefined)
      .subscribe(rides => {
        this.rides = rides;
        this.showRides = true;
        this.message = '';
      });
  }

  bookRide(rideId: string): void {
    const employeeId = this.filterForm.get('employeeId')?.value;

    if (!employeeId) {
      this.message = 'Please enter your Employee ID';
      this.messageType = 'error';
      return;
    }

    const success = this.rideService.bookRide(employeeId, rideId);

    if (success) {
      this.message = 'Ride booked successfully!';
      this.messageType = 'success';
    } else {
      this.message = 'Failed to book ride. Check if seats are available or if you already booked this ride.';
      this.messageType = 'error';
    }
  }

  getRideCreatorName(ride: Ride): string {
    return `Employee ${ride.employeeId}`;
  }
}