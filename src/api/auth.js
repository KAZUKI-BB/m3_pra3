export const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8085/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'ログインに失敗しました。');
      }
  
      const data = await response.json();
      // data: { token, username }
      return data;
    } catch (error) {
      throw new Error(error.message || 'サーバーへの接続中にエラーが発生しました。');
    }
  };