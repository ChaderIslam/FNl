FROM postgres:16

# Accept build args
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB

# Set runtime envs (Docker uses these to init)
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}

# Copy seed SQL
COPY init.sql /docker-entrypoint-initdb.d/
