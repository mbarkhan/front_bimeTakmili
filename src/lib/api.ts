// src/lib/api.ts

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://172.21.65.16:8000";


export async function login(personelCode: string, password: string) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ personelCode, password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "ورود ناموفق");
  }

  return response.json(); // حاوی token و user است
}
