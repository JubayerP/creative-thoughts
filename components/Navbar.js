import Link from "next/link";

const Navbar = () => {
    return (
        <nav className='flex justify-between items-center py-10'>
            <Link href='/'>
                <button className="text-lg font-medium">Creative Thoughts</button>
            </Link>

            <ul className="flex items-center gap-10">
                <Link href={'/auth/login'}>
                    <span className="py-2 px-4 text-sm bg-indigo-400 text-white rounded-lg font-medium ml-8">Login</span>
                </Link>
            </ul>
        </nav>
    );
};

export default Navbar;