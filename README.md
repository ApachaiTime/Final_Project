# National Park Locator 🌲

A responsive web application that helps users discover U.S. National Parks, explore park information, and quickly find parks near their location.

Built using React + Vite for fast development and optimized builds, this application integrates multiple APIs to deliver location-based park discovery and detailed park information.

## Features
### 🌍 Find Parks Near You

Users can enter their ZIP code to locate national parks near them.
The app uses a Geocoding API to convert the ZIP code into latitude and longitude coordinates, which are then used to calculate distances between the user and nearby parks.

Nearby parks are automatically sorted by distance and displayed in an easy-to-browse card layout.

### ⭐ Featured Parks

The app also highlights featured parks based on the number of activities available at each park.

Parks with the highest number of activities (such as hiking, camping, wildlife viewing, etc.) are surfaced as featured destinations, helping users discover parks with the most things to do.

### 🔎 Park Search

A built-in search bar allows users to search for any national park.

When a park is selected, the application routes the user to a dedicated page using the park’s parkCode, displaying detailed information about that specific park.

### 📄 Detailed Park Pages

Clicking on any park card navigates users to a dedicated park details page which includes:

Full park description

Standard operating hours

Contact information

Park address

Link to the official National Park website for reservations and additional information

Routing is handled dynamically so each park has its own unique page.

## Tech Stack

React

Vite

JavaScript (ES6+)

Responsive CSS / Flexbox

## APIs Used
National Park Service API

Provides park data including:

Park descriptions

Activities

Images

Contact information

Operating hours

Park codes for routing

https://www.nps.gov/subjects/developer/api-documentation.htm

Geocoding API

Used to convert ZIP codes into geographic coordinates (latitude and longitude), allowing the application to calculate distances and locate nearby parks.

##Responsive Design

The application is fully responsive and designed to work across:

Desktop

Tablet

Mobile devices

The layout adjusts dynamically to provide a clean browsing experience on any screen size.

### What This App Helps With

This application helps users:

Discover national parks near their location

Explore parks with the most available activities

Quickly search for any U.S. national park

Access detailed park information in one place

Navigate directly to official park websites for reservations or trip planning

It provides a simple and efficient way to plan outdoor trips and explore the U.S. National Park system.

<img width="1855" height="921" alt="image" src="https://github.com/user-attachments/assets/7472c8c4-f385-41ce-8730-a7abb5434755" />

<img width="1855" height="909" alt="image" src="https://github.com/user-attachments/assets/6142c64a-4ec6-49fa-b55f-700294b9cdee" />

<img width="1869" height="916" alt="image" src="https://github.com/user-attachments/assets/c09a7c45-43a1-4e3c-ac04-25737bbda004" />

<img width="1865" height="913" alt="image" src="https://github.com/user-attachments/assets/56c3cdcf-4799-4733-8197-f671670513e8" />
