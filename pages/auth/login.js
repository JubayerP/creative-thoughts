import { FcGoogle } from 'react-icons/fc'
import { BsFacebook } from 'react-icons/bs'
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase/firebase.config'
import { useRouter } from 'next/router';
import {useAuthState} from 'react-firebase-hooks/auth'
import { useEffect } from 'react';

const login = () => {
    const route = useRouter()
    const [user, loading] = useAuthState(auth)

    // sign in with google
    const googleProvider = new GoogleAuthProvider();
    const facebookProvider = new FacebookAuthProvider();

    const GoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            route.push('/')
        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        if (user) {
            route.push('/')
        } else {
            console.log('login');
        }
    },[user])

    return (
        <div className="shadow-xl mt-32 p-10 text-gray-700 rounded-lg">
            <h2 className="text-2xl font-medium">Login Today</h2>

            <div className="py-4">
                <h3 className="py-4">Sign in with</h3>
                <button onClick={GoogleLogin} className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2 mb-6">
                    <FcGoogle className='text-2xl'/>
                    Sign in with Google</button>
                <button className="text-white bg-indigo-400 w-full font-medium rounded-lg flex align-middle p-4 gap-2"><BsFacebook className='text-2xl'/> Sign in with Facebook</button>
            </div>
        </div>
    );
};

export default login;