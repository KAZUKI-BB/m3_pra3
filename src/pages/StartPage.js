// 各フックのインポート
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // API呼び出しのためにaxiosをインポート

const StartPage = () => {
    // ユーザ名とパスワードを保存するステートの宣言
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // ページ遷移に使うuseNavigate関数の取得
    const navigate = useNavigate();

    // ログインボタンクリックでhandleLogin関数を呼び出し
    const handleLogin = async () => {
        try {
            // ログインAPIにPOSTリクエストを送信し、トークンを取得
            const response = await axios.post('http://localhost:8086/api/auth/login', { username, password });
            const token = response.data.token;

            // 認証成功後にトークンをセッションストレージに保存
            sessionStorage.setItem('authToken', token);

            // selectページに遷移
            navigate('/select');
        } catch (error) {
            // 認証失敗時にはエラーメッセージをアラート表示
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('ログインに失敗しました。');
            }
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default StartPage;
