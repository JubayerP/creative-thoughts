import { auth, db } from "@/firebase/firebase.config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";


const post = () => {
    const [post, setPost] = useState({ description: "" })
    const [user, loading] = useAuthState(auth)
    const route = useRouter()

    // Handle Submit Post
    const handlePost = async (e) => {
        e.preventDefault();


        if (!post.description) {
            return toast.error('Description field empty!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500
            })
        }

        if (post.description.length > 300) {
            return toast.error('Description too long!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500
            })
        }

        // Create a new post
        const collectionRef = collection(db, 'posts')
        await addDoc(collectionRef, {
            ...post,
            timestamp: serverTimestamp(),
            user: user.uid,
            avatar: user.photoURL,
            userName: user.displayName
        })
        setPost({description: ''})
        return route.push('/')
    }

    return (
        <div className="my-16 p-12 shadow-lg rounded-lg max-w-md mx-auto">
            <form onSubmit={handlePost}>
                <h1 className="text-2xl font-bold">Create a new post</h1>

                <div className="py-2">
                    <h3 className="text-lg font-medium py-2">Description</h3>
                    <textarea value={post.description} onChange={e => setPost({...post, description: e.target.value})} className="bg-slate-500 h-28 w-full text-gray-300 rounded-lg p-2 text-sm outline-none"></textarea>
                    <p
                        className={`text-cyan-600 font-medium text-sm ${post.description.length > 300 ? 'text-red-600' : ''}`}
                    >{post.description.length}/300</p>
                </div>
                <button type="submit" className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm">Post</button>
            </form>
        </div>
    );
};

export default post;