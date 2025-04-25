# Doctor Listing Application

A React-based web application that allows users to search, filter, and sort a list of doctors based on specialties, consultation modes, fees, and experience. The app features an autocomplete search, dynamic filters, and a responsive design with Tailwind CSS styling.

## Features

- **Search**: Autocomplete search for doctors by name, symptoms, specialties, or clinics.
- **Filters**: Filter doctors by specialties and consultation modes (Video Consult, In Clinic).
- **Sorting**: Sort by price (low to high) or experience (most experienced first).
- **Responsive Design**: Optimized for desktop and mobile views.
- **Browser Navigation**: Retains filters and search state with Back/Forward navigation.
- **Styling**: Uses Tailwind CSS for a modern, blue-accented UI.

## Technologies Used

- **React**: Version 19.1.0 for building the UI.
- **Tailwind CSS**: Version 3.4.17 for styling.
- **React Scripts**: Version 5.0.1 for building and development.
- **Testing Libraries**: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `@testing-library/dom`.
- **Deployment**: Hosted on GitHub Pages using `gh-pages`.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/MS2766/Doctor-Listing.git
    ```

2. Navigate to the project directory:
    ```bash
    cd Doctor-Listing
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Start the development server:
    ```bash
    npm start
    ```

5. Open `http://localhost:3000` in your browser to see the app.

## Usage
- **Search Bar**: Type to search for doctors or specialties. Suggestions will appear with photos and details.
- **Filters**: Use the left panel to filter by specialties (searchable) or consultation mode. Sort options are available under "Sort by".
- **Doctor Cards**: Click "Book Appointment" to (currently a placeholder action).
- **Navigation**: Use browser Back/Forward buttons to retain filter states.

## Deployment

The app is deployed on GitHub Pages at:

**Live URL**: [https://MS2766.github.io/Doctor-Listing](https://MSent Steps

1. Build the project:
    ```bash
    npm run build
    ```

2. Deploy to GitHub Pages:
    ```bash
    npm run deploy
    ```

3. Configure GitHub Pages in repository settings:
    - Go to **Settings > Pages**.
    - Set source to `gh-pages` branch and `/root` folder.

## Data Source

The app uses a local JSON file (`public/doctors.json`) for doctor data, originally sourced from [https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json](https://srijandubey.github.io/campus-api-mock/SRM-Cribute:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. Make your changes and commit:
    ```bash
    git commit -m "Add your message"
    ```
4. Push to the branch:
    ```bash
    git push origin feature/your-feature-name
    ```
5. Open a pull request with a description of your changes.
