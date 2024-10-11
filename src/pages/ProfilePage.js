import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";

const ProfilePage = () => {
    const [username, setUsername] = useState(''); // ユーザー名の状態
    const [nickname, setNickname] = useState(''); // ニックネームの状態
    const [error, setError] = useState(''); // エラーメッセージの状態
    const navigate = useNavigate(); // ルーティング用のフック

    // プロフィール情報をAPIから取得
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token'); // トークンをローカルストレージから取得
                const response = await fetch('http://localhost:8086/api/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('プロフィール情報の取得に失敗しました');
                }

                const data = await response.json();
                setUsername(data.profile.username); // APIから取得したユーザー名をセット
                setNickname(data.profile.nickname); // APIから取得したニックネームをセット
            } catch (error) {
                setError('プロフィール情報の取得に失敗しました');
            }
        };

        fetchProfile(); // コンポーネントのマウント時にAPIコールを実行
    }, []);

    // プロフィール更新用関数
    const handleUpdate = async () => {
        // ユーザー名のバリデーション
        if (username.length < 5 || !/^[a-zA-Z0-9]+$/.test(username)) {
            setError('ユーザー名が不正です。5文字以上で、英数字のみ使用してください');
            return;
        }
        // ニックネームのバリデーション
        if (nickname.length < 4) {
            setError('ニックネームが不正です。4文字以上である必要があります');
            return;
        }

        setError(''); // バリデーションエラーがない場合はエラーをクリア

        try {
            const token = localStorage.getItem('token'); // トークンを取得
            const response = await fetch('http://localhost:8086/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ username, nickname }), // 更新するデータ
            });

            if (!response.ok) {
                const data = await response.json();
                if (data.message === 'The username is already taken.') {
                    setError('このユーザーネームは既に使用されています');
                } else {
                    throw new Error('プロフィールの更新に失敗しました');
                }
                return;
            }

            const data = await response.json();
            localStorage.setItem('token', data.token); // 新しいトークンをローカルストレージに保存

            navigate('/select'); // 成功した場合、選択画面に遷移
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
