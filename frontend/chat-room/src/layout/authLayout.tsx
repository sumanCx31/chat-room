import '../assets/style/index.css';
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthLayout() {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 font-sans antialiased py-12 px-4">
      {/* Shared Dynamic Ambient Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      {/* Slide-and-Fade Page Transition Wrapper */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname} // Triggers animation whenever route switches
          initial={{ opacity: 0, y: 15, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.99 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full flex justify-center"
        >
          {/* This renders ChatLogin or ChatRegister seamlessly */}
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}