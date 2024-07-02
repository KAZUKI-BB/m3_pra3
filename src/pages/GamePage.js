import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";

// GamePageコンポーネントの定義
const GamePage = () => {
    // 状態変数定義
    const [time, setTime] = useState(0);// 経過時間の保持
    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });// プレイヤーの位置の保持
    const [field, setField] = useState([]);// ゲームフィールドの保持
    const navigate = useNavigate();// ルーティング用フック
    const location = useLocation();// URL情報取得フック
    const difficulty = new URLSearchParams(location.search).get('difficulty');// URLクエリから難易度を取得

    //コンポーネントのマウント時に一回だけ実行する処理
    useEffect(() => {
        // 初期ゲームフィールドを設定(APIは使わずダミー)
        setField([
            ['P', 'W', '', '', '', 'B', ''],
            ['', '', '', '', '', 'B', ''],
            ['', 'W', 'W', '', 'B', '', ''],
            ['', '', '', 'B', '', '', ''],
            ['W', '', 'W', '', 'B', 'B', ''],
            ['', '', '', '', 'B', 'F', ''],
            ['', '', 'B', 'B', '', '', ''],
        ]);

        // 1s毎に時間を加算するタイマーの設定
        const timer = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
        // クリーンアップ関数を返してタイマーのクリア
        return () => clearInterval(timer);
    }, []);// 依存リストが空なので、マウント時に一回のみ実行される

    // キー入力を処理する関数
    const handleKeyDown = useCallback((e) => {
        const { x, y } = playerPosition;// 現在のプレイヤー位置を取得
        let newX = x;// 最新のx座標
        let newY = y;// 最新のy座標

        // キー入力に応じて座標を再計算
        if (e.key === 'ArrowUp') {
            newY -= 1;
        } else if (e.key === 'ArrowDown') {
            newY += 1;
        } else if (e.key === 'ArrowLeft') {
            newX -= 1;
        } else if (e.key === 'ArrowRight') {
            newX += 1;
        }
        // Y座標チェック(記法：ガード節)
        if (newY < 0 || newY >= field.length) {
            return
        }
        // 最新のユーザー座標がフィールド内かつ障害物に該当しないかチェック
        if (
            newY >= 0 &&// 縦方向の始点の境界チェック
            newX >= 0 &&// 横方向の始点の境界チェック
            newY < field.length &&// 縦方向の終点の境界チェック
            newX < (field[newY] ? field[newY].length : 0) &&// 横方向の終点の境界チェック 
            field[newY][newX] !== 'W'// 壁に対する判定
        ) {
            // ブロックに対する判定
            if (field[newY][newX] === 'B'){
                const blockNewX = newX + (newX - x);// 移動後のブロックのX座標
                const blockNewY = newY + (newY - y);// 移動後のブロックのY座標

                if(
                    blockNewX >= 0 &&// 縦方向の始点の境界チェック
                    blockNewY >= 0 &&// 横方向の始点の境界チェック
                    blockNewX < field.length &&// 縦方向の終点の境界チェック
                    blockNewY < (field[blockNewY] ? field[blockNewY].length : 0) &&// 横方向の終点の境界チェック
                    field[blockNewY][blockNewX] === ''// 空白に対するチェック
                ){
                    const newField = field.map((row) => [...row]);// 新しいフィールドの設定
                    newField[newY][newX] = '';// ブロック移動前の座標を空白に
                    newField[blockNewY][blockNewX] = 'B';// 移動先座標にブロックを配置
                    setField(newField);// フィールドの更新
                    setPlayerPosition({x: newX, y: newY});// プレイヤー一の更新
                }
            }else{
                setPlayerPosition({ x: newX, y: newY });// プレイヤー位置の更新
            }
        }

        // プレイヤーがゴールに到達したかチェック
        if (field[newY][newX] === 'F') {
            navigate('/clear')// クリア画面に遷移
        }

    }, [playerPosition, field, navigate]);// 依存リストに必要な要素を追加 依存関係は配列リテラルなの忘れない！

    // イベントリスナーによるキー入力判定とクリーンアップ
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);// キー入力を検出
        return () => {
            window.removeEventListener('keydown', handleKeyDown);// コンポーネントのアンマウント時にリスナーを削除
        };
    }, [handleKeyDown]);// handleKeyDownが実行されるたびに再実行される

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // 秒数が一桁の場合にゼロ埋め
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