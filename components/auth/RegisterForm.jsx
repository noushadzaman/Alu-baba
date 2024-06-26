'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const RegisterForm = () => {
    const [error, setError] = useState("");
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        const { name, email, password, confirm } = data;

        try {
            if (password !== confirm) {
                setError("Password didn't matched");
                return;
            }
            const res = await fetch('/api/auth/register', {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password
                })
            })
            res.status === 201 && router.push("/login");
        }
        catch (error) {
            setError(error.message);
            console.log(error)
        }
    }

    return (
        <>
            <div className="text-xl text-red-500 text-center">{error && error}</div>
            <form onSubmit={handleSubmit(onSubmit)} >
                <div className="space-y-2">
                    <div>
                        <label htmlFor="name" className="text-gray-600 mb-2 block">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                            placeholder="your name"
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && <span className="text-red-400">{errors.name.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="email" className="text-gray-600 mb-2 block">
                            Email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                            placeholder="your email.@domain.com"
                            {...register("email", { required: "Email is required" })}
                        />
                        {errors.email && <span className="text-red-400">{errors.email.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="password" className="text-gray-600 mb-2 block">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                            placeholder="*******"
                            {...register("password", {
                                required: "password is required", minLength: {
                                    value: 8,
                                    message: "password must contain at least 8 characters"
                                }
                            })}
                        />
                        {errors.password && <span className="text-red-400">{errors.password?.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="confirm" className="text-gray-600 mb-2 block">
                            Confirm password
                        </label>
                        <input
                            type="password"
                            name="confirm"
                            id="confirm"
                            className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                            placeholder="*******"
                            {...register("confirm", {
                                required: "password is required", minLength: {
                                    value: 8,
                                    message: "password must contain at least 8 characters"
                                }
                            })}
                        />
                        {errors.confirm && <span className="text-red-400">{errors.confirm?.message}</span>}
                    </div>
                </div>
                <div className="mt-6">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="agrement"
                            id="agrement"
                            className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                            {...register("agrement", { required: "Terms and conditions must be accepted" })}
                        />
                        <label htmlFor="aggrement" className="text-gray-600 ml-3 cursor-pointer">
                            I have read and agree to the{" "}
                            <Link href="" className="text-primary">
                                terms & conditions
                            </Link>
                        </label>
                    </div>
                    {errors.agrement && <span className="text-red-400">{errors.agrement?.message}</span>}
                </div>
                <div className="mt-4">
                    <button
                        type="submit"
                        className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
                    >
                        create account
                    </button>
                </div>
            </form>
        </>
    );
};

export default RegisterForm;