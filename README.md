# HireMate AI - AI Interview Preparation & Career Assistant

HireMate AI is a production-grade, full-stack SaaS platform designed to accelerate career paths and technical preparation. It enables candidates to generate live 10-question technical mock interviews, submit responses for real-time AI evaluations (receiving grading scores, strengths, weaknesses, and suggestions), upload PDF resumes for ATS optimization, and compile structured weekly learning roadmaps.

---

## Technical Stack & Architecture

### Backend Stack
- **Runtime**: Java 21
- **Framework**: Spring Boot 3.3.0
- **Security**: Spring Security 6 (Stateless JWT token authentication, BCrypt password hashing)
- **Database Mapping**: Spring Data JPA & Hibernate ORM
- **Database**: MySQL 8.x
- **Utilities**: Apache PDFBox 3.x (resume parsing), Lombok (boilerplates removal), Swagger OpenAPI (API docs)
- **AI API**: OpenAI API (standard Chat Completions, configured with live/mock fallback capability)

### Frontend Stack
- **Runtime & Library**: React 18 with Vite
- **Styling**: Tailwind CSS v3 (Custom HSL dark theme and glassmorphic designs)
- **Networking**: Axios (configured with automated JWT request interceptors)
- **Routing**: React Router Dom v6
- **Icons**: Lucide React Icons

---

## Directory Structure

```
HireMate-Ai/
├── backend/                  # Spring Boot Maven Project
│   ├── pom.xml               # Dependencies and build settings
│   └── src/main/
│       ├── java/             # Source files
│       └── resources/        # Application properties
├── frontend/                 # React Vite Project
│   ├── package.json          # Node modules details
│   ├── index.html            # Core template file
│   └── src/                  # App components and screens
└── README.md                 # Setup and run manual
```

---

## Environment Variables & Configuration

### Backend: `backend/src/main/resources/application.properties`
The backend utilizes the following core parameters. You can modify them directly in the properties file or set them as environment variables override on boot.

```properties
# MySQL Connection parameters
spring.datasource.url=jdbc:mysql://localhost:3306/hiremate_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=password

# JWT Authentication Config
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000

# OpenAI API Integration
# Setting this to "mock" turns on the offline simulated mode.
# Set a live OpenAI API key to execute actual live OpenAI prompts.
openai.key=mock
openai.url=https://api.openai.com/v1/chat/completions
openai.model=gpt-4o-mini
```

---

## Database Setup

1. Make sure your local **MySQL Server** is running.
2. The JPA Hibernate configuration uses `spring.jpa.hibernate.ddl-auto=update` and has `createDatabaseIfNotExist=true` appended inside the connection URL. This means the schema `hiremate_db` and all related tables (`users`, `interview_sessions`, `questions`, `evaluations`, `resume_analysis`) **will be created automatically** on first startup of the backend. No manual SQL import is necessary.
3. If you want to verify the tables manually via CLI or Workbench:
   ```sql
   CREATE DATABASE IF NOT EXISTS hiremate_db;
   USE hiremate_db;
   SHOW TABLES; -- After backend starts, you will see 5 tables.
   ```

---

## Run Commands

### 1. Run Backend (Spring Boot)
Ensure you have **Maven** and **Java 21 JDK** installed.

```bash
# Navigate to the backend folder
cd backend

# Compile dependencies and packages
mvn clean install

# Launch the Spring Boot application
mvn spring-boot:run
```
- API starts at: `http://localhost:8080`
- Swagger OpenAPI documentation will be visible at: `http://localhost:8080/swagger-ui/index.html`

### 2. Run Frontend (React Vite)
Ensure you have **NodeJS** installed.

```bash
# Navigate to the frontend folder
cd frontend

# Install node dependencies
npm install

# Run the local Vite dev server
npm run dev
```
- Client starts at: `http://localhost:5173` (Open this in your browser to view the landing screen).

---

## Live vs Mock Simulation Mode

HireMate AI includes a dual-mode integration layer:
- **Mock Mode (Default)**: Set `openai.key=mock` in `application.properties`. In this state, the application requires no external internet connection or credits. It simulates highly tailored Technical Interview questions, Resume scoring analysis, and Weekly study roadmaps dynamically in code.
- **Live Mode**: Replace `openai.key=mock` with your actual **OpenAI API Key** (e.g. `sk-proj-...`). The platform will automatically execute live, structured JSON completions calls using `gpt-4o-mini` to grade and build prompts.

---

## Production Deployment Instructions

### 1. Backend Build
To package the Spring Boot backend into a single executable Fat JAR:
```bash
cd backend
mvn clean package -DskipTests
```
The output jar will be saved in `backend/target/ai-0.0.1-SNAPSHOT.jar`. Run it with:
```bash
java -jar target/ai-0.0.1-SNAPSHOT.jar
```

### 2. Frontend Build
To package the React client into compressed, static assets:
```bash
cd frontend
npm run build
```
Vite will compile the code to the `frontend/dist` directory. This static bundle can be served directly from an Nginx container, hosted on Vercel/Netlify, or mapped inside the Spring Boot resources directory to run a single service.
