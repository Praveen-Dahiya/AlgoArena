FROM gcc:latest

WORKDIR /app

RUN apt-get update && apt-get install -y \
    time \
    procps \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m coderunner
USER coderunner


CMD ["tail", "-f", "/dev/null"]