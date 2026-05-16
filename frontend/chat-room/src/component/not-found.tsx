import '../assets/style/index.css'
import { motion } from "framer-motion";
import { Home, ArrowLeft, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 font-sans antialiased px-4">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] left-[10%] h-[70%] w-[50%] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute -bottom-[30%] right-[10%] h-[70%] w-[50%] rounded-full bg-violet-600/10 blur-[130px]" />
      </div>

      {/* Main Error Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md text-center"
      >
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-10 backdrop-blur-xl shadow-2xl shadow-indigo-950/20">
          
          {/* Animated 404 Header Accent */}
          <div className="relative inline-flex items-center justify-center">
            <motion.h1 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-8xl font-black tracking-extrabold bg-clip-text text-transparent bg-gradient-to-b from-slate-100 via-slate-200 to-slate-500 drop-shadow-sm select-none"
            >
              404
            </motion.h1>
            {/* Soft background reflection ring */}
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-10 blur-xl rounded-full" />
          </div>

          <h2 className="mt-6 text-xl font-bold tracking-tight text-slate-100">
            Page not found
          </h2>
          
          <p className="mt-2.5 text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
            The page you're looking for doesn't exist or has been moved to a different workspace.
          </p>

          {/* Action Buttons Layout */}
          <div className="mt-8 space-y-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => window.history.back()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 py-2.5 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-400 hover:to-violet-400 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </motion.button>

            <motion.a
              href="/"
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-sm font-medium text-slate-300 hover:bg-slate-950 hover:border-slate-700 transition-all cursor-pointer"
            >
              <Home className="h-4 w-4 text-slate-400" />
              <span>Return Dashboard</span>
            </motion.a>
          </div>

          {/* Inline Support Link */}
          <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-slate-600">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Need help?</span>
            <a href="#" className="font-medium text-slate-500 hover:text-indigo-400 transition-colors">
              Contact support
            </a>
          </div>

        </div>
      </motion.div>
    </div>
  );
}