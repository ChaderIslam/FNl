
import { useNavigate } from "react-router-dom";
import HImage from "../assets/pictures/H.png";
import logo from "../assets/pictures/logo.png";
import { useState , useEffect} from "react";
export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  //navigate directly to dashboard if token exists
  // useEffect(() => {
  //   const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  //   if (token) {
  //     navigate("/dashboard");
  //   }
  // }, [navigate]);
    useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError("");
    if (!email || !password) {
      console.log(email);
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        if (rememberMe) {
          console.log("remember me is checked");
          localStorage.setItem("token", data.token);
          localStorage.setItem("rememberedEmail", email);
        } else {
          sessionStorage.setItem("token", data.token);
          localStorage.removeItem("rememberedEmail");
        }
        navigate("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-950 via-green-800 to-green-600 p-6">
      <div className="flex w-full max-w-7xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        
        {/* Left Section */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center text-white p-12">
          <img
            src={HImage}
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-green-800/60 to-green-700/70"></div>

          <div className="relative z-10 max-w-md">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-xl font-bold">YOUR LOGO</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Hello, welcome!</h1>
            <p className="text-green-100 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi risus.
            </p>
            <button className="rounded-lg bg-white px-6 py-3 text-green-700 font-semibold shadow hover:bg-gray-100">
              View more
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-12">
          <div className="w-full max-w-lg flex flex-col items-center">
            <img 
              src={logo} 
              alt="Logo" 
              className="mb-6 max-h-40 w-auto object-contain"
            />

            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>

            <form className="w-full space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@mail.com"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 placeholder-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 placeholder-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600"
                />
                          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
                </div>
              </div>
            {error && (
            <div className="text-red-600 text-center font-semibold">{error}</div>
          )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-400" checked={rememberMe} onChange={(e)=> setRememberMe(e.target.checked)}/>
                  Remember me
                </label>
                <a href="#" className="text-green-600 hover:underline">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-green-800 to-green-600 px-4 py-3 font-semibold text-white shadow-md transition hover:from-green-900 hover:to-green-700"
              >
                Login
              </button>
              {/* <div className="mt-4 text-center">
  <span className="text-gray-600">Don't have an account?</span>
  <button
    type="button"
    className="ml-2 text-green-700 font-semibold hover:underline"
    onClick={() => navigate("/register")}
  >
    Register
  </button>
</div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
