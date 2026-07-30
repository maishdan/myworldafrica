import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SignUpInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().trim().min(2),
  role: z.enum(["rider", "driver", "explorer"]),
});

/**
 * Creates the account server-side with the service-role key and marks the email
 * as confirmed, so signup does not depend on Supabase SMTP delivery (which
 * currently returns 500 "Error sending confirmation email").
 * The client signs in normally right after.
 */
export const adminSignUp = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => SignUpInput.parse(data))
  .handler(async ({ data }) => {
    const url = process.env.MWA_SUPABASE_URL ?? "https://kzuaiqlthsydwcazldvk.supabase.co";
    const key = process.env.MWA_SUPABASE_SERVICE_ROLE_KEY;
    if (!key) throw new Error("Server is missing the Supabase service role key.");

    const res = await fetch(`${url}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: { username: data.username, role: data.role },
      }),
    });

    const body = (await res.json()) as { msg?: string; message?: string; error_description?: string };
    if (!res.ok) {
      const msg = body.msg || body.message || body.error_description || "Could not create account.";
      throw new Error(
        /already/i.test(msg) ? "An account with this email already exists. Try signing in." : msg,
      );
    }
    return { ok: true };
  });
