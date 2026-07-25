
# Project Overview

## Study Room Access

Study Room Access is a simulated university study-space reservation system. It allows students to view available study rooms, see room details, and create or retrieve reservations.

The system is intended to represent the type of service a university might use to coordinate limited study spaces across multiple campus buildings. During high-demand periods, such as midterms and final exams, many students may attempt to search for rooms and make reservations at the same time. Separating the system into multiple services allows each part to be developed, deployed, and scaled independently.

## Intended Users

The primary users are university students who need access to quiet and reliable places to study. This includes:

* Commuter students
* Students living in crowded housing
* Students without a suitable workspace at home
* Student groups that need rooms for collaborative work

## Core Features

The initial version of the system will support:

* Viewing a list of study rooms
* Viewing room locations, capacities, and availability
* Creating study-room reservations
* Retrieving existing reservations
* Monitoring or logging service activity through a sidecar container

This project uses fake data and does not connect to an actual university reservation system.
