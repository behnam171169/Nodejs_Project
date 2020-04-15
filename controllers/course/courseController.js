const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const Category = require('app/models/category');
const Payment = require('app/models/payment');
const User = require('app/models/users');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const faker = require('faker');
const request = require('request-promise');

class courseController extends controller {
    async index(req, res, next) {
        // //faker
        // for(let i=0;i<50;i++){
        //     const addCourse = new Course({
        //         user : req.user._id,
        //         title : faker.name.title(),
        //         body : faker.lorem.text(),
        //         slug : faker.lorem.slug(),
        //         type : 'free',
        //         price : faker.commerce.price(),
        //         images : faker.image.imageUrl(),
        //         tags : faker.lorem.words()
        //     })

        //     addCourse.save();
        // }

        // const perPage = 9;
        // const page = req.query.page || 1;
        // await Course.find({}).skip((perPage * page) - perPage).limit(perPage).exec((err, courses)=>{
        //     if(err) console.log(err);
        //     Course.count().exec((err,count)=>{
        //         res.render('admin/course/index', {
        //             courses,
        //             page,
        //             pages : Math.ceil(count / perPage)
        //         })
        //     })
        // });

        let page = req.query.page || 1;
        const courses = await Course.paginate({}, { page, limit: 10, sort: { createAt: 1 } });

        this.alert(req, {
            type: 'info',
            title : 'دوره ها',
            text : 'در صفحه مدیریت دوره ها هستید'
        })

        res.render('admin/course/index', { courses })

    }

    async create(req, res, next) {
        const categories = await Category.find({});
        res.render('admin/course/create', { categories });
    }

    async edit(req, res, next) {
        const course = await Course.findById(req.params.id);
        const categories = await Category.find({});

        res.render('admin/course/edit', { course, categories });
    }

    async store(req, res, next) {
        let result = await this.validationData(req);
        if (result) {
            this.storeProcess(req, res, next);
        } else {
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
            this.back(req, res);
        }
    }

    storeProcess(req, res, next) {
        let images = this.resizeImage(req.file)
        let { title, body, type, price, tags } = req.body;
        const addcourse = new Course({
            user: req.user._id,
            title,
            slug: this.slug(title),
            images,
            body,
            type,
            price,
            tags
        })

        addcourse.save(err => { console.log(err) });
        res.redirect('/admin/course');
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, '-')
    }

    getDirImage(dir) {
        return dir.substring(8);
    }

    async update(req, res, next) {
        let result = await this.validationData(req);
        if (result) {
            this.updateProcess(req, res, next);
        } else {
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
            this.back(req, res);
        }
    }

    async updateProcess(req, res, next) {

        let imageUrl = {};

        if (req.file) {
            imageUrl.images = this.resizeImage(req.file);
        }
        delete req.body.images
        await Course.findByIdAndUpdate(req.params.id, { $set: { ...req.body, ...imageUrl } });

        return res.redirect('/admin/course');
    }

    async destroy(req, res, next) {
        let course = await Course.findById(req.params.id).populate('episodes').exec();
        if (!course) {
            res.json('چنین دوره ای در سایت ثبت نشده است')
        }

        // delete episode
        course.episodes.forEach(episode => episode.remove());

        Object.values(course.images).forEach(image => fs.unlinkSync(`./public${image}`));

        course.remove();

        return res.redirect('/admin/course');
    }

    resizeImage(image) {
        const imagePath = path.parse(image.path);
        let imageUrl = {};
        imageUrl['original'] = this.getDirImage(`${image.destination}/${image.filename}`);

        let resize = size => {
            const imageName = `${imagePath.name}-${size}${imagePath.ext}`;
            imageUrl[size] = this.getDirImage(`${image.destination}/${imageName}`);

            sharp(image.path)
                .resize(size, null)
                .toFile(`${image.destination}/${imageName}`)
        }

        [1080, 720, 480, 360].map(resize);

        return imageUrl;
    }


    async allCourse(req, res, next) {
        let page = req.query.page || 1

        let query = {};
        if (req.query.search)
            query.title = new RegExp(req.query.search, 'gi');
        if (req.query.type && req.query.type != 'all')
            query.type = req.query.type;
        if (req.query.category && req.query.category != 'all') {
            let category = await Category.findOne({ slug: req.query.category });
            if (category) {
                query.categories = { $in: [category.id] }
            }
        }

        const categories = await Category.find({ parent: null }).populate('childs').exec();
        const courses = await Course.paginate({ ...query }, { page, limit: 16, sort: { createdAt: req.query.old || -1 } });
        res.render('home/page/courses', { courses, categories });
    }

    async payment(req, res, next) {
        const course = await Course.findById(req.body.course);
        if (!course) {
            res.json('چنین دوره ای وجود ندارد');
        }

        if (req.user.checkpayCash(course.id)) {
            res.json('این دوره شما قبلا خریداری نموده اید')
        }

        if (course.price == 0 && (course.type == 'vip' || course.type == 'free')) {
            res.json('خریداری این دوره امکان پذیر نیست')
        }

        // pay process

        let params = {
            MerchantID: '97221328-b053-11e7-bfb0-005056a205be',
            Amount: course.price,
            CallbackURL: 'http://localhost:3000/course/payment/callbackurl',
            Description: `حرید دوره ${course.title}`,
            Email: req.user.email,
        }

        let options = this.getOptions('https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json', params);

        request(options)
            .then(async data => {
                const addPayinfo = new Payment({
                    user: req.user.id,
                    course: course.id,
                    resnumber: data.Authority,
                    price: course.price
                })

                await addPayinfo.save();
                res.redirect(`https://www.zarinpal.com/pg/StartPay/${data.Authority}`);
            })
            .catch(err => res.json(err.message));

    }

    async callbackurl(req, res, next) {
        const payment = await Payment.findOne({ resnumber: req.query.Authority }).populate('course').exec();
        if (!payment.course) {
            res.json('not course')
        }

        if (req.query.Status && req.query.Status != 'OK') {
            res.json('not ok')
        }

        let params = {
            MerchantID: '97221328-b053-11e7-bfb0-005056a205be',
            Authority: req.query.Authority,
            Amount: payment.course.price,
        }

        let options = this.getOptions('https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json', params);

        request(options)
            .then(async data =>{
                if(data.Status == 100){
                    payment.set({ payment : true});
                    await User.updateOne({'_id' : req.user.id} , { $set : { payCash : payment.course.id }});
                    await payment.save();

                    res.redirect(payment.course.path());
                }else {
                    res.json('payment not execute')
                }
            })
            .catch(err => res.json(err.message))


    }

    getOptions(url, params) {
        return {
            method: 'POST',
            url: url,
            header: {
                'cache-control': 'no-cache',
                'content-type': 'application/json'
            },
            body: params,
            json : true
        }
    }

}



module.exports = new courseController();