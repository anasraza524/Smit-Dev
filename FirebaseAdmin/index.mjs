import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import admin from 'firebase-admin';


let serviceAccount ={
    "type": "service_account",
    "project_id": "e-mars-store",
    "private_key_id": "99305988980779e4120f20689044ae46764c9ee5" ,
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCROv8Qv4kwO0CU\n3R5kZKtNjYRrycjiFx6n5qi2lFD5SICOs0PdC45Q9SkyDUZQUrzSRBtXJZDtIIsu\n9pNSZ+Kd4WrInFbTuYXEMipjNvP0BIAHEgotRBDd7gkgklPqvby7QbkwzChdbFFE\nQhJkDV92YYgSgPgZO5bE3NuttIpsiGFaHoqZgNQWwL29hVgGAfT8GrBec6s7kJT/\nPJVqrV5uOmXzaawa0ysiQHGMntFg+JdcQV1+dW+YqtM3lnd6ujWbl+oDYLTo4l3t\nHGyU1AUYdXjmYGGyee3L568p5MyLwJDM/kZzMm/2vdPKu9r62/CL5B62VNoIhvRA\nmBWCX6exAgMBAAECggEALu2qaAYMVYp/9tpwrK4e8INvK8lbYTtpS4XsNHs+ox67\nc+EXZ8EJLr3ZnvPNKb1iiGs7jnB0ITun3fgNaM5q2utxLvvdzrKfN+Oh8MdcExi1\nKhO5OCFLdfsp9d1ywmKnLrcxGUSPMokCxZS4Dp6Hn2AqsRf9k2G++UQItFuncyQt\n97DwyaEuK9q9VIAUPHWSJl4a/aUuS4D+pIyNBF1JOUOmFUwDcQoAoUTMnrdK0GO4\nLh5osh9egNiBwn5MlhgpQLQqRuFoQq/xA/Zi4s87ByfNnsri2o71MnzfSvGX3GdR\nwdA4Ki1xCb2bnDjTIEEDfD41sMEH8/2JxFYtS302BQKBgQDEDjfegRtqBGUm6wMY\nUj7N9NkNFQzI8bopdiKD0YT0TlGTUlAueMCGCZWIP/DKQQ5VedWDskWX+/trvRm+\neMeXggLBlrNTIGXeM0JDTnjzdji7CZqyVEv5wgzqmGSOcsjR2F+43WUMopTQKgbP\nmR3Nueng/Y95eP6yG+PSdhjsVwKBgQC9opC0W2Q4UI379vBXwIGKUyIkinkBZWuU\nUN0G0PebFr9zkLfnGvo99yDyFOqMicS0DRANYqDpS4jMTBpCm3OfbmpQ8eW2jBPE\nWqM7hrbGXZN9943stkulUwaj1a6Umn6qKVy08Nigtl9GjV9O2OXyZv9IaJQk18Fw\nuOMANtWHNwKBgEU7nCEXyH2Etc+rd/lTudfzGd7TyyL+sbXIgOG50FCRg58ZlzUB\n8UKkCckGg1p45L3seyi5gHfuRNfD/F5Vum3XPG/ubr7xFugDg+fOw0l+OwRZnOZS\nfE3jZ7pEPGZNRHtOBGd8zx1KIHDuFl+i+3JVr7CC+fJ0dsSgsq/0glKbAoGAe9vT\nMcnDgriylBCs2FPnCCbWVRGQiWXpxxyt0IbqQoSwFVY/l5XaPmDMRvF8ZMCTFpq1\nkliKCvaH6hAG0txfv5FJpYbpZ7rEKmqc1QNfG98At7TaIPLMI7Y/zwCBH5RtCM0t\nPQ1WIFodjqJFzuUCA7pcILoVkJ7PPMW1lm06OC8CgYEAj3m9/tpWXT/njszDPx2U\noCtdpVdeCu66GwF2vxFX5WygmdSTWdTSGwhPYCvHT/1oCH/n1nKfIaMIIoA43zfa\nTM4oZevGaFTbroHwZ2mhlQHbAt2g9A+RiojsIx7gn9Zjq0RzsAictq/e452/QR9r\nXVi383E1/2LEeTA4MqutMdE=\n-----END PRIVATE KEY-----\n" ,
    "client_email": "firebase-adminsdk-i2vua@e-mars-store.iam.gserviceaccount.com",
    "client_id": "106283487505884159840" ,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth" ,
    "token_uri": "https://oauth2.googleapis.com/token" ,
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-i2vua%40e-mars-store.iam.gserviceaccount.com"
  }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.databaseURL
});
const bucket = admin.storage().bucket(process.env.bucketLink);

export default bucket;