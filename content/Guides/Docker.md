---
title: Docker
tags: [docker, containers, devops, cheatsheet]
aliases: [Docker Cheatsheet, Docker Guide, Docker Commands]
status: evergreen
---

## ⭐ Introduction

Docker is a platform for building, packaging, and running applications inside "containers," lightweight, isolated environments that bundle an application together with every single dependency it genuinely needs to run, all the way down to the exact versions of system libraries involved. This solves a problem nearly every developer has run into at some point, an application that works perfectly on one machine but mysteriously breaks on another, simply because the two machines happened to have slightly different software installed. A Docker container carries its own complete, self contained environment with it, so it behaves identically regardless of where it actually runs, whether that is your own laptop, a colleague's machine, or a server sitting somewhere in the cloud.

  

It helps to understand exactly how a container differs from a full virtual machine, since the two are often confused. A virtual machine emulates an entire separate computer, including its own full, independent operating system kernel, which makes it heavy and comparatively slow to start. A container, by contrast, shares the host machine's own existing kernel, and only isolates the application's own files, processes, and network view from everything else running on that same machine. This is exactly why containers start in a genuine fraction of a second, rather than the many seconds or even minutes a full virtual machine typically needs to boot.

## 🧠 Core concepts

| Term | Meaning |
|---|---|
| Image | Read only template/snapshot used to create containers |
| Container | Running (or stopped) instance of an image |
| Dockerfile | Text file with instructions to build an image |
| Registry | Where images are stored (Docker Hub, private registries) |
| Volume | Persistent storage managed by Docker |
| Compose | Tool to define/run multi container apps via YAML |

> [!tip] Container vs VM
> Container shares the host kernel, starts in ms. VM emulates a full OS, starts in seconds/minutes.

## 📦 Setup

```bash
docker --version       # installed version
docker info               # daemon + system info
docker version               # client + server version
```

## 🖼️ Images

```bash
docker pull ubuntu               # pull latest tag
docker pull ubuntu:22.04            # pull specific tag
docker images                          # list local images
docker image ls                           # same as above

docker rmi ubuntu                    # remove image
docker rmi -f ubuntu                    # force remove
docker rmi $(docker images -q)             # remove ALL images
docker image prune                            # remove dangling (untagged) images
docker image prune -a                            # remove all unused images

docker build -t myapp:1.0 .                    # build from Dockerfile in current dir
docker build -t myapp:1.0 -f Dockerfile.prod .    # use specific Dockerfile
docker build --no-cache -t myapp:1.0 .               # build ignoring cache

docker tag myapp:1.0 amit/myapp:1.0     # add a new tag
docker login                               # auth with registry
docker push amit/myapp:1.0                    # push image
docker pull amit/myapp:1.0                       # pull image

docker inspect myapp:1.0    # full metadata (JSON)
docker history myapp:1.0       # layer breakdown + sizes
```

> [!tip] Pin versions
> Avoid `:latest` in real builds. Use explicit tags (`node:20.11.1`) for reproducibility.

## 📦 Containers

```bash
docker run ubuntu                    # create + run, exits after
docker run -it ubuntu bash              # interactive shell
docker run -d nginx                        # detached (background)
docker run --name web -d nginx                # named container
docker run -p 8080:80 nginx                      # host:container port mapping
docker run -v mydata:/app/data nginx                # mount named volume
docker run -e "APP_ENV=prod" myapp                     # env variable
docker run --rm myapp                                     # auto remove on exit
docker run -w /app myapp                                     # set working dir

docker ps            # running containers
docker ps -a             # all containers (incl. stopped)
docker ps -q                # container IDs only

docker stop web          # graceful stop (SIGTERM)
docker start web             # start existing container
docker restart web              # stop + start
docker kill web                    # force stop (no grace period)

docker rm web                # remove stopped container
docker rm -f web                 # force stop + remove
docker rm $(docker ps -aq)          # remove ALL containers

docker exec -it web bash    # shell into running container
docker exec web ls /app        # run one-off command

docker logs web           # view logs
docker logs -f web           # follow logs live
docker top web                   # processes inside container
docker stats                        # live resource usage (all containers)
docker inspect web                     # full metadata (JSON)

docker cp file.txt web:/app/       # host to container
docker cp web:/app/log.txt ./          # container to host

docker pause web        # freeze processes
docker unpause web          # resume
docker rename old new           # rename container
docker attach web                  # attach to main process (risky, see below)
```

> [!warning] stop vs kill
> `stop` = SIGTERM, graceful, then force-kills after timeout. `kill` = immediate, no cleanup. Default to `stop`.

> [!warning] ps shows nothing?
> Plain `docker ps` only shows running containers. Add `-a` to see stopped/exited ones too.

> [!tip] exec vs attach
> Use `exec -it ... bash` for debugging (separate shell, safe to exit). `attach` connects to the main process itself; exiting it can kill the container.

## 📝 Dockerfile instructions

```dockerfile
FROM node:20-alpine        # base image, always first
WORKDIR /app                  # sets cwd for everything after

COPY package*.json ./            # copy deps first (cache layer)
RUN npm install                      # install deps
COPY . .                                 # copy rest of app (changes often)

ENV NODE_ENV=production                     # persists into runtime
ARG APP_VERSION=1.0                            # build time only, not in final container
EXPOSE 3000                                       # documentation only, doesn't publish port
USER node                                            # drop to non root user
LABEL maintainer="amit@example.com"                     # metadata

CMD ["node", "server.js"]           # default command (overridable at runtime)
ENTRYPOINT ["node", "server.js"]       # fixed command (hard to override)
```

| Instruction | Purpose |
|---|---|
| `FROM` | Base image (required, first line) |
| `WORKDIR` | Set working directory |
| `COPY` | Copy local files into image |
| `ADD` | Like COPY, but also handles URLs + auto extracts archives |
| `RUN` | Execute command at build time (bakes into layer) |
| `CMD` | Default runtime command, overridable |
| `ENTRYPOINT` | Fixed runtime command, hard to override |
| `ENV` | Env variable, persists to runtime |
| `ARG` | Build time only variable |
| `EXPOSE` | Documents a port (does NOT publish it) |
| `VOLUME` | Declares a mount point |
| `USER` | Sets the user to run as |
| `LABEL` | Adds metadata |
| `HEALTHCHECK` | Defines a container health check |

> [!tip] Layer caching order
> Copy dependency manifests + install deps BEFORE copying full source. Code changes shouldn't invalidate the install layer.

> [!tip] COPY vs ADD
> Default to `COPY`. Only use `ADD` for its two extra tricks: remote URLs and auto-extracting archives.

> [!tip] ENV vs ARG
> `ARG` = build time only, gone at runtime. `ENV` = persists into the running container.

```bash
docker build --build-arg APP_VERSION=2.0 -t myapp .
```

### Multi-stage build

```dockerfile
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```
> [!tip] Keeps final image lean: build tools stay in stage 1, only the built output moves to stage 2.

### .dockerignore

```
node_modules
.git
.env
*.log
Dockerfile
```
> [!tip] Same idea as `.gitignore`. Speeds up builds, keeps secrets out of the build context.

## 🌐 Networking

```bash
docker network ls                    # list networks
docker network create mynet             # create custom network
docker network inspect mynet               # details
docker network rm mynet                       # remove
docker run --network mynet myapp                 # run on specific network
docker network connect mynet web                    # attach running container to network
```

| Driver | Behavior |
|---|---|
| `bridge` | Default, isolated network per host |
| `host` | Shares host's network stack directly |
| `none` | No networking at all |

> [!tip] Custom networks give free DNS
> Containers on the same custom (non-default) network can reach each other by container name. Default bridge network doesn't support this.

## 💾 Volumes and bind mounts

```bash
docker volume create mydata      # create named volume
docker volume ls                    # list volumes
docker volume inspect mydata           # details
docker volume rm mydata                   # remove
docker volume prune                          # remove unused volumes

docker run -v mydata:/app/data myapp                    # named volume
docker run -v /home/amit/project:/app myapp                 # bind mount (host path)
docker run -v $(pwd):/app myapp                                 # bind mount current dir

docker run --mount source=mydata,target=/app/data myapp
docker run --mount type=bind,source=/home/amit/project,target=/app myapp
```

| Type | Use for |
|---|---|
| Named volume | Docker-managed persistent data (DB files, etc.) |
| Bind mount | Live sync with a specific host folder (local dev) |

## 🧩 Docker Compose

```yaml
version: "3.9"

services:
  web:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - ./src:/app/src

  db:
    image: postgres:16
    environment:
      - POSTGRES_PASSWORD=secret
    volumes:
      - dbdata:/var/lib/postgresql/data

volumes:
  dbdata:
```

```bash
docker compose up            # build + start all services
docker compose up -d            # detached
docker compose down                # stop + remove containers/network
docker compose down -v                # ALSO removes named volumes (destroys data)
docker compose build                     # build/rebuild images
docker compose ps                           # service status
docker compose logs                            # all logs
docker compose logs -f web                         # follow one service's logs
docker compose exec web bash                          # shell into a service
docker compose restart web                                # restart one service
docker compose stop                                          # stop without removing
docker compose up -d --scale web=3                              # run 3 instances of web
```

> [!warning] `down -v` deletes volume data permanently. Think before running it.

> [!note] `docker-compose` (hyphen, standalone) is the old tool. `docker compose` (space, plugin) is current.

## 🩺 Healthcheck

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```
Shows as `(healthy)` / `(unhealthy)` in `docker ps`.

## 🔁 Restart policies

```bash
docker run --restart no myapp                  # default, never auto-restart
docker run --restart on-failure myapp             # restart only on error exit
docker run --restart always myapp                    # always restart, even after manual stop + daemon restart
docker run --restart unless-stopped myapp               # like always, but respects a manual stop
```
> [!tip] `unless-stopped` is usually the right default for long-running services.

## 🧹 Cleanup

```bash
docker system df                           # disk usage summary
docker system prune                           # remove stopped containers, unused networks, dangling images
docker system prune -a                           # ALSO remove all unused images
docker system prune -a --volumes                    # ALSO remove unused volumes
```
> [!warning] `-a --volumes` is aggressive. Check `docker system df` first.

## 🏷️ Flag quick reference

| Flag | Meaning |
|---|---|
| `-d` | Detached (background) |
| `-it` | Interactive + terminal |
| `--name` | Container name |
| `-p host:container` | Port mapping |
| `-v` / `--mount` | Volume or bind mount |
| `-e KEY=VALUE` | Env variable |
| `--rm` | Auto remove on exit |
| `--network` | Attach to network |
| `--restart` | Restart policy |
| `-w` | Working directory |

## 🔍 Troubleshooting

| Symptom | Fix |
|---|---|
| Container exits immediately | Check `docker logs <container>`, main process likely crashed/finished |
| "Cannot connect to Docker daemon" | Daemon not running, or user lacks permission (`sudo usermod -aG docker $USER`, relog) |
| Code changes not showing up | If using `COPY` (no bind mount), rebuild image. If bind mount, check the mounted path |
| Build failed partway | `docker run -it <last-good-layer-id> bash` to inspect state before the failure |

## ⚡ Quick setup example

A minimal end to end flow: build an image, run it, check it, tear it down.

```bash
# 1. Create a bare minimum Dockerfile
cat > Dockerfile << 'EOF'
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
EOF

# 2. Build the image
docker build -t myapp:1.0 .

# 3. Run it, mapped to host port 8080, detached, auto-restart, auto-clean
docker run -d --name myapp -p 8080:3000 --restart unless-stopped myapp:1.0

# 4. Verify it's up and check logs
docker ps
docker logs -f myapp

# 5. Tear down when done
docker stop myapp && docker rm myapp
```

> [!tip] One-liner install (Linux)
> ```bash
> curl -fsSL https://get.docker.com | sudo sh
> sudo usermod -aG docker $USER   # then log out/in
> ```

## 🔗 Scope note

Covers core day to day Docker: images, containers, Dockerfile, networking, volumes, Compose. Orchestration at scale (Kubernetes, Docker Swarm) is a separate topic, worth its own note later.
