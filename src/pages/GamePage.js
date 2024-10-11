import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";

const GamePage = () => {
    const [time, setTime] = useState(0);
    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
    const [field, setField] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const difficulty = new URLSearchParams(location.search).get('difficulty');

    // フィールドをAPIから取得
    useEffect(() => {
        const fetchField = async () => {
            try {
                const response = await fetch('/api/fields', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                const data = await response.json();
                setField(data.objects);
            } catch (error) {
                console.error('フィールド取得エラー:', error);
            }
        };
        fetchField();

        const timer = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleKeyDown = useCallback((e) => {
        const { x, y } = playerPosition;
        let newX = x;
        let newY = y;

        if (e.key === 'ArrowUp') {
            newY -= 1;
        } else if (e.key === 'ArrowDown') {
            newY += 1;
        } else if (e.key === 'ArrowLeft') {
            newX -= 1;
        } else if (e.key === 'ArrowRight') {
            newX += 1;
        }

        if (newY < 0 || newY >= field.length) {
            return;
        }
        if (
            newY >= 0 &&
            newX >= 0 &&
            newY < field.length &&
            newX < (field[newY] ? field[newY].length : 0) &&
            field[newY][newX] !== 'W'
        ) {
            if (field[newY][newX] === 'B') {
                const blockNewX = newX + (newX - x);
                const blockNewY = newY + (newY - y);

                if (
                    blockNewX >= 0 &&
                    blockNewY >= 0 &&
                    blockNewX < field.length &&
                    blockNewY < (field[blockNewY] ? field[blockNewY].length : 0) &&
                    field[blockNewY][blockNewX] === ''
                ) {
                    const newField = field.map((row) => [...row]);
                    newField[newY][newX] = '';
                    newField[blockNewY][blockNewX] = 'B';
                    setField(newField);
                    setPlayerPosition({ x: newX, y: newY });
                }
            } else {
                setPlayerPosition({ x: newX, y: newY });
            }
        }

        if (field[newY][newX] === 'F') {
            saveResult();
            navigate('/clear');
        }
    }, [playerPosition, field, navigate]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const saveResult = async () => {
        try {
            const response = await fetch('/api/results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ block_moves: 0, time }), // ここで必要なデータを送信
            });
            if (!response.ok) {
                throw new Error('結果の送信に失敗しました');
            }
        } catch (error) {
            console.error('結果送信エラー:', error);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <RequireAuth>
            <div>
                <h1>GamePage - Difficulty: {difficulty}</h1>
                <p>Time: {formatTime(time)}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 50px)', gap: '5px' }}>
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
                                {cell === 'B' ? 'B' : cell === 'W' ? 'W' : cell === 'F' ? 'F' : ''}
                            </div>
                        ))
                    ))}
                </div>
            </div>
        </RequireAuth>
    );
};

export default GamePage;
