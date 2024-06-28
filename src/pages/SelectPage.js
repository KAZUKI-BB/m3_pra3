// 各フックのインポート
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RequireAuth from '../components/RequireAuth';

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
            setTotalPlayTime(11);
        };

        // プロフィール情報の取得を実行
        fetchProfile();
    }, []);// 初回レンダリング時のみの実行  

    // ログインボタン押下時の処理
    const handleLogout = () =>{
        // セッションストレージからauthTokenを削除
        sessionStorage.removeItem('authToken');
        // startpageに戻る
        navigate('/');
    };

    // プロフィールセッティングボタン押下時の処理
    const handleProfile = () => {
        // プロフィールセッティングページに遷移
        navigate('/profile');
    };

    // ゲームボタン押下時の処理
    const handleGame = (difficulty) =>{
        // URLに難易度を付けてゲームページに遷移
        navigate(`/game?difficulty=${difficulty}`);
    }

    return (
        <RequireAuth>
            <div>
                <h1>Select Page</h1>
                <p>Nickname: {nickname}</p>
                <p>Total Play Time: {totalPlayTime / 60} minutes</p>
                <button onClick={handleProfile}>Profile Settings</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div>
                <h2>Select Difficulty</h2>
                <button onClick={() => handleGame('easy')}>Easy</button>
                <button onClick={() => handleGame('medium')}>Medium</button>
                <button onClick={() => handleGame('hard')}>Hard</button>
            </div>
        </RequireAuth>
    );
};

export default SelectPage;
