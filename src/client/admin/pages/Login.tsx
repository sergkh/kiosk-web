import { signInWithGoogle } from "../firebase";

function Login() {
  async function handleLogin() {
    try {
      const result = await signInWithGoogle();
      const token = await result.user.getIdToken(); // Firebase ID token
      // send token to backend
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
    } catch (err) {
      console.error("Login failed", err);
    }
  }

  return (
    <div>
      <button onClick={handleLogin}>Sign in</button>
    </div>
  )
}

export default Login;