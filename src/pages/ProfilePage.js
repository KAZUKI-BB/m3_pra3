import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";

const ProfilePage = () => {
    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            setUsername('current_username');
            setNickname('current_nickname');
        };

        fetchProfile();
    }, []);

    const handleUpdate = async () => {
        if (username.length < 5 || !/^[a-zA-Z0-9]+$/.test(username)) {
            setError('Username is bad');
            return;
        }
        if (nickname.length < 4) {
            setError('Username is bad');
            return;
        }
        setError('');

        try {
            navigate('/select');
        } catch (error) {
            setError('Faild to update profile');
        }
    };

    return (
        <RequireAuth>
            <div>
                <h1>Profile Setting</h1>
                {error && <p style={{ error: 'red' }}>{error}</p>}
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                <input type="text" placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)}></input>
                <button onClick={handleUpdate}>Update</button>
            </div>
        </RequireAuth>
    )

}

export default ProfilePage;