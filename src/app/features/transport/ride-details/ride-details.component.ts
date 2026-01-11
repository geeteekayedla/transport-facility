import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RideService } from '../../../core/services/ride.service';
import { Ride } from '../../../shared/models/ride.model';

@Component({
  selector: 'app-ride-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ride-details.component.html',
  styleUrls: ['./ride-details.component.css']
})
export class RideDetailsComponent implements OnInit {
  detailsForm!: FormGroup;
  createdRides: Ride[] = [];
  bookedRides: Ride[] = [];
  message = '';
  messageType: 'success' | 'error' = 'success';
  showDetails = false;

  constructor(
    private fb: FormBuilder,
    private rideService: RideService
  ) {}

  ngOnInit(): void {
    this.detailsForm = this.fb.group({
      employeeId: ['', Validators.required]
    });
  }

  getDetails(): void {
    const { employeeId } = this.detailsForm.value;

    if (!employeeId) {
      this.message = 'Please enter your Employee ID';
      this.messageType = 'error';
      this.showDetails = false;
      return;
    }

    // Get all rides
    this.rideService.rides$.subscribe(allRides => {
      // Filter rides created by this employee
      this.createdRides = allRides.filter(ride => ride.employeeId === employeeId);

      // Filter rides booked by this employee
      this.bookedRides = allRides.filter(ride => ride.bookedBy.includes(employeeId));

      this.showDetails = true;
      this.message = '';
    });
  }

  getRideCreatorName(ride: Ride): string {
    return `Employee ${ride.employeeId}`;
  }

  getBookedByNames(ride: Ride): string {
    if (ride.bookedBy.length === 0) return 'No bookings';
    return ride.bookedBy.map(id => `Employee ${id}`).join(', ');
  }
}
