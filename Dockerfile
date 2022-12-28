FROM node as builder
WORKDIR /app
COPY . .
RUN \
  yarn install --frozen-lockfile && \
  yarn build

FROM alpine as runner
ENV \
  # APP
  NODE_ENV="development" \
  PORT="3000" \
  # JWT
  JWT_SECRET="secret" \
  JWT_AUGORITHM="HS256" \
  JWT_AUDIENCE="audience" \
  JWT_ISSUER="issuer" \
  JWT_ACCESS_TTL=600 \
  JWT_REFRESH_TTL=1209600 \
  # DB
  DB_LIMIT=50 \
  DB_POSTGRES="postgresql://postgres:postgres@localhost:5432/inovia"
RUN apk add --update nodejs
WORKDIR /app
COPY --from=builder /app/dist/ /app/
EXPOSE ${PORT}
CMD node index.js