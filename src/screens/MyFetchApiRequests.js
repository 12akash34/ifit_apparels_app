export const myFetchGetRequest = async () => {
    const response = await fetch('outimg.js');
    const resJson = await response.json();
    return resJson;
};

export const myFetchPostRequest = async (inimg) => {
    const response = await fetch('https://dummyjson.com/products/1', {
        method: 'POST',
        body: JSON.stringify({
            inimg: inimg
        }),
        headers: {
            'Content-type': 'application/json; charsetUTF-8',
        },
    });
    const resJson = await response.json();
    return resJson;
};