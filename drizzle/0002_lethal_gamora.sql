-- Garantir created_at válido nas linhas antigas antes de NOT NULL
ALTER TABLE "auth_links" ALTER COLUMN "created_at" SET DATA TYPE timestamptz;

-- Se houver created_at nulo nas linhas antigas, preenche com agora
UPDATE "auth_links"
SET "created_at" = NOW()
WHERE "created_at" IS NULL;

-- Agora podemos travar created_at como NOT NULL
ALTER TABLE "auth_links" ALTER COLUMN "created_at" SET NOT NULL;

-- 1) Adiciona expires_at como NULLABLE primeiro
ALTER TABLE "auth_links" ADD COLUMN "expires_at" timestamptz;

-- 2) Backfill: dá 15 minutos após a criação para as linhas antigas
UPDATE "auth_links"
SET "expires_at" = COALESCE("created_at", NOW()) + INTERVAL '15 minutes'
WHERE "expires_at" IS NULL;

-- 3) Agora trava expires_at como NOT NULL
ALTER TABLE "auth_links" ALTER COLUMN "expires_at" SET NOT NULL;

-- used_at deve ser NULLABLE (uso único)
ALTER TABLE "auth_links" ADD COLUMN "used_at" timestamptz;

-- índice opcional
CREATE INDEX IF NOT EXISTS "auth_links_user_created_idx"
  ON "auth_links" ("user_id","created_at");
