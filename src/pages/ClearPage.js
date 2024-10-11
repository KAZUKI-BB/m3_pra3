import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";
import axios from "axios"; // API呼び出しのためにaxiosをインポート

const ClearPage = () => {
    const [ranking, setRanking] = useState([]);
    const navigate = useNavigate();

    // ランキングデータの取得
    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const token = localStorage.getItem('token'); // トークンをローカルストレージから取得
                const response = await axios.get('http://localhost:8086/api/results', {
                    headers: {
                        Authorization: `Bearer ${token}`, // 認証トークンをヘッダーに追加
                    }
                });

                if (response.status === 200) {
                    const sortedRanking = response.data.sort((a, b) => a.time - b.time).slice(0, 3); // 経過時間でソートし上位3つを取得
                    setRanking(sortedRanking);
                }
            } catch (error) {
                console.error("ランキングデータ取得エラー:", error);
            }
        };

        fetchRanking(); // コンポーネントのマウント時にランキングデータを取得
    }, []);

    const handleReplay = () => {
        navigate('/select');
    };

    return (
        <RequireAuth>
            <div>
                <h1>Clear Page</h1>
                <h2>Congratulations! You cleared the game.</h2>
                <h2>Ranking</h2>
                <ul>
                    {ranking.map((item, index) => (
                        <li key={index}>
                            {index + 1}.{item.user} - {Math.floor(item.time / 60)}:{item.time % 60}
                        </li>
                    ))}
                </ul>
                <button onClick={handleReplay}>Replay</button>
            </div>
        </RequireAuth>
    );
};

export default ClearPage;
