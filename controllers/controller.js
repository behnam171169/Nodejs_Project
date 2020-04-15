const autoBind = require('auto-bind');
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const { validationResult } = require('express-validator');
const sprintf = require('sprintf');
module.exports = class controller {
    constructor() {
        autoBind(this);
        this.users = [];
        this.setRecptcha();
    }

    setRecptcha() {
        this.recaptcha = new Recaptcha(config.service.RECAPTCHA.SITE_KEY, config.service.RECAPTCHA.SECRET_KEY, { ...config.service.RECAPTCHA.options });
    }

    RecaptchaVaildation(req, res) {
        return new Promise((resolve, reject) => {
            this.recaptcha.verify(req, (err, data) => {
                if (err) {
                    req.flash('errors', 'گزینه امنیتی فعال نمی باشد');
                    this.back(req, res);
                } else {
                    resolve(true)
                }
            })
        })
    }

    async validationData(req) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const errors = result.array();
            const message = [];
            errors.forEach(err => { message.push(err.msg) })
            req.flash('errors', message);
            return false
        }

        return true;
    }

    back(req, res) {
        return res.redirect(req.header('Referer') || '/');
    }

    getTime(episodes) {
        let second = 0;
        episodes.forEach(episode => {
            let time = episode.time.split(":");
            if (time.length === 2) {
                second += parseInt(time[0]) * 60;
                second += parseInt(time[1]);
            } else if (time.length === 3) {
                second += parseInt(time[0]) * 3600;
                second += parseInt(time[1]) * 60;
                second += parseInt(time[2]);
            }
        });

        let hour = Math.floor(second / 3600);
        let minute = Math.floor((second / 60) % 60);
        second = Math.floor(second % 60);

        return sprintf("%02d:%02d:%02d", hour, minute, second);
    }

    alert(req, data) {
        let title = data.title,
            text = data.text,
            type = data.type

        req.flash('sweetalert' , { title, text, type})
    }

    error(message, status = 500) {
        let err = new Error(message);
        err.status = status;
        throw err;
    }
}