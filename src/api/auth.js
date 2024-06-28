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