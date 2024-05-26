# Express Server Setup and Run Instructions

This README file provides the steps required to set up and run the Express server.

## Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 12 or higher)
- [npm](https://www.npmjs.com/) (Node package manager)

## Installation

1. **Clone the repository**:
   ```sh
   git clone <repository-url>
   ```

2. **Navigate to the project directory**:
   ```sh
   cd <project-directory>
   ```

3. **Install dependencies**:
   ```sh
   npm install
   ```

## Environment Variables

Create a `.env` file in the root of your project directory and add the necessary environment variables. For example:

```env
PORT=3000
```

## Running the Server

1. **Start the server**:
   ```sh
   npm start
   ```

   or, if you have nodemon installed globally, you can use:

   ```sh
   nodemon start
   ```

2. **Server should be running on**: 
   ```
   http://localhost:3000
   ```

## API Endpoints

### Authentication Routes
- `POST /api/auth/login` - User login

### User Routes
- `GET /api/user` - Get user details

### Property Routes
- `GET /api/property` - Get property details

## Example cURL Requests

To test the API endpoints, you can use cURL or Postman. Below are some example cURL requests:

### Example: User Login

```sh
curl -X POST http://localhost:3000/api/auth/login -H "username: yourUsername" -H "password: yourPassword"
```

### Example: Get User Details

```sh
curl -X GET http://localhost:3000/api/user -H "username: yourUsername" -H "password: yourPassword"
```

### Example: Get Property Details

```sh
curl -X GET http://localhost:3000/api/property -H "username: yourUsername" -H "password: yourPassword"
```

## Troubleshooting

### JSON Parsing Error

If you encounter a `SyntaxError: Unexpected token } in JSON` error, ensure the JSON body being sent is properly formatted. Use tools like [JSONLint](https://jsonlint.com/) to validate the JSON structure.

### Common Issues

- Ensure all dependencies are installed by running `npm install`.
- Verify the port is not in use by another application.
- Check the console output for any errors during startup.

## Contributing

If you would like to contribute to this project, please fork the repository and create a pull request.

## License

This project is licensed under the MIT License.

---

Replace `<repository-url>` with the actual URL of your repository and `<project-directory>` with the name of your project directory. This README file provides a comprehensive guide to setting up and running the Express server, including installation steps, environment variable setup, and example API requests.
