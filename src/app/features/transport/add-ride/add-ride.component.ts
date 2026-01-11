import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RideService } from '../../../core/services/ride.service';

@Component({
  selector: 'app-add-ride',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-ride.component.html',
  styleUrls: ['./add-ride.component.css']
})
export class AddRideComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  currentTime = '';

  constructor(
    private fb: FormBuilder,
    private rideService: RideService
  ) {}

  ngOnInit(): void {
    this.currentTime = this.getCurrentTimeString();

    this.form = this.fb.group({
      employeeId: ['', [Validators.required, Validators.minLength(3)]],
      vehicleType: ['', Validators.required],
      vehicleNo: ['', Validators.required],
      vacantSeats: ['', [Validators.required, Validators.min(1), Validators.max(7)]],
      time: [this.currentTime, [Validators.required, this.timeAfterNowValidator()]],
      pickupPoint: ['', Validators.required],
      destination: ['', Validators.required]
    });

    // Listen to vehicleType changes to update vacantSeats validators
    this.form.get('vehicleType')?.valueChanges.subscribe(vehicleType => {
      const vacantSeatsControl = this.form.get('vacantSeats');
      if (vehicleType === 'Bike') {
        // Auto-fill to 1 for Bike
        vacantSeatsControl?.setValue(1);
        vacantSeatsControl?.setValidators([Validators.required, Validators.min(1), Validators.max(1)]);
      } else if (vehicleType === 'Car') {
        // Clear and set validators for Car (1-7)
        vacantSeatsControl?.reset();
        vacantSeatsControl?.setValidators([Validators.required, Validators.min(1), Validators.max(7)]);
      } else {
        vacantSeatsControl?.reset();
        vacantSeatsControl?.setValidators([Validators.required, Validators.min(1)]);
      }
      vacantSeatsControl?.updateValueAndValidity();
    });
  }

  private getCurrentTimeString(): string {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  private timeAfterNowValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const val = control.value;
      if (!val) return null;
      const [h, m] = val.split(':').map(Number);
      const selected = h * 60 + m;
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      return selected > nowMinutes ? null : { notAfterNow: true };
    };
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.message = 'Please fill all required fields correctly';
      this.messageType = 'error';
      return;
    }

    // Prevent duplicate vehicle numbers
    const vehicleNo = this.form.get('vehicleNo')?.value;
    if (this.rideService.isVehicleNoTaken(vehicleNo)) {
      this.message = 'Vehicle number already used by another ride';
      this.messageType = 'error';
      return;
    }

    const success = this.rideService.addRide(this.form.value);
    
    if (success) {
      this.message = 'Ride added successfully!';
      this.messageType = 'success';
      this.form.reset();
      this.submitted = false;
    } else {
      this.message = 'Failed to add ride. You have a booked ride within ±60 minutes of this time.';
      this.messageType = 'error';
    }
  }

  get employeeId() {
    return this.form.get('employeeId');
  }

  get vehicleType() {
    return this.form.get('vehicleType');
  }

  get vehicleNo() {
    return this.form.get('vehicleNo');
  }

  get vacantSeats() {
    return this.form.get('vacantSeats');
  }

  get time() {
    return this.form.get('time');
  }

  get pickupPoint() {
    return this.form.get('pickupPoint');
  }

  get destination() {
    return this.form.get('destination');
  }
}