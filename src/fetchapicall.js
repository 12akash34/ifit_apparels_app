export const fetchGetCall = async () => {
    const response = await fetch('https://127.0.0.1:5000/',{
        method: 'get',
    });
    const jsonRes = await response.json();
    return jsonRes;
};