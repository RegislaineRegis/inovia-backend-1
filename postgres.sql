CREATE TABLE "user" (
  "id" BIGSERIAL NOT NULL PRIMARY KEY,
  "timestamp" TIMESTAMP(3) NOT NULL,
  "created" TIMESTAMP(3) NOT NULL,
  "deleted" TIMESTAMP(3) NULL,
  "email" VARCHAR(100) NOT NULL UNIQUE,
  "password" TEXT NOT NULL
);

CREATE TABLE "customer" (
  "id" BIGSERIAL NOT NULL PRIMARY KEY,
  "timestamp" TIMESTAMP(3) NOT NULL,
  "created" TIMESTAMP(3) NOT NULL,
  "deleted" TIMESTAMP(3) NULL,
  "user_id" BIGINT NOT NULL REFERENCES "user" ("id"),
  "name" VARCHAR(100) NOT NULL,
  "address" VARCHAR(200) NULL,
  "phone" VARCHAR(20) NULL,
  "email" VARCHAR(100) NULL,
  "birthDate" DATE NULL,
  "photoURL" TEXT NULL
);

CREATE TABLE "sale" (
  "id" BIGSERIAL NOT NULL PRIMARY KEY,
  "timestamp" TIMESTAMP(3) NOT NULL,
  "created" TIMESTAMP(3) NOT NULL,
  "deleted" TIMESTAMP(3) NULL,
  "customer_id" BIGINT NOT NULL REFERENCES "customer" ("id"),
  "status" VARCHAR(10) NOT NULL
);

CREATE TABLE "sale_product" (
  "id" BIGSERIAL NOT NULL PRIMARY KEY,
  "sale_id" BIGINT NOT NULL REFERENCES "sale" ("id"),
  "product_id" VARCHAR(100) NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "quantity" DECIMAL(10,2) NOT NULL,
  "brand" VARCHAR(20) NOT NULL,
  "tax" DECIMAL(10,2) NOT NULL
);

INSERT INTO "user" ("timestamp", "created", "email", "password") VALUES (
  CURRENT_TIMESTAMP(3), 
  CURRENT_TIMESTAMP(3), 
  'superuser@inovia.com.br', 
  '27e0ce247829cfc5b71914f9c59f592c922153e195b750983abd4ec1b04de69e251957ad6393d962' /* Test@123 */
)