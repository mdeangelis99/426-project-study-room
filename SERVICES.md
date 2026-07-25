# Service Architecture

The Study Room Access system is divided into two application services and one supporting sidecar container.

## Room Service

The Room Service provides information about available study rooms.

Example responsibilities:

* Return a list of study rooms
* Provide room names and locations
* Provide room capacities
* Report whether rooms are available
* Simulate a slower room-search operation

Example endpoints:

* `GET /rooms`
* `GET /rooms/:id`
* `GET /rooms/search`

## Reservation Service

The Reservation Service manages simulated study-room reservations.

Example responsibilities:

* Return a list of reservations
* Return a specific reservation
* Create a simulated reservation
* Associate reservations with rooms and students

Example endpoints:

* `GET /reservations`
* `GET /reservations/:id`
* `POST /reservations`

The initial version may store reservation data in memory and return plausible fake data rather than using a database.

## Logging Sidecar

The Logging Sidecar runs alongside one of the application services. It provides a supporting function without being part of the main application logic.

Its responsibilities include:

* Periodically checking whether the service is reachable
* Recording health-check results
* Logging whether the service is responding successfully

## Architecture Diagram

```text
                         +----------------------+
                         |        Client        |
                         +----------+-----------+
                                    |
                    +---------------+---------------+
                    |                               |
                    v                               v
          +-------------------+           +---------------------+
          |   Room Service    |           | Reservation Service |
          |                   |           |                     |
          | GET /rooms        |           | GET /reservations   |
          | GET /rooms/:id    |           | POST /reservations  |
          +---------+---------+           +---------------------+
                    |
                    v
          +-------------------+
          | Logging Sidecar   |
          |                   |
          | Health checks and |
          | service logging   |
          +-------------------+
```

## Container Communication

Docker Compose will start all containers with one command. Containers will communicate using their Docker Compose service names on the shared internal network.
