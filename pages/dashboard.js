import Message from "@/components/message";
import { auth, db } from "@/firebase/firebase.config";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiFillEdit } from 'react-icons/ai';
import { BsTrash2Fill } from 'react-icons/bs';

const dashboard = () => {
    const route = useRouter();
    const [user, loading] = useAuthState(auth)
    const [posts, setPosts] = useState([]);

    // See if user is loggen in
    const getData = async => {
        if (loading) return;
        if (!user) return route.push('/auth/login')

        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef, where('user', '==', user.uid))
        const unsubscribe = onSnapshot(q, (snapshot => {
            setPosts(snapshot.docs.map((doc) => ({
                ...doc.data(), id: doc.id
            })))
            return unsubscribe;
        }))
    }

    // Delete Post Func
    const deletePost = async id => {
        const proceed = window.confirm('Are you sure?')
        if (proceed) {
            const docRef = doc(db, 'posts', id)
            await deleteDoc(docRef)
        }
    }

    useEffect(() => {
        getData();
    }, [user, loading])


    return (
        <div>
            <h1>Your posts</h1>
            <div>
                {posts.map((post) => {
                    return (
                        <Message {...post} key={post.id}>
                            <div className="flex gap-4">
                                <button onClick={() => deletePost(post.id)} className="text-pink-500 flex items-center justify-center gap-2 py-2 text-sm"><BsTrash2Fill className="text-2xl" /> Delete</button>
                                <Link href={{pathname: "/post", query: post}}>
                                    <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm"><AiFillEdit className="text-2xl" /> Edit</button>
                                </Link>
                            </div>
                        </Message>
                    )
                })}
            </div>
            <button className="font-medium text-white bg-slate-800 py-2 px-4 my-6" onClick={() => auth.signOut()}>Sign out</button>
        </div>
    );
};

export default dashboard;