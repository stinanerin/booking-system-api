# Booking System Backend Server

This is the backend server for the Booking System application. It provides API endpoints for managing bookings and user authentication.

## Client application

<!-- > [View laundry room booking application](https://stormstina.github.io/laundry-room-booking-system/) -->

> [View code](https://github.com/stormstina/laundry-room-booking-system)

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **bcrypt** 
  - Password encryption
- **express-session** 
  - User session management

## API Documentation

### Base URL

The base URL for all API endpoints is: `https://express-booking-system-backend.herokuapp.com/api/v.1`

### Endpoints

| Method | Route                          | Description                                              |
| ------ | ------------------------------ | -------------------------------------------------------- |
| GET    | /bookings                      | Get all bookings                                         |
| GET    | /bookings/:id                  | Get a booking by ID                                      |
| POST   | /bookings                      | Add a new booking                                        |
| DELETE | /bookings/:id                  | Delete a booking by ID                                   |
| GET    | /user/booking                  | Get the booking of the currently signed-in user          |
| GET    | /user/active                   | Get information about the currently signed-in user       |
| POST   | /user/login                    | Authenticate a user for login                            |
| POST   | /user/register                 | Register a new user                                      |

### Authentication

User authentication is required for the following endpoints, which means the session token need to be included in the request header.

- `/bookings`
- `/bookings/:id`
- `/user/booking`
- `/user/active`
- `/user/logout`

