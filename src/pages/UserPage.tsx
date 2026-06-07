import type { SubmitHandler } from "react-hook-form";
import UserForm from "../components/form/user-form/user-form";
import type { FormData, LoginFormData } from "../constants";
import styles from "./user.page.module.css";
import { useState } from "react";
import UserLoginForm from "../components/form/user-form/user-login-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/auth.service";

const UserPage = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>(
    {}
  );

  const [generalError, setGeneralError] = useState<string>("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const onRegister: SubmitHandler<FormData> = async (data) => {
    try {
      setServerErrors({});
      setGeneralError("");
      console.log("clicked register button");
      const res = await registerUser(data);
      login(res.user, res.token);
      navigate("/dashboard");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "errors" in error) {
        setServerErrors(error.errors as Record<string, string[]>);
      } else if (error && typeof error === "object" && "error" in error) {
        setGeneralError(error.error as string); // ✅ catches "Invalid username or password"
      }
    }
  };

  const onLogin: SubmitHandler<LoginFormData> = async (data) => {
    try {
      console.log("clicked login button");
      setGeneralError("");
      setServerErrors({});
      const res = await loginUser(data);
      login(res.user, res.token);
      navigate("/dashboard");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "errors" in error) {
        setServerErrors(error.errors as Record<string, string[]>);
      } else if (error && typeof error === "object" && "error" in error) {
        setGeneralError(error.error as string); // ✅ catches "Invalid username or password"
      }
    }
  };

  return (
    <div className={styles.container}>
      {" "}
      {isLogin ? (
        <UserLoginForm
          onSubmit={onLogin}
          serverErrors={serverErrors}
          generalError={generalError}
        />
      ) : (
        <UserForm
          onSubmit={onRegister}
          serverErrors={serverErrors}
          generalError={generalError}
        />
      )}
      <div className={styles.action}>
        {isLogin ? (
          <p>Do not have an account? </p>
        ) : (
          <p>Already have an account?</p>
        )}
        <p onClick={() => setIsLogin(!isLogin)}>
          {" "}
          {isLogin ? "Register" : "Login"}
        </p>
      </div>
    </div>
  );
};

export default UserPage;
