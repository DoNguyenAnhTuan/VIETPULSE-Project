import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const DEFAULT_ACCOUNT = { username: "admin", password: "admin" };

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Initialize account in localStorage if not exists
  useEffect(() => {
    const stored = localStorage.getItem("account");
    if (!stored) {
      localStorage.setItem("account", JSON.stringify(DEFAULT_ACCOUNT));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem("account");
    const account = stored ? JSON.parse(stored) : DEFAULT_ACCOUNT;
    if (username === account.username && password === account.password) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background image with overlay */}
      <img
        src="/assets/images/_EIU6057.jpg"
        alt="EIU Background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#e6fbe6]/80 via-[#f8fbfd]/80 to-[#e6f0fa]/90 z-10" />
      <Card className="w-[420px] rounded-3xl shadow-2xl bg-white/80 backdrop-blur-md border-0 z-20">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <img
              src="/assets/images/logo-15nam.png"
              alt="EIU 15 Years Logo"
              className="h-20 w-auto transition-transform duration-200 hover:scale-105 drop-shadow"
              onError={(e) => {
                console.error('Failed to load logo:', e);
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/150x50";
              }}
            />
          </div>
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl font-extrabold text-[#388e3c] uppercase tracking-wide">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to access your energy management dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-semibold text-gray-700">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="rounded-full border-gray-300 focus:border-[#43a047] focus:ring-[#43a047] bg-white/90"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-[#388e3c] hover:text-[#0B3D61] font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="rounded-full border-gray-300 focus:border-[#43a047] focus:ring-[#43a047] pr-10 bg-white/90"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#388e3c]"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4" />
                  ) : (
                    <FaEye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}  
            <Button
              type="submit"
              className="w-full rounded-full font-bold text-white text-base uppercase bg-gradient-to-r from-[#43a047] via-[#388e3c] to-[#0B3D61] shadow-md hover:from-[#388e3c] hover:to-[#008080] transition-all duration-200 py-3"
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login; 