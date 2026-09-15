PACK-CHECK

AI-Powered Legal Metrology Compliance Inspection

Pack-Check is an AI-assisted compliance screening platform for packaged commodities. It allows an operator to capture/upload product-label images, extract declarations using Gemini Vision/OCR, validate those extracted declarations against configured Legal Metrology rules, generate an inspection result, save the inspection, and generate a PDF report.

Important: Metro-Check is an AI-assisted screening system, not a substitute for an official legal determination. The AI/OCR layer extracts information; the Node.js compliance rule engine applies the configured rules.

1. Project Goal

Problem

Checking packaged-product labels manually can be slow and inconsistent. Important declarations such as:

Product name

Manufacturer

Net quantity

MRP

Consumer-care information

Date-related declarations

may be missing, unclear, or difficult to verify from images.

Solution

Metro-Check follows this pipeline:

Product Image
     ↓
Gemini Vision / OCR
     ↓
Extracted Declarations
     ↓
Node.js Compliance Rule Engine
     ↓
COMPLIANT / NON-COMPLIANT / NEEDS REVIEW
     ↓
Evidence + Report

Critical architecture rule

Gemini/OCR must NOT make the final legal-compliance decision.

The AI/OCR service extracts structured information. The backend rule engine evaluates that information against configured rules.

2. Main User Flows

Public Demo

Landing Page
    ↓
Try Demo
    ↓
Upload / Camera
    ↓
AI Analysis
    ↓
Screening Result

Public users can test the core scanning experience without creating an operator account.

Operator Flow

Landing Page
    ↓
Login / Signup
    ↓
Operator Dashboard
    ↓
New Inspection
    ↓
Capture / Upload Images
    ↓
AI + OCR Analysis
    ↓
Declaration Extraction
    ↓
Compliance Rule Engine
    ↓
COMPLIANT / NON-COMPLIANT / NEEDS REVIEW
    ↓
Save Inspection
    ↓
PDF Report
    ↓
Inspection History

3. Technology Stack

Frontend

React

Vite

Tailwind CSS

shadcn/ui

Lucide React

Recharts

Axios

Backend

Node.js

Express.js

JWT

bcrypt

Multer

Database

MySQL or PostgreSQL

AI / OCR

Gemini Vision API

Tesseract.js / OCR fallback

Reporting

PDFKit

4. Repository Structure

metro-check/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   │   ├── ai.service.js
│   │   │   ├── ocr.service.js
│   │   │   ├── compliance.service.js
│   │   │   └── report.service.js
│   │   │
│   │   ├── rules/
│   │   │   ├── mrp.rule.js
│   │   │   ├── quantity.rule.js
│   │   │   ├── manufacturer.rule.js
│   │   │   ├── consumerCare.rule.js
│   │   │   └── index.js
│   │   │
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── config/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── uploads/
│   └── package.json
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── .env
├── .gitignore
└── README.md

5. Database Design

Minimum tables:

users
products
inspections
product_images
declarations
violations
legal_rules
reports
audit_logs

A typical relationship flow is:

User
 └── Inspections
      ├── Product
      ├── Product Images
      ├── Declarations
      ├── Violations
      └── Report

6. Requirements

Install these before running the project:

Node.js

npm

Git

MySQL or PostgreSQL

A Google account for Gemini API access

Optional:

Android Studio (only if you want an Android APK)

Java/JDK + Android SDK for Android builds

Check Node/npm:

node -v
npm -v

7. Clone the Project

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd metro-check

Then install dependencies.

Frontend

cd client
npm install

Backend

Open another terminal:

cd server
npm install

8. Environment Variables

Create a .env file inside:

server/.env

Example:

PORT=5000

DATABASE_URL=your_database_connection_string

JWT_SECRET=replace_with_a_long_random_secret

GEMINI_API_KEY=replace_with_your_gemini_api_key

UPLOAD_DIR=uploads

If your backend uses separate database variables instead of DATABASE_URL, use whatever names are implemented in server/src/config/.

Very important

Do NOT put your Gemini secret in the React client.

Do not create:

VITE_GEMINI_API_KEY=...

for the real secret key.

Vite exposes variables prefixed with VITE_ to browser-side code, so sensitive API keys should stay server-side.

Official Vite documentation:
https://vite.dev/guide/env-and-mode

9. How to Generate a Gemini API Key

Recommended method

Open Google AI Studio:
https://aistudio.google.com/

Sign in with your Google account.

Open the API key page:
https://aistudio.google.com/apikey

Create/select a Google Cloud project when prompted.

Click Create API key.

Copy the generated key.

Put it in:

GEMINI_API_KEY=YOUR_KEY_HERE

inside:

server/.env

Restart the backend.

Google's current documentation:
https://ai.google.dev/gemini-api/docs/api-key

Security rule

Never:

commit the key to GitHub

paste the key into React frontend code

use VITE_GEMINI_API_KEY for the backend secret

put the key inside screenshots/demo videos

send the key to another person

Add .env to .gitignore:

.env
.env.*
!.env.example
node_modules/
uploads/
dist/

Create a safe template:

server/.env.example

with:

PORT=5000
DATABASE_URL=
JWT_SECRET=
GEMINI_API_KEY=
UPLOAD_DIR=uploads

10. Gemini SDK

For a Node.js backend, use Google's current JavaScript SDK:

cd server
npm install @google/genai

Official documentation:
https://ai.google.dev/gemini-api/docs/get-started

Basic server-side initialization:

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

The exact model and request format should be selected according to the Gemini API version/model configured by the project.

11. Backend AI Architecture

Recommended service separation:

ai.service.js
      ↓
Gemini Vision
      ↓
Structured JSON
      ↓
ocr.service.js / fallback if required
      ↓
declarations
      ↓
compliance.service.js
      ↓
rules/
      ↓
violations + score + status

Example conceptual output from AI/OCR:

{
  "productName": "Example Biscuits",
  "manufacturer": "ABC Foods Pvt Ltd",
  "netQuantity": "100 g",
  "mrp": "₹40",
  "consumerCare": "1800-000-000",
  "dateDeclaration": null,
  "confidence": {
    "productName": 0.96,
    "mrp": 0.94,
    "dateDeclaration": 0.52
  }
}

This JSON is only extracted data.

The rule engine should decide:

PASS
FAIL
REVIEW

12. Compliance Status Logic

Metro-Check uses three statuses.

COMPLIANT

All evaluated rules passed with sufficient confidence.

NON-COMPLIANT

One or more rules failed with sufficient evidence/confidence.

NEEDS REVIEW

Use this when:

OCR confidence is low

text is unreadable

image quality is insufficient

a declaration cannot be reliably extracted

physical measurement would be required

the evidence is ambiguous

Example

OCR confidence = 52%

Result:
NEEDS REVIEW

Reason:
The declaration could not be reliably read.

The system should not invent a violation just because the model is uncertain.

13. Frontend Routes

Public

/
 /login
 /signup
 /demo
 /about

Operator

/dashboard

/inspections
/inspections/new
/inspections/:id
/inspections/:id/result

/products
/products/:id

/violations

/reports
/reports/:id

/analytics

/profile
/settings

14. Authentication API

Minimum endpoints:

POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

JWT should be issued after successful login.

Password storage must use a password hashing algorithm such as bcrypt. Never store plain-text passwords.

15. Inspection API

Recommended API structure:

POST /api/inspections
POST /api/inspections/:id/images
POST /api/inspections/:id/analyze
GET  /api/inspections/:id
GET  /api/inspections
GET  /api/inspections/:id/result

For the upload endpoint, Multer can handle incoming image files.

16. Analysis Flow

When the operator presses Analyze Product:

1. Verify authenticated user
2. Load inspection
3. Load uploaded images
4. Check image quality
5. Send relevant images to Gemini/OCR
6. Extract structured declarations
7. Save declarations
8. Run legal/compliance rules
9. Create violations
10. Calculate compliance score
11. Decide:
       COMPLIANT
       NON-COMPLIANT
       NEEDS REVIEW
12. Save result
13. Display evidence
14. Allow report generation

Important:

Upload Image
     ↓
No AI call yet

Click "Analyze Product"
     ↓
Start AI processing

This keeps the user experience predictable and avoids unnecessary API calls.

17. Camera + Upload

For mobile browser camera capture, the frontend can use:

<input
  type="file"
  accept="image/*"
  capture="environment"
/>

Support both:

Camera
Upload

Suggested image categories:

Front
Back
Side
Top
Bottom

18. Evidence / Bounding Box

A strong demo feature is showing exactly where the detected declaration came from.

Example:

Violation #01

MRP Declaration

Status:
NEEDS REVIEW

Confidence:
94%

Detected Value:
₹199

Rule:
LM-MRP-001

On the image:

┌─────────────────────────────┐
│                             │
│        PRODUCT IMAGE        │
│                             │
│      ┌──────────────┐       │
│      │  MRP AREA    │       │
│      └──────────────┘       │
│                             │
└─────────────────────────────┘

For a production implementation, store normalized coordinates such as:

{
  "x": 0.32,
  "y": 0.41,
  "width": 0.28,
  "height": 0.12
}

and convert them to screen coordinates in the frontend.

19. Report Generation

After the result is created:

[ Save Inspection ]
[ Generate PDF Report ]

PDF should contain:

METRO-CHECK
Legal Metrology Inspection Report

Inspection ID
Operator
Date

Product Details

Declaration Analysis

Violations

Evidence Images

Compliance Score

Final Status

Recommendations

PDF generation should happen in the backend using PDFKit.

20. Local Development

Start Backend

cd server
npm run dev

Example backend:

http://localhost:5000

Start Frontend

Open another terminal:

cd client
npm run dev

Example frontend:

http://localhost:5173

The exact ports may differ depending on your package.json and Vite/Express configuration.

21. Axios Configuration

Frontend should call the backend through Axios.

Example:

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

export default api;

For production, replace the local URL with your deployed backend URL.

Example:

https://api.your-domain.com/api

Do not hard-code production secrets in frontend code.

22. Test the Project in This Order

Do not start with the full AI workflow.

Use this order:

Test 1 — Backend

Check:

GET /health

Expected:

Backend is running

Test 2 — Database

Verify:

users
products
inspections
product_images
declarations
violations
legal_rules
reports
audit_logs

Test 3 — Authentication

Verify:

Signup
Login
JWT
GET /api/auth/me

Test 4 — Image Upload

Upload:

Front
Back
Side

Verify that the files are stored and linked to the inspection.

Test 5 — AI Extraction

Send one test product image.

Verify that the response is structured JSON.

Test 6 — Rule Engine

Use fixed test JSON.

Example:

{
  "productName": "Test Product",
  "manufacturer": "ABC Pvt Ltd",
  "netQuantity": "500 g",
  "mrp": "₹100",
  "consumerCare": "1800-123-456",
  "dateDeclaration": "01/08/2026"
}

Expected:

PASS / COMPLIANT

Then remove one declaration or make it unreadable.

Expected:

FAIL

or:

REVIEW

depending on the rule and confidence.

Test 7 — PDF

Generate a report and confirm:

Inspection ID
Product
Declarations
Violations
Score
Status

are present.

23. Demo Test Cases

Case A — Clearly compliant

Image has:

Product Name ✓
Manufacturer ✓
Net Quantity ✓
MRP ✓
Consumer Care ✓
Required date declaration ✓

Expected:

COMPLIANT

Case B — Missing declaration

Image has:

Product Name ✓
Manufacturer ✓
Net Quantity ✓
MRP ✕
Consumer Care ✓

Expected:

NON-COMPLIANT

provided the configured rule requires that declaration and evidence confidence is sufficient.

Case C — Blurry image

Image text cannot be reliably read.

Expected:

NEEDS REVIEW

Do not automatically mark it as a violation.

Case D — Conflicting/ambiguous evidence

Front image suggests one MRP, another image is unclear.

Expected:

NEEDS REVIEW

The system should surface the ambiguity instead of silently guessing.

24. Dashboard

Recommended cards:

Inspected
Compliant
Violations
Review

Example:

Inspected:     128
Compliant:      74
Violations:     39
Review:         15

Recent inspections:

Product       Date       Score    Status
------------------------------------------------
ABC Biscuits  23 Aug     92%      Compliant
XYZ Oil       23 Aug     64%      Violation
Milk Pack     22 Aug     81%      Review

These are demo values only. Replace them with database-driven values.

25. Landing Page

Hero:

AI-Powered Legal Metrology Compliance Inspection

Subtitle:

Scan packaged commodity labels and automatically identify
missing declarations, potential violations and compliance issues.

Buttons:

[ Start Inspection ]
[ Login ]
[ Try Demo ]

Sections:

Hero
↓
How It Works
↓
Key Capabilities
↓
Compliance Detection
↓
Dashboard Preview
↓
Reports & Evidence
↓
FAQ
↓
Footer

Avoid claims such as:

100% legally accurate
AI guarantees legal compliance

Use:

AI-assisted compliance screening based on configured
Legal Metrology rules.

26. Public Demo vs Operator

Public Demo

Landing
  ↓
Try Demo
  ↓
Upload / Camera
  ↓
AI Analysis
  ↓
Screening Result

No long-term inspection history is required for the public flow.

Operator

Login
  ↓
Dashboard
  ↓
Inspection
  ↓
Analysis
  ↓
Result
  ↓
Save
  ↓
PDF
  ↓
History

Only authenticated operators should access saved inspection history and reports.

27. Where Is the APK?

Important clarification

The project structure you supplied is a React + Vite web application. It does not contain an Android APK by itself.

So, if your GitHub/project folder currently looks like:

metro-check/
├── client/
├── server/
└── database/

there is no APK to find inside it unless an Android build has already been created separately.

A React/Vite application normally runs as a web application.

28. How to Make an Android APK

The practical approach is to package the existing web frontend with Capacitor.

Step 1 — Build frontend

cd client
npm install
npm run build

This creates the production web build, normally in:

client/dist/

Step 2 — Install Capacitor

From the frontend directory:

npm install @capacitor/core @capacitor/cli
npx cap init

Set the application name, for example:

App Name: Metro-Check
App ID: com.metrocheck.app

Step 3 — Add Android

npm install @capacitor/android
npx cap add android

Step 4 — Build and sync

After every frontend build:

npm run build
npx cap sync android

Step 5 — Open Android Studio

npx cap open android

Then use Android Studio to build the Android application.

Typical APK location

For a standard Android Gradle project, the debug APK is typically produced under:

android/app/build/outputs/apk/debug/app-debug.apk

A release APK/AAB is normally produced under a release output directory after the corresponding release build.

If your project does not yet contain an android/ directory, the APK has not been generated through Capacitor yet.

29. Important: The APK Still Needs a Backend

Do not make the mistake of thinking that putting the React app into an APK makes the whole system offline.

Your architecture contains:

Android APK
     ↓
Backend API
     ↓
Gemini API
     ↓
Database

Therefore the APK normally needs internet access to communicate with:

your Node.js/Express backend

Gemini API through your backend

your database through your backend

Do not put the Gemini secret directly inside the APK.

The safer architecture is:

Android App
    ↓
HTTPS
    ↓
Node/Express Backend
    ↓
GEMINI_API_KEY
    ↓
Gemini API

30. Production Deployment

Recommended architecture:

                ┌──────────────────────┐
                │   React / Vite       │
                │   Web / Android      │
                └──────────┬───────────┘
                           │ HTTPS
                           ▼
                ┌──────────────────────┐
                │ Node + Express API   │
                ├──────────────────────┤
                │ Auth                 │
                │ Upload               │
                │ AI/OCR               │
                │ Rule Engine          │
                │ Reports              │
                └───────┬───────┬──────┘
                        │       │
                        ▼       ▼
                   Database   Gemini API

Possible hosting choices:

Frontend

Vercel

Netlify

Cloudflare Pages

Static hosting of your choice

Backend

Render

Railway

Fly.io

VPS/cloud server

Google Cloud Run

Database

Neon / PostgreSQL provider

Supabase

Railway PostgreSQL

Managed MySQL/PostgreSQL

Your own cloud database

Choose services based on current pricing, limits, and project requirements.

31. Production Environment Variables

Example backend production environment:

PORT=5000
DATABASE_URL=YOUR_PRODUCTION_DATABASE_URL
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
GEMINI_API_KEY=YOUR_SECRET_GEMINI_KEY
UPLOAD_DIR=uploads

Frontend should only receive non-secret configuration, such as:

VITE_API_BASE_URL=https://api.example.com

Remember:

VITE_*  → browser-visible
GEMINI_API_KEY → server-only
DATABASE_PASSWORD → server-only
JWT_SECRET → server-only

32. GitHub Safety Checklist

Before pushing to GitHub:

[ ] .env is ignored
[ ] Gemini API key is not committed
[ ] Database password is not committed
[ ] JWT secret is not committed
[ ] uploads/ is ignored if files are local-only
[ ] node_modules/ is ignored
[ ] build artifacts are ignored where appropriate

Check:

git status

Never push a real secret just because the repository is private.

33. Suggested .gitignore

node_modules/
.env
.env.local
.env.*.local

dist/
build/

uploads/
*.log

.DS_Store

android/.gradle/
android/local.properties/
android/**/build/

34. Suggested API Contract

Create inspection

POST /api/inspections
Authorization: Bearer <JWT>
Content-Type: application/json

Response:

{
  "id": "INS001",
  "status": "CREATED"
}

Upload image

POST /api/inspections/INS001/images
Authorization: Bearer <JWT>
Content-Type: multipart/form-data

Analyze

POST /api/inspections/INS001/analyze
Authorization: Bearer <JWT>

Response concept:

{
  "score": 78,
  "status": "NEEDS_REVIEW",
  "declarations": [],
  "violations": []
}

35. Suggested Compliance Rule Structure

Each rule should be independent.

rules/
├── mrp.rule.js
├── quantity.rule.js
├── manufacturer.rule.js
├── consumerCare.rule.js
└── index.js

Conceptually:

export function validateMrp(declaration) {
  // Return PASS / FAIL / REVIEW
}

Then:

const results = [
  validateMrp(data),
  validateQuantity(data),
  validateManufacturer(data),
  validateConsumerCare(data)
];

This makes the rule engine easier to test and extend.

36. Debugging Checklist

Frontend cannot reach backend

Check:

Backend is running
Correct base URL
CORS configuration
Correct port

Gemini request fails

Check:

GEMINI_API_KEY exists
Backend was restarted after editing .env
Gemini API access/model configuration
Request payload
API usage/limits

Database error

Check:

Database is running
DATABASE_URL is correct
Schema was applied
Credentials are correct

Uploaded files not found

Check:

uploads/ exists
Multer destination
File permissions
Stored file path
Database image record

Android app works but AI does not

Check:

APK is calling the deployed HTTPS backend
NOT localhost
Backend is reachable from the phone
CORS/auth configuration
Gemini key exists on the backend

Very important Android mistake

Inside an Android APK:

http://localhost:5000

does not normally mean your laptop's backend.

For a physical phone, use your deployed backend URL, for example:

https://api.example.com

37. Judge Demo Script

For an SIH-style demonstration:

1. Open Landing Page
2. Explain the problem
3. Click Try Demo
4. Upload/capture packaged product
5. Show AI analysis progress
6. Show extracted declarations
7. Show compliance result
8. Open evidence/violation
9. Login as Operator
10. Open Dashboard
11. Create inspection
12. Save inspection
13. Generate PDF
14. Open Inspection History

The strongest story is:

Image
 ↓
AI/OCR extraction
 ↓
Structured data
 ↓
Deterministic rule engine
 ↓
Explainable result
 ↓
Evidence
 ↓
Report

38. Final Architecture

                           LANDING
                              │
                 ┌────────────┴────────────┐
                 │                         │
               LOGIN                    TRY DEMO
                 │                         │
                 ▼                         ▼
            OPERATOR                  PUBLIC SCAN
            DASHBOARD                    │
                 │                       │
                 ▼                       │
          NEW INSPECTION                 │
                 │                       │
                 └──────────┬────────────┘
                            ▼
                      CAMERA / UPLOAD
                            │
                            ▼
                        AI + OCR
                            │
                            ▼
                    EXTRACTED DATA
                            │
                            ▼
                      RULE ENGINE
                            │
                  ┌─────────┼─────────┐
                  ▼         ▼         ▼
              COMPLIANT    FAIL     REVIEW
                  │         │         │
                  └─────────┼─────────┘
                            ▼
                     RESULT + EVIDENCE
                            │
                            ▼
                    SAVE INSPECTION
                       │          │
                       ▼          ▼
                    HISTORY     PDF

39. Quick Start

# 1. Clone
git clone <YOUR_REPOSITORY_URL>
cd metro-check

# 2. Frontend
cd client
npm install

# 3. Backend
cd ../server
npm install

# 4. Create server/.env
# Add DATABASE_URL, JWT_SECRET, GEMINI_API_KEY

# 5. Start backend
npm run dev

# 6. Start frontend in another terminal
cd ../client
npm run dev

Then open the Vite URL shown in the terminal.

40. Important Notes

Keep Gemini credentials on the server.

Keep the rule engine separate from the AI extraction layer.

Do not treat low-confidence OCR as a definite violation.

Keep public demo data separate from authenticated inspection history.

Do not claim 100% legal accuracy.

Use HTTPS in production.

Replace demo dashboard numbers with real database values.

Generate the APK only after the web application works correctly.

Test the deployed backend from a real phone before creating the final APK.

Official References

Gemini API key documentation:
https://ai.google.dev/gemini-api/docs/api-key

Gemini API getting started:
https://ai.google.dev/gemini-api/docs/get-started

Vite environment variables:
https://vite.dev/guide/env-and-mode

Google AI Studio:
https://aistudio.google.com/

Google AI Studio API keys:
https://aistudio.google.com/apikey

Project Status

Metro-Check is intended to be built as:

React/Vite Web Application
        +
Node/Express Backend
        +
MySQL/PostgreSQL
        +
Gemini Vision + OCR
        +
Deterministic Compliance Rule Engine
        +
PDF Reports

For Android distribution:

React/Vite
   ↓
Capacitor
   ↓
Android Studio
   ↓
APK / AAB