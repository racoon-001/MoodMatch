
const https = require("https");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const TMDB_BASE_URL =
    "https://api.themoviedb.org/3";


function httpsRequest(url) {

    return new Promise((resolve, reject) => {

        const request = https.get(
            url,
            {
                family: 4,
                ALPNProtocols: ["http/1.1"],
                headers: {
                    Accept: "application/json"
                }
            },
            response => {

                let data = "";

                response.on(
                    "data",
                    chunk => {
                        data += chunk;
                    }
                );

                response.on(
                    "end",
                    () => {

                        if (
                            response.statusCode < 200 ||
                            response.statusCode >= 300
                        ) {

                            reject(
                                new Error(
                                    `TMDB API error: ${response.statusCode} ${response.statusMessage}`
                                )
                            );

                            return;
                        }

                        try {

                            resolve(
                                JSON.parse(data)
                            );

                        } catch (error) {

                            reject(
                                new Error(
                                    "TMDB returned invalid JSON"
                                )
                            );

                        }

                    }
                );

            }
        );


        request.on(
            "error",
            reject
        );

    });

}


async function tmdbFetch(
    endpoint,
    params = {}
) {

    const url =
        new URL(
            `${TMDB_BASE_URL}${endpoint}`
        );


    url.searchParams.set(
        "api_key",
        TMDB_API_KEY
    );


    Object.entries(params).forEach(
        ([key, value]) => {

            url.searchParams.set(
                key,
                value
            );

        }
    );


    let attempts = 0;
    const maxAttempts = 3;


    while (attempts < maxAttempts) {

        attempts++;


        try {

            console.log(
                `TMDB request attempt ${attempts}/${maxAttempts}`
            );


            return await httpsRequest(url);


        } catch (error) {

            console.error(
                `TMDB attempt ${attempts} failed:`,
                error.code ||
                error.message
            );


            const retryableErrors = [
                "ECONNRESET",
                "UND_ERR_CONNECT_TIMEOUT",
                "UND_ERR_SOCKET",
                "ETIMEDOUT"
            ];


            const isRetryable =
                retryableErrors.includes(
                    error.code
                );


            if (!isRetryable) {

                throw error;

            }


            if (attempts >= maxAttempts) {

                throw error;

            }


            console.log(
                "Temporary TMDB connection error. Retrying..."
            );


            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        1500
                    )
            );

        }

    }

}


async function tmdbKeywordSearch(
    keyword
) {

    const data =
        await tmdbFetch(
            "/search/keyword",
            {
                query: keyword,
                page: 1
            }
        );


    const exactMatch =
        data.results.find(
            item =>
                item.name.toLowerCase() ===
                keyword.toLowerCase()
        );


    return exactMatch
        ? exactMatch.id
        : null;

}


module.exports = {
    tmdbFetch,
    tmdbKeywordSearch
};