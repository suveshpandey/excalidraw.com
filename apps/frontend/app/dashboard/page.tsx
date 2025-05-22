"use client"

import React, { useEffect, useState } from 'react';
import { PanelRight, Clock, Activity, Loader } from 'lucide-react';
import Navbar from '../../components/Navbar';
import RoomCard from '../../components/RoomCard';
import CreateRoomCard from '../../components/CreateRoomCard';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { HTTP_BACKEND } from '@/config';
import { signOut, useSession } from 'next-auth/react';

type Room = {
  id: number,
  slug: string,
  crreatedAt: string,
  adminId: string
}

function App() {
    const [roomSlag, setRoomSlag] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [username, setUsername] = useState<string | null>("");
    const [currTime, setCurrTime] = useState("");
    const [isInitializing ,setIsInitializing] = useState(true);
    const [lastActiveTime, setLastActiveTime] = useState("");

    const router = useRouter();
    const { data: session } = useSession();

    //Create Room Function
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
                setError("");
                console.log(`Room created, roomId: ${response.data.roomId}`);
                // router.push(`/canvas/${response.data.roomId}`);
                fetchRooms();
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
        finally {
          setLoading(false);
          setRoomSlag("");
        }
    };

    const handleLogOut = async () => {
      try {
        // Sign out from NextAuth
        await signOut({ redirect: false });
        
        // Clear local storage (your JWT system)
        localStorage.clear();
        
        // Redirect to home page
        router.push('/');
        
        // Optional: Force a full page reload to clear any residual state
        window.location.href = '/';
      } catch (error) {
        console.error('Logout error:', error);
        // Fallback to basic logout if NextAuth fails
        localStorage.clear();
        router.push('/');
      }
    };

    const fetchRooms = async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${HTTP_BACKEND}/get-rooms`, {
            headers: {
                authorization: token
            }
        });
        setRooms(response.data.rooms)
        console.log("rooms: ", response.data.rooms);
    };

    const joinRoom = (currentRoomId: number) => {
        console.log(`Joining room: ${currentRoomId}`);
        router.push(`/canvas/${currentRoomId}`);
    };

    const greetingsTime = () => {
        const currTime = new Date().getHours();
        
        if (currTime >= 5 && currTime < 12) {
            setCurrTime("Good Morning");
        } else if (currTime >= 12 && currTime < 17) {
            setCurrTime("Good Afternoon")
        } else if (currTime >= 17 && currTime < 20) {
            setCurrTime("Good Evening")
        } else {
            setCurrTime("Welcome")
        }
    };

    const updateLastActiveTime = () => {
        // Get previous last active time
        const prevTime = localStorage.getItem('lastActiveTime');
        const now = new Date();
        
        // Format the previous time for display
        if (prevTime) {
            const prevDate = new Date(prevTime);
            const diffHours = Math.floor((now.getTime() - prevDate.getTime()) / (1000 * 60 * 60));
            
            let timeText = "";
            if (diffHours < 1) {
                const diffMinutes = Math.floor((now.getTime() - prevDate.getTime()) / (1000 * 60));
                timeText = diffMinutes <= 1 ? "Just now" : `${diffMinutes} minutes ago`;
            } 
            else if (diffHours < 24) {
                timeText = `${diffHours} hours ago`;
            }
            else {
                const diffDays = Math.floor(diffHours / 24);
                timeText = `${diffDays} days ago`;
            }
            
            setLastActiveTime(timeText);
        }
        
        // Update with current time
        localStorage.setItem('lastActiveTime', now.toISOString());
    };

     useEffect(() => {
        const initializeDashboard = async () => {
            try {
                // Check if we have a NextAuth session but no JWT
                //@ts-ignore
                if (session?.backendToken && !localStorage.getItem('token')) {
                    //@ts-ignore
                    localStorage.setItem('token', session.backendToken);
                    //@ts-ignore
                    localStorage.setItem('username', session.userData.username);
                }
                
                // If no auth at all, redirect to login
                //@ts-ignore
                if (!localStorage.getItem('token') && !session?.backendToken) {
                    router.push('/');
                    return;
                }

                // Fetch all required data
                const storedUsername = localStorage.getItem("username");
                setUsername(storedUsername);
                greetingsTime();
                await fetchRooms();
                
            } catch (error) {
                console.error("Initialization error:", error);
                // Handle error (maybe redirect to login)
                router.push('/');
            } finally {
                setIsInitializing(false);
            }
        };
        
        initializeDashboard();
        updateLastActiveTime();

    }, [session, router]);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        setUsername(storedUsername);
        greetingsTime();
        fetchRooms();
    }, []);
  
    useEffect(() => {
      // Check if we have a NextAuth session but no JWT
      //@ts-ignore
      if (session?.backendToken && !localStorage.getItem('token')) {
        //@ts-ignore
        localStorage.setItem('token', session.backendToken);
        //@ts-ignore
        localStorage.setItem('username', session.userData.username);

      }
      
      // If no auth at all, redirect to login
      //@ts-ignore
      if (!localStorage.getItem('token') && !session?.backendToken) {
        router.push('/');
      }
    }, [session, router]);

    if (isInitializing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <Loader className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold">Preparing your dashboard</h2>
                    <p className="text-blue-100/60 mt-2">Please wait while we load your data</p>
                </div>
            </div>
        );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar onLogout={handleLogOut} />
          
          <main className="py-10">
            {/* Welcome Section */}
            <section className="mb-12">
              <div className="relative">
                <div className="absolute -left-4 -top-4 w-20 h-20 bg-blue-500/30 rounded-full blur-xl"></div>
                <div className="absolute right-20 top-10 w-12 h-12 bg-purple-500/20 rounded-full blur-lg"></div>
                
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                    {currTime} {username?.split(" ")[0]?.replace(/^./, c => c.toUpperCase()) || "User"}
                  </span>
                </h1>
                
                <p className="mt-2 text-lg text-blue-100/80">
                  Ready to collaborate? Your digital canvas awaits.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 flex items-center">
                  <div className="p-3 bg-blue-600/20 rounded-lg mr-4">
                    <PanelRight className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-blue-100/60 text-sm">Active Rooms</p>
                    <p className="text-2xl font-semibold">{rooms.length}</p>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 flex items-center">
                  <div className="p-3 bg-purple-600/20 rounded-lg mr-4">
                    <Clock className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-blue-100/60 text-sm">Recent Activity</p>
                    <p className="text-2xl font-semibold">{lastActiveTime}</p>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 flex items-center">
                  <div className="p-3 bg-emerald-600/20 rounded-lg mr-4">
                    <Activity className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-blue-100/60 text-sm">Room Status</p>
                    <p className="text-2xl font-semibold">All Active</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Rooms List */}
              <section className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <PanelRight className="w-5 h-5 text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight">Your Rooms</h2>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-300">
                    {rooms.length} Active
                  </span>
                </div>
                
                <div className="divide-y divide-white/5 h-[400px] overflow-y-scroll scrollbar-dark">
                  {rooms.length > 0 ? (
                    rooms.map((room) => (
                      <RoomCard key={room.id} room={room} onJoin={joinRoom} />
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-blue-100/60">No active rooms yet</p>
                      <p className="text-sm text-blue-100/40 mt-1">Create your first room to get started</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Create Room */}
              <CreateRoomCard 
                roomName={roomSlag}
                setRoomName={setRoomSlag}
                loading={loading}
                error={error}
                onSubmit={handleSubmit}
              />
            </div>
          </main>
        </div>
      </div>
    );
}

export default App;