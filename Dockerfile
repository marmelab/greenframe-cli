# syntax=docker/dockerfile:1
FROM node:16 as base

RUN apt update && apt install -y \
        apt-transport-https \
        bash \
        ca-certificates \
        curl \
        git \
        gnupg2 \
        lsb-release \
        python3 \
        software-properties-common

# Install docker
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian buster stable"
RUN apt update && apt install -y \
        containerd.io \
        docker-ce \
        docker-ce-cli \
        docker-compose-plugin \
    && rm -rf /var/lib/apt/lists/*

# Install kubectl cli
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl

# Install greenframe cli
RUN cd /root \
        && curl https://assets.greenframe.io/install.sh | bash
ENV PATH $PATH:/root/.local/bin

RUN mkdir /app
RUN git config --global --add safe.directory /app
WORKDIR /app

ENTRYPOINT ["greenframe"]
CMD ["--version"]