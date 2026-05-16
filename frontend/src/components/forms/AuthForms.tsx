import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, LogOut, Mail, User, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { loginUser, registerUser } from "../../api/authApi";
import { ApiError } from "../../lib/apiClient";
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues
} from "../../lib/validation";
import { type AuthSession } from "../../types/session";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { Panel } from "../ui/Panel";
import { SegmentedControl } from "../ui/SegmentedControl";
import { TextInput } from "../ui/TextInput";

type AuthMode = "login" | "register";
type SubmitState = "idle" | "success" | "error";

interface SubmitFeedback {
  state: SubmitState;
  message: string;
}

interface AuthFormsProps {
  session: AuthSession | null;
  onAuthenticated: (session: AuthSession) => void;
  onLogout: () => void;
}

const authModeOptions = [
  {
    label: "Login",
    value: "login"
  },
  {
    label: "Register",
    value: "register"
  }
] as const;

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const AuthForms = ({
  onAuthenticated,
  onLogout,
  session
}: AuthFormsProps): JSX.Element => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [feedback, setFeedback] = useState<SubmitFeedback>({
    state: "idle",
    message: ""
  });

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onTouched"
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    mode: "onTouched"
  });

  const isSubmitting = mode === "login" ? loginForm.formState.isSubmitting : registerForm.formState.isSubmitting;

  const title = useMemo(() => {
    return mode === "login" ? "User Login" : "User Registration";
  }, [mode]);

  const handleLogin = loginForm.handleSubmit(async (values) => {
    try {
      setFeedback({
        state: "idle",
        message: ""
      });
      const data = await loginUser(values);
      onAuthenticated(data);
      setFeedback({
        state: "success",
        message: "Signed in successfully."
      });
    } catch (error: unknown) {
      setFeedback({
        state: "error",
        message: getErrorMessage(error, "Login failed")
      });
    }
  });

  const handleRegister = registerForm.handleSubmit(async (values) => {
    try {
      setFeedback({
        state: "idle",
        message: ""
      });
      const data = await registerUser({
        email: values.email,
        name: values.name,
        password: values.password
      });
      onAuthenticated(data);
      setFeedback({
        state: "success",
        message: "Account created successfully."
      });
    } catch (error: unknown) {
      setFeedback({
        state: "error",
        message: getErrorMessage(error, "Registration failed")
      });
    }
  });

  return (
    <Panel>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Secure account access
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SegmentedControl<AuthMode>
            label="Auth mode"
            onChange={(nextMode) => {
              setMode(nextMode);
              setFeedback({
                state: "idle",
                message: ""
              });
            }}
            options={authModeOptions}
            renderIcon={(value) =>
              value === "login" ? (
                <LogIn aria-hidden="true" className="h-4 w-4" />
              ) : (
                <UserPlus aria-hidden="true" className="h-4 w-4" />
              )
            }
            value={mode}
          />
        </div>
      </div>

      {feedback.state === "success" ? (
        <div className="mt-5">
          <Alert title="Authentication ready" tone="success">
            {feedback.message}
          </Alert>
        </div>
      ) : null}

      {session ? (
        <div className="mt-5">
          <Alert title={`Signed in as ${session.user.name}`} tone="info">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span>{session.user.role}</span>
              <Button
                icon={<LogOut aria-hidden="true" className="h-4 w-4" />}
                onClick={onLogout}
                size="sm"
                variant="secondary"
              >
                Logout
              </Button>
            </div>
          </Alert>
        </div>
      ) : null}

      {feedback.state === "error" ? (
        <div className="mt-5">
          <Alert title="Authentication error" tone="error">
            {feedback.message}
          </Alert>
        </div>
      ) : null}

      {mode === "login" ? (
        <form className="mt-5 grid gap-4" onSubmit={handleLogin}>
          <TextInput
            autoComplete="email"
            error={loginForm.formState.errors.email?.message}
            icon={<Mail aria-hidden="true" className="h-4 w-4" />}
            label="Email"
            placeholder="sales@example.com"
            type="email"
            {...loginForm.register("email")}
          />
          <TextInput
            autoComplete="current-password"
            error={loginForm.formState.errors.password?.message}
            label="Password"
            placeholder="Enter password"
            type="password"
            {...loginForm.register("password")}
          />
          <div className="flex justify-end">
            <Button
              icon={<LogIn aria-hidden="true" className="h-4 w-4" />}
              isLoading={isSubmitting}
              type="submit"
            >
              Login
            </Button>
          </div>
        </form>
      ) : (
        <form className="mt-5 grid gap-4" onSubmit={handleRegister}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              autoComplete="name"
              error={registerForm.formState.errors.name?.message}
              icon={<User aria-hidden="true" className="h-4 w-4" />}
              label="Name"
              placeholder="Aarav Sharma"
              type="text"
              {...registerForm.register("name")}
            />
            <TextInput
              autoComplete="email"
              error={registerForm.formState.errors.email?.message}
              icon={<Mail aria-hidden="true" className="h-4 w-4" />}
              label="Email"
              placeholder="aarav@example.com"
              type="email"
              {...registerForm.register("email")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              autoComplete="new-password"
              error={registerForm.formState.errors.password?.message}
              label="Password"
              placeholder="Create password"
              type="password"
              {...registerForm.register("password")}
            />
            <TextInput
              autoComplete="new-password"
              error={registerForm.formState.errors.confirmPassword?.message}
              label="Confirm Password"
              placeholder="Repeat password"
              type="password"
              {...registerForm.register("confirmPassword")}
            />
          </div>
          <div className="flex justify-end">
            <Button
              icon={<UserPlus aria-hidden="true" className="h-4 w-4" />}
              isLoading={isSubmitting}
              type="submit"
            >
              Register
            </Button>
          </div>
        </form>
      )}
    </Panel>
  );
};
