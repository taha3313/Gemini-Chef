const BASE_URL = "https://localhost:7155/api/User"; // Update port as needed

// Register function
export async function register(email, password) {
  const response = await fetch("https://localhost:7155/api/User/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: email.split("@")[0], // temporary workaround
      email,
      password: password
    }),
  });

  if (!response.ok) throw new Error("Registration failed");
  return await response.json();
}

// Login function
export async function login(login, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password }), // 'login' can be email or username
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export function logout() {
  // Clear the token from localStorage or sessionStorage
  localStorage.removeItem("token");
}
