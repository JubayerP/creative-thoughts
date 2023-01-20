import Message from "@/components/message";
import { auth, db } from "@/firebase/firebase.config";
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Details = () => {
    const route = useRouter();
    const routeData = route.query;
    const [message, setMessage] = useState('');
    const [allMessages, setAllMessages] = useState([])


    // Submit a message
    const submitMessage = async () => {
        // Check if the user logged
        if (!auth.currentUser) return route.push('/auth/login')
        if (!message) {
            toast.error("Don't leave empty message", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500
            })
            return;
        }

        const docRef = doc(db, "posts", routeData.id)
        await updateDoc(docRef, {
            comments: arrayUnion({
                message,
                avatar: auth.currentUser.photoURL,
                userName: auth.currentUser.displayName,
                time: Timestamp.now(),
            })
        })

        setMessage("");
    }

    // Get the comments
    const getComments = async () => {
        const docRef = doc(db, 'posts', routeData.id);
        const unsubscribe = onSnapshot(docRef, (snapshot)=>{
            setAllMessages(snapshot.data().comments)
        })

        return unsubscribe;
    }

    useEffect(() => {
        if (!route.isReady) return;
        getComments();
    },[route.isReady])


    return (
        <div>
            <Message {...routeData}></Message>

            <div className="my-4">
                <div className="flex ">
                    <input onChange={(e) => setMessage(e.target.value)} type="text" value={message} placeholder='Leave a message' className="bg-gray-800 w-full p-2 text-white text-sm outline-none" />
                    <button onClick={submitMessage} className="bg-indigo-600 text-white py-2 px-4 text-sm">Send</button>
                </div>

                <div className="py-6">
                    <h2 className="font-bold text-teal-600">Comments</h2>
                    {
                        allMessages?.map(message => (
                            <div className="bg-white p-4 my-4 border-2" key={message.time}>
                                <div className="flex items-center gap-2 mb-4">
                                    <img className="w-10 rounded-full" src={message.avatar} alt="" />
                                    <h2>{message.userName}</h2>
                                </div>
                                <h2>{message.message}</h2>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Details;