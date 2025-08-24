# 🍱 Barcode Nutrition App – MVP Plan (Full Stack, AWS-focused)

## 🧩 Tech Stack

### 👨‍💻 Backend

- **Language**: JavaScript (Node.js)
- **Framework**: Express.js
- **Containerization**: Docker
- **Database**: PostgreSQL (AWS RDS)
- **Authentication**: AWS Cognito (OAuth2 + JWT)
- **API Gateway**: AWS API Gateway (routing, rate limiting, JWT validation)
- **LLM Fallback**: OpenAI GPT via Express route or AWS Lambda
- **Secrets Management**: AWS Secrets Manager
- **Monitoring**: AWS CloudWatch

### 🖥 Frontend (Web MVP)

- **Framework**: Next.js (React 18+, App Router)
- **Design Language**: Apple-like, minimal, clean UI
- **Camera Integration**: ZXing-JS (in-browser barcode scanning)
- **PWA Features**: Installable, native-feel mobile web app

### 🧪 Testing

- **Backend**: Jest (unit + integration)
- **E2E**: Playwright or Cypress
- **Mocks**: Supertest, MSW (if needed)

### 🚀 CI/CD & Deployment

- **CI/CD**: GitHub Actions
  - Lint, Test, Build Docker, Deploy to EC2
- **Deployment**:
  - Dockerized Express API on EC2
  - RDS for database
  - API Gateway as public entrypoint
  - NGINX (optional) or API Gateway direct to app

---

## ✅ Feature Checklist

### 🔐 Auth

- [ ] Cognito User Pool setup
- [ ] OAuth2 sign-in with JWT issuance
- [ ] JWT validation middleware

### 🧾 Product Scan Flow

- [ ] Frontend barcode scanner (ZXing-JS)
- [ ] Express endpoint: `/product/:barcode`
- [ ] Lookup Open Food Facts API
- [ ] Fallback to LLM (OpenAI) if no result
- [ ] Save scan to history (Postgres)
- [ ] Mark/save favorite products

### 📦 Data Management

- [ ] RDS schema: Users, Scan History, Favorites
- [ ] Store minimal product info for caching
- [ ] Secure secrets in Secrets Manager

### 🧪 Testing

- [ ] Jest unit tests (routes, services)
- [ ] Integration tests with mocked APIs
- [ ] E2E tests (Playwright/Cypress): login → scan → save

### 🔧 DevOps & CI/CD

- [ ] Dockerfile & docker-compose for backend
- [ ] GitHub Actions: lint, test, build, deploy
- [ ] Deploy backend to EC2 (Dockerized)
- [ ] CloudWatch logging enabled
- [ ] Use IAM roles for secrets access

---

## 🌍 APIs & Libraries

- **Open Food Facts** – primary product data source
- **ZXing-JS** – barcode scanning in-browser
- **OpenAI API** – fallback product analysis/explanation
- **AWS SDK** – for Secrets Manager, Cognito, S3 access

---

## 📈 Future Enhancements

- Migrate backend to Lambda (if needed)
- Replace Next.js with React Native app (reuse API)
- Add ML Kit for mobile image-based scanning
- Add user-contributed product data
- Recipe recommendations via LLM
