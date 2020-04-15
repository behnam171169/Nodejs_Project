const controller = require('app/http/controllers/controller');
const Froum = require('app/models/froum');

class froumController extends controller {
    async index(req, res, next) {
        try {
            const froums = await Froum.paginate({}, {limit : 10, sort : { createdAt : 1}, populate : { path : 'questions'}});
            res.render('admin/froum/index', { froums })
        } catch (err) {
            next(err)
        }
    }

    async create(req, res, next) {
        res.render('admin/froum/create');
    }

    async edit(req, res, next) {
        const froum = await Froum.findById(req.params.id);
        res.render('admin/froum/edit', { froum });
    }

    async store(req, res, next) {
        let result = await this.validationData(req);
        if (result) {
            this.storeProcess(req, res, next);
        } else {
            this.back(req, res);
        }
    }

    async storeProcess(req, res, next) {

        const addfroum = new Froum({
            user: req.user._id,
            ...req.body
        })

        await addfroum.save(err => { console.log(err) });
        res.redirect('/admin/froum');
    }

    async update(req, res, next) {
        let result = await this.validationData(req);
        if (result) {
            this.updateProcess(req, res, next);
        } else {
            this.back(req, res);
        }
    }

    async updateProcess(req, res, next) {

        await Froum.findByIdAndUpdate(req.params.id, { $set: { ...req.body } });
        return res.redirect('/admin/froum');
    }

    async destroy(req, res, next) {
        let froum = await Froum.findById(req.params.id);
        if ( ! froum) {
            res.json('چنین لنجمنی در سایت ثبت نشده است')
        }

        froum.remove();

        return res.redirect('/admin/froum');
    }
}



module.exports = new froumController();