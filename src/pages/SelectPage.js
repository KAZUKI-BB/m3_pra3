// 各フックのインポート
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RequireAuth from '../components/RequireAuth';
import axios from 'axios'; // API呼び出しのためにaxiosをインポート

const SelectPage = () => {
    // ニックネーム保存用のステート
    const [nickname, setNickname] = useState('');
    // 合計プレイ時間保存用のステート
    const [totalPlayTime, setTotalPlayTime] = useState(0);
    // ページ遷移用関数useNavigateの取得
    const navigate = useNavigate();

    // ページの読み込み時にプロフィール情報を取得
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token'); // トークンをローカルストレージから取得
                const profileResponse = await axios.get('http://localhost:8086/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (profileResponse.status === 200) {
                    setNickname(profileResponse.data.profile.nickname); // APIからニックネームを取得
                }

                const resultsResponse = await axios.get('http://localhost:8086/api/results', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (resultsResponse.status === 200) {
                    const totalSeconds = resultsResponse.data.reduce((acc, curr) => acc + curr.time, 0);
                    setTotalPlayTime(totalSeconds); // 合計プレイ時間を設定
                }

            } catch (error) {
                console.error('プロフィール情報の取得に失敗しました', error);
            }
        };

        // プロフィール情報の取得を実行
        fetchProfile();
    }, []); // 初回レンダリング時のみの実行

    // ログアウトボタン押下時の処理
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token'); // ローカルストレージからトークンを取得
            await axios.post('http://localhost:8086/api/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // トークンを削除し、スタートページに遷移
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error('ログアウトに失敗しました', error);
        }
    };

    // プロフィールセッティングボタン押下時の処理
    const handleProfile = () => {
        // プロフィールセッティングページに遷移
        navigate('/profile');
    };

    // ゲームボタン押下時の処理
    const handleGame = (difficulty) => {
        // URLに難易度を付けてゲームページに遷移
        navigate(`/game?difficulty=${difficulty}`);
    };

    return (
        <RequireAuth>
            <div>
                <h1>SelectPage</h1>
                <p>Nickname: {nickname}</p>
                <p>Total Play Time: {Math.ceil(totalPlayTime / 60)} minutes</p>
                <button onClick={handleProfile}>Profile Setting</button>
                <button onClick={handleLogout}>Logout</button>
                <div>
                    <h2>Select Difficulty</h2>
                    <button onClick={() => handleGame('easy')}>Easy</button>
                    <button onClick={() => handleGame('medium')}>Medium</button>
                    <button onClick={() => handleGame('hard')}>Hard</button>
                </div>
            </div>
        </RequireAuth>
    );
};

export default SelectPage;
