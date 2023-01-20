import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase.config";

const Navbar = () => {
    const [user, loading] = useAuthState(auth)
    return (
        <nav className='flex justify-between items-center py-10'>
            <Link href='/'>
                <button className="text-lg font-medium">Creative Thoughts</button>
            </Link>

            <ul className="flex items-center gap-10">
                {!user &&
                    <Link href={'/auth/login'}>
                        <span className="py-2 px-4 text-sm bg-indigo-400 text-white rounded-lg font-medium ml-8">Login</span>
                    </Link>}
                {
                    user &&
                    <div className="flex items-center gap-6">
                        <Link href='/post'>
                            <button className="font-medium bg-cyan-600 text-white py-2 px-4 rounded-md text-sm">Post</button>
                        </Link>
                        <Link href='/dashboard'>
                            <img className="w-12 rounded-full cursor-pointer" src={user?.photoURL} alt="user" />
                        </Link>
                    </div>
                }
            </ul>
        </nav>
    );
};

export default Navbar;