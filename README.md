# NestJS Template

This is a basic template for a NestJS application with Docker, PostgreSQL, TypeORM, and JWT authentication.

## Features

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Docker**: Containerization for easy deployment and development.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **TypeORM**: An ORM for TypeScript and JavaScript (ES7, ES6, ES5).
- **JWT Authentication**: Secure authentication using JSON Web Tokens.

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine.
- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/manucasares/NestJS-Template-Authentication-Zod.git
    cd NestJS-Template-Authentication-Zod
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a [.env](http://_vscodecontentref_/1) file based on the `.env.example` file and fill in your environment variables.

### Running the Application

1. Start the Docker containers:

    ```sh
    docker-compose up -d
    ```

2. Start the NestJS application:

    ```sh
    npm run start:dev
    ```

3. The application will be running at `http://localhost:3000`.
