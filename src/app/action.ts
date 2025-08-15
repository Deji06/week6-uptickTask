"use server"
import axios from 'axios'
import {redirect} from 'next/navigation'

export async function signUpUser(prevState: { message: string }, formData: FormData) {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Server-side validation for security and data integrity.
  if (!username || !email.includes('@') || password.length < 6) {
    return { message: 'Invalid input. Please check your username, email, or password length.' };
  }

  try {
    const url = process.env.NEXT_PUBLIC_TASKMANAGER_URL;
    const response = await axios.post(`${url}/api/v1/auth/register`, {
      username,
      email, 
      password
    });

    const { token } = response.data;
    redirect('/LogIn');
    return { message: 'Sign-up successful!' };

  } catch (error: any) {
    console.error('Sign-up failed:', error.response?.data?.msg || error.message);
    const errorMessage = error.response?.data?.msg || 'Registration failed, please try again later.';
    return { message: errorMessage };
  }
}

export async function loginUser(prevState: { message: string, token?: string, username?: string }, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const url = process.env.NEXT_PUBLIC_TASKMANAGER_URL;
    const response = await axios.post(`${url}/api/v1/auth/login`, {
      email,
      password
    });
    
    const { token, user } = response.data;
    return { message: 'Login successful!', token, username: user.username };

  } catch (error: any) {
    console.error('Login failed:', error.response?.data?.msg || error.message);
    const errorMessage = error.response?.data?.msg || 'Login failed, please try again later.';
    return { message: errorMessage };
  }
}