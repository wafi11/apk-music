import z, { email } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .min(1, "Username harus diisi")
    .refine((val) => !/\s/.test(val), {
      message: "Username tidak boleh mengandung spasi",
    }),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(100, "Password maksimal 100 karakter")
    .refine((val) => !/\s/.test(val), {
      message: "Password tidak boleh mengandung spasi",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password harus mengandung huruf kecil",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password harus mengandung huruf besar",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password harus mengandung angka",
    })
    .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val), {
      message: "Password harus mengandung karakter spesial (!@#$%^&* dll)",
    }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
