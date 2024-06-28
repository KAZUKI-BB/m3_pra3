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
            setTotalPlayTime(1111);
        };

        // プロフィール情報の取得を実行
        fetchProfile();
    }, []);// 初回レンダリング時のみの実行


    const handleLogout = () =>{
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
                <h1>ログイン成功</h1>
                <button onClick={handleLogout}>ログアウト</button>
            </div>
        </RequireAuth>
    );
};

export default SelectPage;
