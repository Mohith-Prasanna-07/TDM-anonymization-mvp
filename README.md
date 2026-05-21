# TDM Data Anonymization MVP

This project is a demo-ready MVP for a Test Data Management data anonymization platform.

## Current MVP Architecture

React frontend  
FastAPI backend  
Local Pandas + Faker anonymization engine  
CSV upload  
Dynamic masking rules  
Before/after preview  
Audit summary  
Job history  
Masked CSV download  

## Features

- Upload CSV file
- Configure masking rules per column
- Run anonymization job
- Preview original and masked data
- View audit summary
- Track recent job history
- Download masked CSV output

## Tech Stack

Frontend:
- React
- Vite
- Tailwind CSS
- Axios
- Lucide React
- Framer Motion

Backend:
- FastAPI
- Pandas
- Faker
- Uvicorn

## Run Backend

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000

- Backend runs at: http://127.0.0.1:8000

## Run Frontend

cd frontend
npm run dev

-Front end runs at: http://localhost:5173/



## Future Enterprise Architecture

React frontend  
FastAPI orchestration layer  
Databricks Jobs API  
PySpark distributed anonymization engine  
Delta tables / Unity Catalog  
Audit and lineage tracking  

