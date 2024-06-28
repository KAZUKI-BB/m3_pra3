import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";

const ProfilePage = () => {
    const [username,setUsername] = useState('');
    const [nickname,setNickname] = useState('');
    const [error,setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            setUsername('current_username');
            setNickname('current_nickname');
        };

        fetchProfile();
    },[]);

    const handleUpdate = ssync () => {
        if (username.length < 5 || !/^[a-zA-Z0-9]+$/.test(username)){
            
        }
    }
}