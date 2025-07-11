const Minio = require('minio');
const { CONFIG } = require('./config');

const client = new Minio.Client({
    endPoint: CONFIG.S3.ENDPOINT,
    port: CONFIG.S3.PORT,
    useSSL: true,
    accessKey: CONFIG.S3.ACCESS_KEY,
    secretKey: CONFIG.S3.SECRET_KEY
});

module.exports = { MinioClient: client };