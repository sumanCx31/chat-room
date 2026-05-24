import "../assets/style/index.css";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import authSvc from "../services/Auth.service";
import { useNavigate } from "react-router";
import { useAuth } from "../context/auth.context";

export default function ChatLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setLoggedInUserProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
   
      const res: any = await authSvc.postRequest("/auth/login", {
    email,
    password,
  });

  const token = res?.data?.accessToken;
  const userId = res?.data?.userId;
  const user = res?.data?.user; 

  console.log("token:", token);
  
  if (token) {
    localStorage.setItem("token", token);
  }

  if (userId) {
    localStorage.setItem("senderId", userId);
  }

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
  if (!token) {
    throw new Error("No token received from backend");
  }

  const userRes = await authSvc.getRequest("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
     
      setLoggedInUserProfile(userRes.data);


      console.log("Login success:", res);
      navigate("/chat");

    } catch (error: any) {
      console.log("Login failed:", error?.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 font-sans antialiased">
      
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md p-2"
      >
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 backdrop-blur-xl shadow-2xl shadow-indigo-950/20">

          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-100">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Connect securely to your workspace
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-xs text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 py-2.5 text-sm font-semibold text-white"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    Sign In <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </AnimatePresence>
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <a className="text-indigo-400" href="/register">
              Create account
            </a>
          </div>

        </div>
      </motion.div>
    </div>
  );
}