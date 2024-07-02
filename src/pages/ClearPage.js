import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";

const ClearPage = () => {
    const [ranking, setRanking] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRanking = async () => {
            setRanking([
                {username: 'User1', time: 120},
                {username: 'User2', time: 150},
                {username: 'User3', time: 180},
            ]);
        };

        fetchRanking();
    },[]);

    const handleReplay = () => {
        navigate('/select');
    };

    return(
        <RequireAuth>
            <div>
                <h1>Clear Page</h1>
                <h2>Congratulations! You cleared the game.</h2>
                <h2>Ranking</h2>
                <ul>
                    {ranking.map((item, index) => (
                        <li key={index}>
                            {index + 1}.{item.username} - {Math.floor(item.time / 60)}:{item.time % 60}
                        </li>
                    ))}
                </ul>
                <button onClick={handleReplay}>Replay</button>
            </div>
        </RequireAuth>
    );
};

export default ClearPage;