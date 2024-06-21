// 各フックのインポート
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            //ダミーAPIでデータを取得
            setNickname('User1');
            setTotalPlayTime(1111);
        };

        // プロフィール情報の取得を実行
        fetchProfile();
    }, []);// 初回レンダリング時のみの実行

    // ログアウトボタン押下時の処理
    const handleLogout = () => {
        // セッションストレージから認証トークンを削除
        sessionStorage.removeItem('authToken');
        // スタートページへ遷移
        navigate('/')
    };

    return (
        <div>
            <h1>SelectPage</h1>
            <p>Nickname : {nickname}</p>
            <p>Total Play Time : {totalPlayTime / 60} min</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default SelectPage;
