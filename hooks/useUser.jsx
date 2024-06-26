'use client'

import { UserContext } from "@/context";
import { useContext } from "react";

const useUser = () => {
    const { user, setUser } = useContext(UserContext)
    return { user, setUser };
};

export default useUser;