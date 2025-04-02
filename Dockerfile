FROM cypress/included:14.2.0

RUN apt-get update && \
    apt-get install -y gnupg curl software-properties-common default-jre && \
    curl -s https://dl.k6.io/key.gpg | gpg --dearmor -o /etc/apt/trusted.gpg.d/k6.gpg && \
    echo "deb https://dl.k6.io/deb stable main" | tee /etc/apt/sources.list.d/k6.list && \
    apt-get update && \
    apt-get install -y k6

WORKDIR /app
COPY . .

WORKDIR /app/api-test
RUN yarn install

WORKDIR /app
