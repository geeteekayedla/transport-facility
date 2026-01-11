import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RideDetailsComponent } from './ride-details.component';
import { RideService } from '../../../core/services/ride.service';
import { of } from 'rxjs';
import { Ride } from '../../../shared/models/ride.model';

describe('RideDetailsComponent', () => {
  let fixture: ComponentFixture<RideDetailsComponent>;
  let component: RideDetailsComponent;

  const mockRides: Ride[] = [
    {
      id: 'r1',
      employeeId: 'E1',
      vehicleType: 'Car',
      vehicleNo: 'CAR-123',
      vacantSeats: 3,
      time: '09:30',
      pickupPoint: 'Office',
      destination: 'Home',
      bookedBy: ['E2'],
      createdAt: new Date()
    },
    {
      id: 'r2',
      employeeId: 'E3',
      vehicleType: 'Bike',
      vehicleNo: 'BIKE-1',
      vacantSeats: 1,
      time: '10:15',
      pickupPoint: 'Office',
      destination: 'Station',
      bookedBy: ['E1'],
      createdAt: new Date()
    }
  ];

  const mockRideService = {
    rides$: of(mockRides)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideDetailsComponent],
      providers: [{ provide: RideService, useValue: mockRideService }]
    }).compileComponents();

    fixture = TestBed.createComponent(RideDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error when employeeId is empty', () => {
    component.detailsForm.setValue({ employeeId: '' });
    component.getDetails();
    expect(component.showDetails).toBeFalse();
    expect(component.message).toContain('Please enter your Employee ID');
  });

  it('should populate createdRides and bookedRides for a valid employeeId', () => {
    component.detailsForm.setValue({ employeeId: 'E1' });
    component.getDetails();
    expect(component.showDetails).toBeTrue();
    // E1 created ride r1 and booked ride r2
    expect(component.createdRides.length).toBe(1);
    expect(component.createdRides[0].id).toBe('r1');
    expect(component.bookedRides.length).toBe(1);
    expect(component.bookedRides[0].id).toBe('r2');
  });

  it('getBookedByNames should return proper display string', () => {
    const ride = mockRides[0];
    const names = component.getBookedByNames(ride);
    expect(names).toContain('Employee E2');
  });
});
