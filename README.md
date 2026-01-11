# Transport Facility

A modern Angular application for booking and managing office rides. Employees can add rides, browse available options, and view ride details.

## Features

- **Home Dashboard** - Welcome page with quick access to main features
- **Add Ride** - Create new rides with vehicle details and route information
- **Browse Rides** - Search and filter available rides
- **Ride Details** - View comprehensive information about specific rides
- **Responsive Design** - Mobile-friendly interface
- **Form Validation** - Comprehensive client-side validation for ride creation
- **Vehicle Management** - Support for different vehicle types (Bike, Car)

## Project Structure

```
src/
├── app/
│   ├── features/
│   │   └── transport/
│   │       ├── home/
│   │       ├── browse-rides/
│   │       ├── add-ride/
│   │       └── ride-details/
│   ├── core/
│   │   └── services/
│   ├── shared/
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.config.ts
├── styles.css
└── main.ts
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Angular CLI

### Installation

```bash
npm install
```

### Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Routes

- `/` - Home page
- `/browse` - Browse available rides
- `/add` - Add a new ride
- `/details` - View ride details

## Technologies Used

- **Angular 17** - Frontend framework
- **Reactive Forms** - Form management and validation
- **TypeScript** - Programming language
- **Bootstrap** - Styling framework
- **CSS Custom Properties** - Theme variables

## Key Components

- [AddRideComponent](src/app/features/transport/add-ride/add-ride.component.ts) - Create new rides with full validation
- [BrowseRidesComponent](src/app/features/transport/browse-rides/browse-rides.component.ts) - Search and filter rides
- [RideDetailsComponent](src/app/features/transport/ride-details/ride-details.component.ts) - View ride information
- [HomeComponent](src/app/features/transport/home/home.component.ts) - Landing page

## Services

- `RideService` - Manages ride data and operations

## Notes

- All rides are for the current day only
- Vehicle numbers must be unique
- Users cannot have overlapping bookings within ±60 minutes
- Bikes have a fixed capacity of 1 seat
- Cars can have 1-7 vacant seats

