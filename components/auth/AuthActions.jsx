import Link from "next/link";

const AuthActions = ({ isLogin }) => {
    return (
        <>
            <div class="mt-6 flex justify-center relative">
                <div class="text-gray-600 uppercase px-3 bg-white z-10 relative">
                    Or {isLogin ? 'login' : 'register'} with
                </div>
                <div class="absolute left-0 top-3 w-full border-b-2 border-gray-200"></div>
            </div>
            <div class="mt-4 flex gap-4">
                <a
                    href="#"
                    class="w-1/2 py-2 text-center text-white bg-blue-800 rounded uppercase font-roboto font-medium text-sm hover:bg-blue-700"
                >
                    facebook
                </a>
                <a
                    href="#"
                    class="w-1/2 py-2 text-center text-white bg-red-600 rounded uppercase font-roboto font-medium text-sm hover:bg-red-500"
                >
                    google
                </a>
            </div>

            <p class="mt-4 text-center text-gray-600">
                {isLogin ? `${`Don't have account?`}` : "Have an account?"}{" "}
                <Link href={isLogin ? "/register" : "/login"} class="text-primary">
                    {isLogin ? 'Register' : "Login"} now
                </Link>
            </p>

        </>
    );
};

export default AuthActions;