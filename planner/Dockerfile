FROM ubuntu:22.04

# Install dependencies with newer versions
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
    cmake \
    g++-11 \ 
    # g++-11-multilib \
    mercurial \
    make \
    python3 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set GCC 11 as default
RUN update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-11 110 && \
    update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-11 110

# Download Fast Downward
RUN git clone https://github.com/aibasel/downward.git /fast-downward

# Build the planner with C++20 support
WORKDIR /fast-downward
RUN python3 ./build.py release -j4 CMAKE_ARGS="-DCMAKE_CXX_STANDARD=20"

# Set up entry point
ENTRYPOINT ["./fast-downward.py"]
CMD ["--help"]