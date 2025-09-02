import { env } from "./chunk-2V7TP353.js";

// src/http/authentication.ts
import Elysia, { t } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";

// src/http/routes/errors/unauthorized-error.ts
const UnauthorizedError = class extends Error {
  constructor() {
    super("Unauthorized.");
  }
};

// src/http/routes/errors/not-a-manager-error.ts
const NotAManagerError = class extends Error {
  constructor() {
    super("User is not a restaurant manager.");
  }
};

// src/http/authentication.ts
const jwtPayloadSchema = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
});
const authentication = new Elysia()
  .error({
    UNAUTHORIZED: UnauthorizedError,
    NOT_A_MANAGER: NotAManagerError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "UNAUTHORIZED":
        set.status = 401;
        return { code, message: error.message };
      case "NOT_A_MANAGER":
        set.status = 401;
        return { code, message: error.message };
    }
  })
  .use(
    jwt({
      name: "jwt",
      secret: env.JWT_SECRET_KEY,
      schema: jwtPayloadSchema,
    })
  )
  .use(cookie())
  .derive(({ jwt: jwt2, cookie: cookie2, setCookie, removeCookie }) => {
    return {
      getCurrentUser: async () => {
        const payload = await jwt2.verify(cookie2.auth);
        if (!payload) {
          throw new UnauthorizedError();
        }
        return payload;
      },
      signUser: async (payload) => {
        setCookie("auth", await jwt2.sign(payload), {
          httpOnly: true,
          maxAge: 7 * 86400,
          path: "/",
        });
      },
      signOut: () => {
        removeCookie("auth");
      },
    };
  })
  .derive(({ getCurrentUser }) => {
    return {
      getManagedRestaurantId: async () => {
        const { restaurantId } = await getCurrentUser();
        if (!restaurantId) {
          throw new NotAManagerError();
        }
        return restaurantId;
      },
    };
  });

export { UnauthorizedError, NotAManagerError, authentication };
