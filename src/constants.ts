import { z } from "zod";

export const formSchema = z.object({
  username: z.string().min(1, "username  is required"),
  email: z.email("Invalid Email address"),
  password: z.string().min(5, "Min 5 Characters is required"),
});

export type FormData = z.infer<typeof formSchema>;

export const LoginFormSchema = z.object({
  username: z.string().min(1, "username  is required"),
  password: z.string().min(5, "Min 5 Characters is required"),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;
