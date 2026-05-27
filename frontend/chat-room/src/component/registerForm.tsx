import "./../assets/style/index.css";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {  Camera, Loader2, MessageSquare } from "lucide-react";
import authSvc from "../services/Auth.service";
import { useNavigate } from "react-router";

export default function ChatRegister() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    gender: "",
    phone: "",
    password: "",
    confirmPassword: "",
    image:null
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("gender", form.gender);
      formData.append("phone", form.phone);
      formData.append("password", form.password);
      formData.append("confirmPassword",form.confirmPassword);

     Object.entries(formData).forEach(([key, value]) => {
        if (key === "image" && value) {
          formData.append(key, value as File);
        } else {
          formData.append(key, value as string);
        }
      });

      const res = await authSvc.postRequest("/auth/register", formData);

      console.log(res);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-200 focus:border-indigo-500/80 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500/10";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 font-sans antialiased py-12 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-40%] right-[-20%] h-[80%] w-[60%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-40%] left-[-20%] h-[80%] w-[60%] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <motion.div className="relative z-10 w-full max-w-lg">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 backdrop-blur-xl">

          <div className="flex flex-col items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-500 to-violet-500">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>

            <h1 className="mt-4 text-2xl font-bold text-slate-100">
              Create your account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">

            <div className="flex justify-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-20 w-20 rounded-full border border-dashed border-slate-700 overflow-hidden cursor-pointer flex items-center justify-center"
              >
                {imagePreview ? (
                  <img src={imagePreview} className="h-full w-full object-cover" />
                ) : (
                  <Camera className="text-slate-500" />
                )}
              </div>

              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </div>

            <input id="name" value={form.name} onChange={handleInputChange} placeholder="Full Name" className={inputClass} />
            <input id="username" value={form.username} onChange={handleInputChange} placeholder="Username" className={inputClass} />
            <input id="email" value={form.email} onChange={handleInputChange} placeholder="Email" className={inputClass} />
            <input id="phone" value={form.phone} onChange={handleInputChange} placeholder="Phone" className={inputClass} />

            <select id="gender" value={form.gender} onChange={handleInputChange} className={inputClass}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input id="password" type="password" value={form.password} onChange={handleInputChange} placeholder="Password" className={inputClass} />

            <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={handleInputChange} placeholder="Confirm Password" className={inputClass} />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 py-2.5 text-white font-semibold"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  Creating...
                </span>
              ) : (
                "Get Started"
              )}
            </button>

          </form>
        </div>
      </motion.div>
    </div>
  );
}