FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt gunicorn

COPY . .

EXPOSE 8000

CMD ["gunicorn", "sweproject.wsgi:application", "--bind", "0.0.0.0:8000"]