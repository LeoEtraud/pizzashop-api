import Elysia, { t } from "elysia";
import { db } from "@/db/connection";
import { authLinks } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";
import { env } from "@/env";
import { UnauthorizedError } from "./errors/unauthorized-error";
import { transporter } from "@/mail/client";
import { minutes } from "@/utils/time";

export const sendAuthenticationLink = new Elysia().post(
  "/authenticate",
  async ({ body }) => {
    const { email } = body;

    const userFromEmail = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email);
      },
    });

    if (!userFromEmail) {
      throw new UnauthorizedError();
    }

    const authLinkCode = createId();

    await db.insert(authLinks).values({
      userId: userFromEmail.id,
      code: authLinkCode,
      expiresAt: new Date(Date.now() + minutes(15)), // expira em 15min
    });

    const authLink = new URL("/auth-links/authenticate", env.API_BASE_URL);
    authLink.searchParams.set("code", authLinkCode);
    authLink.searchParams.set("redirect", env.AUTH_REDIRECT_URL);

    console.log("Magic link:", authLink.toString());

    // Envio de e-mail com Nodemailer
    await transporter.sendMail({
      from: `"Pizza Shop" <${env.SMTP_USER}>`,
      to: email,
      subject: "[Pizza Shop] Seu link de acesso",
      html: `
        <p>Olá,</p>
        <p>Clique no link abaixo para entrar na aplicação (expira em 15 minutos):</p>
        <p><a href="${authLink}">${authLink}</a></p>
        <br/>
        <p>Se não foi você que solicitou, apenas ignore este e-mail.</p>
      `,
    });

    return { message: "E-mail enviado (verifique sua caixa de entrada)" };
  },
  {
    body: t.Object({
      email: t.String({ format: "email" }),
    }),
  }
);
