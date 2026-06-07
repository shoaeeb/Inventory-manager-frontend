import { useForm, type SubmitHandler } from "react-hook-form";
import styles from "./user.form.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, type FormData } from "../../../constants";

interface UserFormProps {
  onSubmit: SubmitHandler<FormData>;
  serverErrors?: Record<string, string[]>;
  generalError?: string;
}

export default function UserForm({
  onSubmit,
  serverErrors,
  generalError,
}: UserFormProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input
          className={styles.input}
          type="email"
          {...register("email", {
            required: "email is required",
          })}
        />
        {errors.email && (
          <p style={{ color: "orangered" }}>{errors.email.message}</p>
        )}
        {serverErrors?.email && (
          <p style={{ color: "orangered" }}>{serverErrors?.email[0]}</p>
        )}

        <label>Username</label>
        <input className={styles.input} type="text" {...register("username")} />
        {errors.username && (
          <p style={{ color: "orangered" }}>{errors.username.message}</p>
        )}
        {serverErrors?.username && (
          <p style={{ color: "orangered" }}>{serverErrors?.username[0]}</p>
        )}

        <label>Password</label>
        <input
          className={styles.input}
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <p style={{ color: "orangered" }}>{errors.password.message}</p>
        )}
        {serverErrors?.password && (
          <p style={{ color: "orangered" }}>{serverErrors?.password[0]}</p>
        )}

        {generalError && (
          <p
            style={{
              color: "orangered",
              background: "#fff0f0",
              padding: "0.6rem 1rem",
              borderRadius: "6px",
              fontSize: "0.9rem",
            }}
          >
            {generalError}
          </p>
        )}

        <div className={styles.buttonContainer}>
          <button className={styles.button} type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
