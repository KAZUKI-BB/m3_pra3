// export const login = async (username, password) => {
//     try {
//         const response = await fetch('/api/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ username, password }),
//         });
//         if (!response.ok) {
//             throw new Error('The username or password is incorrect.');
//         }
//         const data = await response.json();
//         return data.token;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };


export const login = async (username, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === 'user' && password === 'password') {
                resolve({ token: 'dummy-token' });
            } else {
                reject(new Error('The username or password is incorrect.'));
            }
        }, 1000);
    });
};