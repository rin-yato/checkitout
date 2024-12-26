FROM oven/bun:alpine AS base

FROM base AS builder

WORKDIR /app

RUN mkdir -p tmp/initial
COPY . tmp/initial
RUN rm -rf tmp/initial/apps/web
RUN rm -rf tmp/initial/apps/docs

RUN cd tmp/initial && bun install

RUN mkdir -p tmp/production

RUN cp -r tmp/initial/. tmp/production

# remove all node_modules folder including nested ones
RUN find tmp/production -name "node_modules" -type d -prune -exec rm -rf '{}' + || true 

RUN cd tmp/production && bun install --production


# ? -------------------------
FROM base AS runner

RUN apk update && apk add curl
RUN apk add --update nodejs npm

WORKDIR /app

COPY --from=builder /app/tmp/production .
RUN bun add sharp --trusted --production 

ENV NODE_ENV=production

EXPOSE 3050

CMD ["bun", "./apps/api/src/index.ts"]

