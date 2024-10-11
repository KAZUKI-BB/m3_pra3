import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";
import axios from "axios";

// GamePageコンポーネントの定義
const GamePage = () => {
    const [time, setTime] = useState(0); // 経過時間の保持
    const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 }); // プレイヤーの初期位置（フィールドの内側）
    const [field, setField] = useState([]); // ゲームフィールドの保持
    const [token, setToken] = useState(null); // 認証トークン
    const navigate = useNavigate(); // ルーティング用

    // フィールドデータをAPIから取得
    const fetchFieldData = async () => {
        try {
            const response = await axios.get("http://localhost:8086/api/fields", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const fieldData = response.data.objects;
            setField(fieldData);

            // フィールドからプレイヤーの初期位置を探す
            for (let y = 0; y < fieldData.length; y++) {
                for (let x = 0; x < fieldData[y].length; x++) {
                    if (fieldData[y][x] === 2) { // プレイヤーの初期位置は '2'
                        setPlayerPosition({ x, y });
                        return; // 見つけた時点でループを終了
                    }
                }
            }
        } catch (error) {
            console.error("フィールドデータ取得エラー:", error);
        }
    };

    // トークンの取得とフィールドの初期化
    useEffect(() => {
        const login = async () => {
            try {
                const response = await axios.post("http://localhost:8086/api/auth/login", {
                    username: "gorin",
                    password: "2023"
                });
                setToken(response.data.token);
            } catch (error) {
                console.error("ログインエラー:", error);
            }
        };
        login();
    }, []);

    useEffect(() => {
        if (token) {
            fetchFieldData();
        }
    }, [token]);

    // 経過時間のカウント
    useEffect(() => {
        const timer = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
        return () => clearInterval(timer); // クリーンアップ
    }, []);

    // キー入力の処理
    const handleKeyDown = useCallback((e) => {
        const { x, y } = playerPosition;
        let newX = x;
        let newY = y;

        if (e.key === 'ArrowUp') newY -= 1;
        else if (e.key === 'ArrowDown') newY += 1;
        else if (e.key === 'ArrowLeft') newX -= 1;
        else if (e.key === 'ArrowRight') newX += 1;

        // フィールド境界と障害物のチェック
        if (
            newY >= 0 && newY < field.length &&
            newX >= 0 && newX < field[newY].length &&
            field[newY][newX] !== 1 // 壁 '1' の場合は移動不可
        ) {
            if (field[newY][newX] === 3) { // ブロック '3' の場合はブロックを動かす
                const blockNewX = newX + (newX - x); // ブロックの次の座標
                const blockNewY = newY + (newY - y);

                if (
                    blockNewX >= 0 && blockNewX < field.length &&
                    blockNewY >= 0 && blockNewY < field[blockNewX].length &&
                    field[blockNewY][blockNewX] === 0 // ブロック移動先が空白か
                ) {
                    const newField = field.map((row) => [...row]); // フィールドのコピー
                    newField[newY][newX] = 0; // ブロック元の位置を空にする
                    newField[blockNewY][blockNewX] = 3; // ブロックの新しい位置
                    setField(newField); // フィールド更新
                    setPlayerPosition({ x: newX, y: newY }); // プレイヤーを更新
                }
            } else {
                setPlayerPosition({ x: newX, y: newY }); // 壁やブロックでないなら移動
            }
        }

        // プレイヤーがフラッグ（ゴール）に到達した場合
        if (field[newY][newX] === 4) {
            navigate('/clear'); // クリア画面に遷移
        }
    }, [playerPosition, field, navigate]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // 時間のフォーマット
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <RequireAuth>
            <div>
                <h1>GamePage</h1>
                <p>Time: {formatTime(time)}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 50px)', gap: '5px' }}>
                    {field.map((row, rowIndex) => (
                        row.map((cell, cellIndex) => (
                            <div
                                key={`${rowIndex}-${cellIndex}`}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    border: '1px solid black',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: playerPosition.x === cellIndex && playerPosition.y === rowIndex ? 'blue' : 'white'
                                }}
                            >
                                {cell === 1 ? 'W' : cell === 3 ? 'B' : cell === 4 ? 'F' : ''}
                            </div>
                        ))
                    ))}
                </div>
            </div>
        </RequireAuth>
    );
};

export default GamePage;

