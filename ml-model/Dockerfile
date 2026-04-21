# Use Python 3.11 slim for a smaller image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install system dependencies if needed (e.g., for scikit-learn or pandas)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5001

# Command to run the application
CMD ["python", "model.py"]
