# BrainTumorDetectionAPP

-cd server

-download model
- https://drive.google.com/file/d/1sImhn9_XCP2pm9wARWileukwdPpSHH5B/view?usp=sharing
- add model.h5

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

cd app

npm run dev
