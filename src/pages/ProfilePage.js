import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";

// ProfilePageコンポーネントの定義
const ProfilePage = () => {
    // 状態変数定義
    const [username, setUsername] = useState('');// ユーザー名の保持
    const [nickname, setNickname] = useState('');// ニックネームの保持
    const [error, setError] = useState('');// エラーメッセージを保持
    const navigate = useNavigate();// ルーティング用フック

    // コンポーネントのマウント時にプロフィール情報を取得
    useEffect(() => {
        const fetchProfile = async () => {
            setUsername('current_username');// ユーザー名のダミーデータ設定
            setNickname('current_nickname');// ニックネームのダミーデータ設定
        };

        fetchProfile();// プロフィール情報の取得開始
    }, []);// マウント時に一度だけ実行される

    // プロフィール更新用関数
    const handleUpdate = async () => {
        // ユーザー名の検証
        if (username.length < 5 || !/^[a-zA-Z0-9]+$/.test(username)) {
            setError('Username is bad');// 適当なエラメ
            return;
        }
        // ニックネームの検証
        if (nickname.length < 4) {
            setError('Username is bad');// 適当なエラメ
            return;
        }
        setError('');// エラーがない場合はエラーメッセージをクリア

        try {
            // APIを利用した更新処理はここに記述、今回は使ってないのでそのまま通す
            navigate('/select');// 更新成功したら/selectページに遷移
        } catch (error) {
            setError('Faild to update profile');// 更新失敗時にエラーメッセージを表示
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