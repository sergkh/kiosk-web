import "./Login.css"
import { signInWithGoogle } from "../firebase";

async function handleLogin() {
  console.log("Login button clicked");
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


function Login() {
  return (
    <div className="login">
      <button onClick={handleLogin}>Sign in</button>
    </div>
  )
}

export default Login;