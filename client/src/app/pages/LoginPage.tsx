import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Key, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { login as loginAPI, verifyOTP } from "../services/api";

export function LoginPage() {

  const navigate = useNavigate();

  // ✅ IMPORTANT: use completeLogin instead of setUser
  const { login, completeLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState<"login" | "otp">("login");
  const [otp, setOtp] = useState("");

  // 🔐 LOGIN
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await loginAPI(email, password);

      // ✅ 2FA FLOW
      if (res.data.requires2FA) {
        toast.success("OTP sent to your email");
        setStep("otp");
        return;
      }

      // ✅ NORMAL LOGIN (uses AuthContext)
      await login(email, password);

      toast.success("Welcome back!");
      navigate("/dashboard");

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  // 🔐 OTP VERIFY (FIXED)
  const handleVerifyOTP = async () => {
    if (!otp) {
      return toast.error("Enter OTP");
    }

    try {
      const res = await verifyOTP(email, otp);

      const { token, user } = res.data;

      // ✅ FIX: Use completeLogin instead of setUser
      completeLogin(token, user);

      toast.success("Login successful");
      navigate("/dashboard");

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="size-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Key className="size-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">
            PassVault
          </span>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">

          {/* STEP SWITCH */}
          {step === "login" ? (

            <>
              <h1 className="text-2xl font-bold mb-6 text-center">
                Login
              </h1>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-indigo-500/50 focus:bg-white/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-indigo-500/50 focus:bg-white/10"
                    />
                  </div>
                </div>

                {/* Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  Sign In
                  <ArrowRight className="ml-2 size-5" />
                </Button>

              </form>
            </>

          ) : (

            <>
              <h1 className="text-2xl font-bold mb-6 text-center">
                Enter OTP
              </h1>

              <div className="space-y-5">

                <Input
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-center tracking-widest text-lg bg-white/5 border-white/10 text-white"
                />

                <Button
                  onClick={handleVerifyOTP}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600"
                >
                  Verify OTP
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setStep("login")}
                  className="w-full text-gray-400 hover:text-white"
                >
                  Back
                </Button>

              </div>
            </>

          )}

          {/* Signup */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300">
              Sign up
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}