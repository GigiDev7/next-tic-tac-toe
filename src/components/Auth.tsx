"use client";

import { useAuthContext } from "@/context/AuthContext";
import { MouseEvent, useRef } from "react";
import { useRouter } from "next/navigation";

const Auth = () => {
  const authCtx = useAuthContext();
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (inputRef.current && !inputRef.current.value) {
      return;
    }

    if (inputRef.current && !inputRef.current.checkValidity()) {
      return;
    }

    authCtx.login(inputRef.current!.value);
    router.replace("/");
  };

  return (
    <form className="flex flex-col items-center gap-2 w-64">
      <input
        type="email"
        ref={inputRef}
        placeholder="Enter your email"
        className="w-full border-[1px] py-2 rounded-md outline-0 pl-1"
      />
      <button onClick={(e) => onSubmit(e)}>Login</button>
    </form>
  );
};

export default Auth;
