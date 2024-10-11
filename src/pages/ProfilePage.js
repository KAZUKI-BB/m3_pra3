import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";

// ProfilePageコンポーネントの定義
const ProfilePage = () => {
    // 状態変数定義
    const [username, setUsername] = useState('');// ユーザー名の保持
    const [nickname, setNickname] = useState('');// ニックネームの保持
    const [error, setError] = useState('');// エラーメッセージを保持
    const navigate = useNavigate();// ルーティング

    // コンポーネントのマウント時にプロフィール情報を取得
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token'); // ローカルストレージからトークンを取得
                const response = await fetch('http://localhost:8085/api/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('プロフィール情報の取得に失敗しました');
                }

                const data = await response.json();
                setUsername(data.username); // APIから取得したユーザー名
                setNickname(data.nickname); // APIから取得したニックネーム
            } catch (error) {
                setError('プロフィール情報の取得に失敗しました');
            }
        };

        fetchProfile(); // プロフィール情報の取得開始
    }, []); // マウント時に一度だけ実行される

    // プロフィール更新用関数
    const handleUpdate = async () => {
        // ユーザー名の検証
        if (username.length < 5 || !/^[a-zA-Z0-9]+$/.test(username)) {
            setError('ユーザー名が不正です');
            return;
        }
        // ニックネームの検証
        if (nickname.length < 4) {
            setError('ニックネームが不正です');
            return;
        }
        setError(''); // エラーがない場合はエラーメッセージをクリア

        try {
            const token = localStorage.getItem('token'); // ローカルストレージからトークンを取得
            const response = await fetch('http://localhost:8085/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ username, nickname }), // 更新するデータ
            });

            if (!response.ok) {
                throw new Error('プロフィールの更新に失敗しました');
            }

            navigate('/select'); // 更新成功したら/selectページに遷移
        } catch (error) {
            setError('プロフィールの更新に失敗しました');
        }
    };

    return (
        <RequireAuth>
            <div>
                <h1>Profile Setting</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <button onClick={handleUpdate}>Update</button>
            </div>
        </RequireAuth>
    );
};

export default ProfilePage;
