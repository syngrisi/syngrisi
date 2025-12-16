#!/bin/bash

# Build the Docker image
docker build -t syngrisi-tests .

# Run the container in interactive mode
docker run -it --rm \
    -v $(pwd):/app/tests \
    syngrisi-tests bash

# If you want to enter the container interactively, uncomment the following line:
# docker run -it --rm -v $(pwd):/app/tests syngrisi-tests bash
