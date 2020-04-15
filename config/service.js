module.exports={
    RECAPTCHA:{
        SITE_KEY:process.env.RECAPTCHA_SITE_KEY,
        SECRET_KEY:process.env.RECAPTCHA_SECRET_KEY,
        OPTION:{
            h1:'fa'
        }
    },
    // GOOGLE:{
    //     CLIENT_ID:process.env.CLIENT_ID,
    //     CLIENT_SECERT:process.env.CLIENT_SECERT,
    //     CALLBACK_URL:'http://localhost:5000/auth/google/callback'
    // }
}