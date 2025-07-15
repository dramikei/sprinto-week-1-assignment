# Book Management System

A full-stack web application for browsing and managing a collection of books and their associated authors. Built with modern technologies including GraphQL, Next.js, PostgreSQL, and MongoDB. Developed as part of Sprinto's 1st week onboarding assignment

## 🚀 Live Demo

The application is live at: **https://demo.dramikei.com/**

*Note: The demo is self-hosted on my homelab currently with reverse proxy and SSL certificates automatically managed. But it can easily be hosted on any major service like AWS*

## Explanation:
- **Backend**: [Loom](https://www.loom.com/share/c685cf67df354260af31715be81aca92?sid=556a46fa-54f6-4337-a50a-5b4fd1d07842)
- **Frontend**: [Loom](https://www.loom.com/share/db8e71538fdc4fd7b312fc64d386fd9d?sid=78258ff1-3cbf-4bd3-974b-f15bd2b9d896)
- **Infra**: [Loom](https://www.loom.com/share/8c7230f0b6f949698e7200d9334fcab3?sid=bcfa7aaa-1553-4a49-9d9a-2e9a9ec25096)
## 📋 Features

### Core Functionality
- **Book Management**: CRUD operations on Book entity with pagination and filtering
- **Author Management**: CRUD operations on Author entity with pagination and filtering
- **Advanced Search**: Filter books by title, author, and publication date (FE only supports keyword search and Year search)
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **File Upload**: Support for book covers and author photos using presigned URLs and self-hosted Minio

### Technical Features
- **GraphQL API**: Data fetching and GraphQL Validation implemented through Apollo
- **Dual Database**: PostgreSQL for relational data, MongoDB for metadata (reviews)
- **Robust Error Handling**: Global error middleware
- **Extensible Loggign**: Comprehensive logging using Winston that can be extended to file-logging, OpenSearch etc.
- **Type Safety**: Zod validation for API calls
- **Monitoring**: Sentry integration for error tracking
- **Containerized**: Fully dockerized application with compose setup

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Apollo Server** - RESTAPI server
- **Apollo Server** - GraphQL server
- **PostgreSQL** - Primary database with Sequelize ORM
- **MongoDB** - Secondary database for metadata
- **MinIO** - S3-compatible object storage for file uploads. Also self-hosted on my homelab.
- **Winston** - Extensible logging (file, console, OpenSearch)
- **Zod** - Runtime type validation
- **Sentry** - Error monitoring and performance tracking

### Frontend
- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Apollo Client** - GraphQL client for state management

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Reverse Proxy** - Using Caddy for Automated SSL and routing
- **DNS Proxy** - Cloudflare DNS proxy to redact actual server IP

## 🏗 Database Schema

### PostgreSQL (Primary Data)
```sql
-- Authors table
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  biography TEXT,
  born_date DATE,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Books table
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  published_date DATE,
  author_id INTEGER REFERENCES authors(id),
  cover_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### MongoDB (Metadata)
- User reviews and ratings

```
{
  book_id: {
    type: Number,
    required: true,
    ref: 'Book',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 1000,
  },
  helpful_count: {
    type: Number,
    default: 0,
  },
}
```

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### Quick Start with Docker
```bash
# Clone the repository
git clone <repository-url>
cd week-1-assignment-sprinto

# Fill required envs, check .env.sample
# minio is not included in the compose, host your own or use AWS S3.

# Start all services
docker-compose up -d

# The application will be available at:
# - Frontend: http://localhost:3000
# - GraphQL Playground: http://localhost:4000/graphql
```

### Local Development
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the backend
cd backend
npm run start:dev

cd frontend
# Start the frontend (in another terminal)
npm run start:dev
```

## 🔧 Configuration

The application uses a centralized config provider that validates all environment variables at startup. Required variables include:

```env
## Backend Envs
# Application envs
NODE_ENV=production
PORT=4000
LOG_LEVEL=debug
ENABLE_FILE_LOGGING=false
ENABLE_CONSOLE_LOGGING=true
SENTRY_DSN=
ENABLE_SENTRY=false

# PostgreSQL
POSTGRES_HOST=postgres
POSTGRES_DB=book_management
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
MONGODB_URI=mongodb://mongodb:27017/book_management_meta

# MongoDB
MONGODB_URI=mongodb://localhost:27017/book_management_meta
MONGO_INITDB_DATABASE=book_management_meta

# Minio/S3-compatible object storage
S3_ENDPOINT=s3.dramikei.com
S3_PORT=9004
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_BUCKET=sprinto-week-1-assignment

# Frontend
FRONTEND_URL=https://demo.dramikei.com # This is used to sets CORS rules in Express.

## Frontend Envs
NEXT_PUBLIC_GRAPHQL_URL=https://demo.backend.dramikei.com/graphql
BACKEND_URL=https://demo.backend.dramikei.com
```

## 📊 API Operations


## 🔒 Security & Error Handling

- **Global Error Middleware**: Comprehensive error handling with detailed logging
- **Input Validation**: Zod schemas validate all API inputs
- **File Upload Security**: Presigned URLs for secure file uploads
- **Error Monitoring**: Sentry integration for production error tracking
- **Request Logging**: Winston logger with multiple output formats

## 🧪 Testing

```bash
# Run backend tests
npm run test # Contains basic model tests, integration tests coming soon!
```

## 📂 Project Structure

```
.
├── backend
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── database
│   │   │   ├── mongodb.js
│   │   │   └── postgres.js
│   │   ├── graphql
│   │   │   ├── resolvers.js
│   │   │   └── typeDefs.js
│   │   ├── middleware
│   │   │   ├── apollo-error-handler.middleware.js
│   │   │   └── error-handler.middleware.js
│   │   ├── models
│   │   │   ├── mongodb
│   │   │   │   └── Review.js
│   │   │   └── postgres
│   │   │       ├── Author.js
│   │   │       ├── Book.js
│   │   │       └── index.js
│   │   ├── server.js
│   │   └── utils
│   │       ├── config.js
│   │       ├── logger
│   │       │   ├── config.js
│   │       │   └── logger.js
│   │       ├── minio.js
│   │       └── sentry.js
│   ├── tests
│   │   └── models.test.js
│   └── uploads
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── eslint.config.mjs
│   ├── jsconfig.json
│   ├── next.config.mjs
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── public
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── README.md
│   └── src
│       ├── app
│       │   ├── authors
│       │   │   ├── [id]
│       │   │   │   ├── books
│       │   │   │   │   └── page.jsx
│       │   │   │   ├── edit
│       │   │   │   │   └── page.jsx
│       │   │   │   ├── loading.jsx
│       │   │   │   └── page.jsx
│       │   │   ├── loading.jsx
│       │   │   ├── new
│       │   │   │   └── page.jsx
│       │   │   └── page.jsx
│       │   ├── books
│       │   │   ├── [id]
│       │   │   │   ├── edit
│       │   │   │   │   └── page.jsx
│       │   │   │   ├── loading.jsx
│       │   │   │   └── page.jsx
│       │   │   ├── loading.jsx
│       │   │   ├── new
│       │   │   │   └── page.jsx
│       │   │   └── page.jsx
│       │   ├── favicon.ico
│       │   ├── globals.css
│       │   ├── layout.jsx
│       │   ├── loading.jsx
│       │   └── page.jsx
│       ├── components
│       │   ├── forms
│       │   │   ├── AuthorForm.jsx
│       │   │   ├── BookForm.jsx
│       │   │   ├── components
│       │   │   │   ├── FormInput.jsx
│       │   │   │   ├── FormLabel.jsx
│       │   │   │   ├── FormSelect.jsx
│       │   │   │   └── FormTextArea.jsx
│       │   │   └── ReviewForm.jsx
│       │   ├── layouts
│       │   │   ├── AuthorsSearchAndListSection.jsx
│       │   │   ├── BooksSearchAndListSection.jsx
│       │   │   ├── components
│       │   │   │   ├── AuthorCards.jsx
│       │   │   │   └── BookCards.jsx
│       │   │   ├── Navbar.jsx
│       │   │   ├── RecentAuthorsSection.jsx
│       │   │   ├── RecentBooksSection.jsx
│       │   │   └── WelcomeSection.jsx
│       │   └── ui
│       │       ├── DeleteButton.jsx
│       │       ├── EditButton.jsx
│       │       ├── EmptyState.jsx
│       │       ├── PaginationButton.jsx
│       │       └── TooltipButton.jsx
│       ├── lib
│       │   ├── apollo.js
│       │   ├── queries.js
│       │   └── repository.js
│       └── utils
│           └── utils.ts
└── README.md
```

## 🚧 Known Limitations

- **Authentication**: Authentication and authorization are not implemented in the current version
- **Frontend Tests**: Frontend does not have tests written yet.
- **Linting and Code formatter**: Implement strict linting and code formatting rules.
