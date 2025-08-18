"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

interface AuthResponse {
  message?: string;
  success: boolean;
  token?: string;
  errors?: { username?: string; email?: string; password?: string, backendError?: string };
  // error?:string | null;
  username?: string;
}

export async function signUp(
  prevState: AuthResponse,
  formData: FormData
): Promise<AuthResponse> {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const errors: { username?: string; email?: string; password?: string } = {};

  // server side validation
  if (!username.trim() || username.length < 3) {
    errors.username = "invalid password";
  }

  if (!email.includes("@") || !email.includes(".")) {
    errors.email = "provide valid email credentials ";
  }

  if (password.length < 8) {
    errors.password = "password length is too short";
  }

  if (Object.keys(errors).length > 0) {
    return { message: "Validation failed.", success: false, errors };
  }

  try {
    const url = process.env.NEXT_PUBLIC_TASKMANAGER_URL;
    if (!url) {
      throw new Error("url not defined");
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = { username, email, password };
    const response = await axios.post(
      `${url}/api/v1/auth/register`,
      body,
      config
    );
    const data = response.data;
    const { token } = data;
    const cookieStorage = await cookies();
    cookieStorage.set("regToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); // 1 day
    // localStorage.setItem('regToken', token)
    console.log("sign up successful:", data);
    revalidatePath("/LogIn");
    return {
      message: "Sign-up successful!",
      success: true,
      errors: {},
      token: token,
    };
    // return {success:true, token:token};
  } catch (error: any) {
    console.error(error);
    let errorMessage: string;
    if (error.code === "ERR_INTERNET_DISCONNECTED") {
      errorMessage =
        "Failed to connect with sever, check internet connection!!";
    } else if (error.response && error.response.status === 404) {
      errorMessage = "something went wrong, try later !!";
    } else if (error.response && error.response.data.msg) {
      errorMessage = error.response.data.msg;
    } else {
      errorMessage = "Registration Failed, please try later";
    }
    // setSignUpError(errorMessage)
    return { errors:{backendError:errorMessage}, success: false  };
    // return {success:false, errors:{backendError:errorMessage}};
  }
}

export async function logIn(
  prevState: AuthResponse,
  formData: FormData
): Promise<AuthResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const errors: { email?: string; password?: string } = {};

  if (!email.includes("@") || !email.includes(".")) {
    errors.email = "provide valid email credentials ";
  }

  if (password.length < 8) {
    errors.password = "password length is too short";
  }

  if (Object.keys(errors).length > 0) {
    return { message: "Validation failed.", success: false, errors };
  }

  try {
    const url = process.env.NEXT_PUBLIC_TASKMANAGER_URL;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = { email, password };
    const response = await axios.post(`${url}/api/v1/auth/login`, body, config);
    const data = response.data;
    const { token, user } = data;
    const loginCookie = await cookies();
    loginCookie.set("authToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    loginCookie.set("username", user.username, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // localStorage.setItem('authToken', token)
    // setUserName(data.user?.username)
    // localStorage.setItem('username', data.user.username)
    console.log("login successful:", data);
    revalidatePath("/TaskDashBoard");
    return {
      success: true,
      token: token,
      username: user.username,
      message: "login succesful",
    };
  } catch (error: any) {
    console.error(error);
    let errorMessage: string;
    if (error.code === "ERR_INTERNET_DISCONNECTED") {
      errorMessage =
        "Failed to connect with sever, check internet connection!!";
    } else if (error.response && error.response.status === 404) {
      errorMessage = "something went wrong, try again later!!";
    } else if (error.response && error.response.data.msg) {
      errorMessage = error.response.data.msg;
    } else {
      errorMessage = "Login failed, please try later";
    }
    // setLogInError(errorMessage)
    return { success: false, errors: {backendError:errorMessage} };
  }
}

export async function logOut() {
  (await cookies()).delete("authToken"),
    (await cookies()).delete("regToken"),
    (await cookies()).delete("username"),
    revalidatePath("/LogIn");
}

export async function getUserNameFromCookieStore(): Promise<string | null> {
  const cookieStorage = await cookies();
  return cookieStorage.get("username")?.value || null;
}

export async function getTokenFromCookieStore(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("authToken")?.value || null;
}
