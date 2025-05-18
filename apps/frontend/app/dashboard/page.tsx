'use client'
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { MousePointerSquareDashed, LogOutIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

type Room = {
    id: number,
    slug: string,
    crreatedAt: string,
    adminId: string
}

export default function () {
    const [roomSlag, setRoomSlag] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [username, setUsername] = useState<string | null>("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.post(`${HTTP_BACKEND}/create-room`, 
                {
                    name: roomSlag
                },
                {
                    headers: {
                        authorization: token
                    }
                }
            )
            setLoading(false);
            if(response.status == 201) {
                setLoading(false);
                console.log(`Room created, roomId: ${response.data.roomId}`);
                router.push(`/canvas/${response.data.roomId}`);
            }
            else if(response.status == 403) {
                setLoading(false);
                setError(response.data.message);
            }
            else if(response.status == 403) {
                setLoading(false);
                setError(response.data.message);
            }
        }
        catch(error) {
            setLoading(false);
            setError("Server Error !");   
        }
    }

    const fetchRooms = async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${HTTP_BACKEND}/get-rooms`, {
            headers: {
                authorization: token
            }
        });
        setRooms(response.data.rooms)
        console.log("rooms: ", response.data.rooms);
    }

    const handleLogOut = () => {
        localStorage.clear();
        router.push("/");
    }

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        setUsername(storedUsername);
        
        fetchRooms();
    }, []);

    return (
        <div className="h-screen w-screen bg-slate-200 text-slate-800 flex justify-center">
            {/* Actual Page Div */}
            <div className="h-screen w-screen xl:w-[70%] px-6">
                {/* Navbar */}
                <div className="h-16 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <MousePointerSquareDashed className="h-8 w-8 text-blue-600" />
                        <span className="font-bold text-xl text-gray-900">Excaliboard</span>
                    </Link>
                    <div className="flex gap-x-1">
                        <button onClick={handleLogOut} className="h-10 px-6 flex items-center justify-between gap-x-3 rounded-full bg-slate-500 hover:bg-slate-600 cursor-pointer text-white transition-all duration-300"><span>Logout</span><LogOutIcon /></button>
                    </div>
                </div>
                <div>
                    <h1 className="text-3xl font-bold opacity-80 text-blue-600">Good Morning <span className="text-blue-700">{username}</span> . . .</h1>
                    <div className="w-[100%] flex sm:justify-evenly items-center flex-wrap justify-center pt-20 gap-y-3">
                        
                        {/* Room Count Card */}
                        <div className="w-[400px] bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md border border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" />
                                </svg>
                                </div>
                                <div>
                                <h3 className="text-lg font-semibold text-gray-700">Active Rooms</h3>
                                <p className="text-gray-500 text-sm mt-1"><span className="text-blue-500">{rooms.length | 0}</span> active spaces</p>
                                </div>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto space-y-2">
                                {rooms.map((room, index) => (
                                <div 
                                    key={index}
                                    className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border-b border-gray-100 last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                    <span className="text-gray-700 font-medium truncate">{room.slug}</span>
                                    </div>
                                    <button 
                                    className=" text-blue-600 hover:text-blue-700 bg-blue-100 px-3 py-1 text-sm rounded-full transition-all duration-200 cursor-pointer"
                                    onClick={() => {
                                        router.push(`/canvas/${room.id}`);
                                    }}
                                    >
                                    Join
                                    </button>
                                </div>
                                ))}
                            </div>
                            <p className="text-gray-400 text-sm mt-4 pt-4 border-t border-gray-100">
                                Click on a room to collaborate in real-time
                            </p>
                        </div>

                        {/* Create Room Card */}
                        <div className="w-[400px] h-[300px] bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Create New Room</h3>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="roomName" className="block text-sm text-gray-600 mb-2">Room Name</label>
                                <input
                                type="text"
                                id="roomSlag"
                                placeholder="Drawing Class"
                                value={roomSlag}
                                onChange={(e) => setRoomSlag(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm mb-4 text-center py-2 px-3 bg-red-50 rounded-md">
                                {error}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-br from-blue-600 to-blue-500 text-white py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all font-medium flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {!loading && <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                }
                                {loading && <Loader />}
                                {(loading ? "Creating room..." : "Create Room")}
                            </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}