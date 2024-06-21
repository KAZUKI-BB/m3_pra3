// 各フックのインポート
import React, { useState } from "react";
import { login } from '../api/auth'
import { useNavigate } from 'react-router-dom'

const StartPage = () => {
    // ユーザ名とパスワードを保存するステートの宣言
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // ページ遷移に使うuseNavigate関数の取得
    const navigate = useNavigate();

    // ログインボタンクリックでhandleLogin関数を呼び出し
    const handleLogin = async () => {
        // 以下try&catch文
        try {
            // ogin関数を呼び出して認証、トークンを取得
            const token = await login(username, password);
            // 認証成功後セッションをストレージに保存
            sessionStorage.setItem('authToken', token);
            // selectページに遷移
            navigate('/select');
        } catch (error) {
            // 認証失敗時にはエラーメッセージをアラート表示
            alert(error.message);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default StartPage;


