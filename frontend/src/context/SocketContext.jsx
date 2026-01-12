import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { SOCKET_URL } from '../config/api';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const userId = user?.user?.id || user?.id;

    useEffect(() => {
        // Connect to socket server
        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket && userId) {
            // Join user's personal room
            socket.emit('join', userId);

            // Listen for 'hired' notification
            socket.on('hired', (data) => {
                toast.success(`🎉 You have been hired for "${data.gigTitle}"!`, {
                    duration: 8000,
                    style: {
                        background: '#22c55e',
                        color: '#fff',
                        fontWeight: 'bold',
                        padding: '16px',
                        border: '3px solid #1a1a1a',
                    },
                });
            });

            // Listen for 'new_bid' notification (for gig owners)
            socket.on('new_bid', (data) => {
                toast(`📩 New bid on "${data.gigTitle}" from ${data.freelancerName}`, {
                    duration: 5000,
                    style: {
                        background: '#f97316',
                        color: '#fff',
                        fontWeight: 'bold',
                        padding: '16px',
                        border: '3px solid #1a1a1a',
                    },
                });
            });

            return () => {
                socket.off('hired');
                socket.off('new_bid');
            };
        }
    }, [socket, userId]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
