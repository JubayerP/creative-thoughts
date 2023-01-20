import { auth, db } from "@/firebase/firebase.config";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";


const post = () => {
    const [post, setPost] = useState({ description: "" })
    const [user, loading] = useAuthState(auth)
    const route = useRouter()
    const routeData = route.query;

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

        if (post?.hasOwnProperty("id")) {
            const docRef = doc(db, 'posts', post.id);
            const updatedPost = { ...post, timestamp: serverTimestamp() }
            await updateDoc(docRef, updatedPost)
            return route.push('/')
        } else {

            // Create a new post
            const collectionRef = collection(db, 'posts')
            await addDoc(collectionRef, {
                ...post,
                timestamp: serverTimestamp(),
                user: user.uid,
                avatar: user.photoURL,
                userName: user.displayName
            })
            setPost({ description: "" })
            toast.success("Post has been made!", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500,
            })
            return route.push('/')
        }
    }


    // Check the user
    const checkUser = async () => {
        if (loading) return
        if (!user) return route.push('/auth/login')

        if (routeData.id) {
            setPost({ description: routeData.description, id: routeData.id })
        }
    }

    useEffect(() => {
        checkUser();
    }, [user, loading])

    return (
        <div className="my-16 p-12 shadow-lg rounded-lg max-w-md mx-auto">
            <form onSubmit={handlePost}>
                <h1 className="text-2xl font-bold">
                    {post.hasOwnProperty("id") ? 'Edit your post' : 'Create a new post'}
                </h1>

                <div className="py-2">
                    <h3 className="text-lg font-medium py-2">Description</h3>
                    <textarea value={post.description} onChange={e => setPost({ ...post, description: e.target.value })} className="bg-slate-500 h-28 w-full text-gray-300 rounded-lg p-2 text-sm outline-none"></textarea>
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