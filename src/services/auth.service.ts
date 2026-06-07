const BASE_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) throw json;
  return json;
};

export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw json;
  return json;
};

export const logoutUser = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok) throw json;
  return json;
};
