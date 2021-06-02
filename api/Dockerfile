#########################################################################
################################ PLANNER ################################
#########################################################################

FROM rust:1.52.1-buster as planner

WORKDIR /app

RUN cargo install cargo-chef --version 0.1.20

COPY . .

RUN cargo chef prepare --recipe-path recipe.json

#########################################################################
################################ CACHER #################################
#########################################################################

FROM rust:1.52.1-buster as cacher-daemon

WORKDIR /app

RUN cargo install cargo-chef --version 0.1.20
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json

#########################################################################
################################ BUILDER ################################
#########################################################################

FROM rust:1.52.1-buster as builder

WORKDIR /app

COPY . .

COPY --from=cacher-daemon /app/target target
COPY --from=cacher-daemon /usr/local/cargo /usr/local/cargo

RUN cargo build --release

#########################################################################
################################ RELEASE ################################
#########################################################################

FROM debian:buster-slim

RUN mkdir -p /app \
    && useradd -ms /bin/bash cursorshare \
    && chown -R cursorshare:cursorshare /app \
    && apt-get update \
    && apt-get install -y libssl-dev ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./static /app/static/

COPY --from=builder /app/target/release/cursor-share-rs /app/

CMD [ "/app/cursor-share-rs" ]

