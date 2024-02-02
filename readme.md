# Forstu Assessment

# Backend

The backend of this application is built using Express.js and provides a set of RESTful API endpoints for handling Excel-related operations and managing student data.

## Getting Started

Make sure you have Node.js installed on your system to run the backend server. Navigate to the `backend` directory and install the dependencies:

```type:Generated,lang:Shell,path:,lines:0-0
npm install
npm run dev
```

This will start the backend server, making the API available for requests.

## Middlewares

The backend uses several middlewares for various purposes:

- [`cors`](backend/src/app.js#L13-L16): Handles Cross-Origin Resource Sharing (CORS) settings.
- [`express.json`](backend/src/app.js#L18): Parses incoming JSON requests and puts the parsed data in `req.body`.
- [`express.urlencoded`](backend/src/app.js#L20): Parses incoming requests with URL-encoded payloads.
- [`cookieParser`](backend/src/app.js#L24): Parses cookies attached to the client request object.
- [`express.static`](backend/src/app.js#L22): Serves static files from the `public` directory.

## Routes

The backend defines a set of routes for file operations and student management:

### Excel Routes

- **POST `/api/v1/excel/uploadExcel`**: Accepts an Excel file upload and processes the data.
  - Utilizes [`multer`](backend/src/routes/excel.routes.js#L14) middleware for handling `multipart/form-data`.
- **POST `/api/v1/excel/importJsonData`**: Imports JSON data into Excel and then into the database.

- **POST `/api/v1/excel/importExcel`**: Imports data directly from an Excel file into the database.

### Student Routes

- **POST `/api/v1/excel/student/create`**: Creates a new student record.

- **GET `/api/v1/excel/student`**: Retrieves a list of all students.

- **GET `/api/v1/excel/student/:id`**: Retrieves a single student by their ID.

- **PUT `/api/v1/excel/student/:id`**: Updates an existing student record by ID.

- **DELETE `/api/v1/excel/student/:id`**: Deletes a student record by ID.

## Controllers

Controllers contain the logic for handling each route's functionality. Key controllers include:

- [`uploadExcel`](backend/src/controllers/excel.controller.js#L134-L140): Handles the uploading and processing of Excel files.
- [`createStudent`](backend/src/routes/excel.routes.js#L24): Creates a new student in the database.
- [`getStudents`](backend/src/routes/excel.routes.js#L25): Retrieves all student records.
- [`getStudentById`](backend/src/routes/excel.routes.js#L26): Retrieves a student record by ID.
- [`updateStudent`](backend/src/routes/excel.routes.js#L27): Updates a student record.
- [`deleteStudent`](backend/src/routes/excel.routes.js#L28): Deletes a student record.

## Swagger API Documentation

Swagger is configured to auto-generate interactive API documentation, which can be accessed at `/api-docs`. The Swagger documentation is created from a JSON file loaded at startup:

```js
import { readFileSync } from 'fs';
import swaggerUi from 'swagger-ui-express';
const swaggerDocumentPath = './src/json/swagger-output.json';
const swaggerDocument = JSON.parse(readFileSync(swaggerDocumentPath, 'utf-8'));
...
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

This documentation allows developers to test the endpoints directly through the browser.

## Error Handling

The application should also include error handling strategies and potentially middleware for catching and responding to errors.

## Conclusion

This backend service provides the necessary API endpoints for the application's functionality related to Excel file processing and student data management. The Swagger-generated documentation offers a convenient way to interact with the API during development and testing.

---

# Frontend Documentation

The frontend of this application is developed using React and leverages TypeScript for type safety and improved developer experience. It features a dynamic form with data validation and the ability to submit form data via email using the EmailJS service.

## Getting Started

To set up the frontend, ensure you have Node.js and npm installed. Navigate to the `frontend` directory and execute the following commands to install dependencies and start the development server:

```type:Generated,lang:Shell,path:,lines:0-0
npm install
npm run dev
```

The application will be available at `http://localhost:3000` by default.

## Components

### [`App`](frontend/src/App.tsx#L1-L11)

The `App` component is the root component that renders the `DynamicForm` component.

### [`DynamicForm`](frontend/src/components/DynamicForm.tsx#L1-L297)

This is the main component where the user interacts with the form. It uses the `react-hook-form` library for form state management and validation.

#### Form Fields

The form includes fields for the user's username, email, state, age, date of birth, university, eligibility criteria, and phone numbers. It performs client-side validation using `react-hook-form`.

#### Phone Number List

This component allows users to dynamically add or remove phone numbers using `useFieldArray` from `react-hook-form`.

#### Form Submission

Upon form submission, the data is sent to an email recipient using EmailJS. The `handleSubmit` method from `react-hook-form` is used to handle the submission.

### [`FormDataDisplay`](frontend/src/components/FormDataDisplay.tsx#L1-L91)

This component displays the submitted form data in a tabular format.

## Validation

The form fields are validated for presence and specific formats, such as email validation. Custom validation messages are provided to guide the user.

## Styling

The application uses Tailwind CSS for styling. Classes are applied to form elements and containers to create a responsive and aesthetically pleasing interface.

## Email Integration

EmailJS is integrated for sending form submissions via email. The `emailjs.send` method is called upon form submission with relevant parameters.

## Development Tools

[`@hookform/devtools`](frontend/src/components/DynamicForm.tsx#L2) is used for debugging form state and performance. This tool is rendered conditionally and is helpful during the development process.

## State Management

The form data is managed using `useState` and `useEffect` hooks. After successful submission, the form is reset using the `reset` method from `react-hook-form`.

## Error Handling

User input errors are displayed using the errors object from `react-hook-form`. This provides immediate feedback to the user for correcting their inputs.

## Component Interaction

The `DynamicForm` and `FormDataDisplay` components interact by passing the submitted form data as a prop for display after successful submission.
