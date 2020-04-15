const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const jwt = require('jsonwebtoken');
const passport = require('passport');


class courseController extends controller {
    async createToken(req, res, next) {
        const token = await jwt.sign({ id: '123456789' }, "secertKey", { expiresIn: 60 * 2 });
        res.json({
            data: token,
            status: " success"
        })
    }

    async verifyToken(req, res, next) {
        const decode = jwt.verify(req.params.token, "secertKey")
        res.json({
            data: decode,
            status: 'success'
        })
    }

    async course(req, res, next) {
        const course = await Course.findOneAndUpdate({ _id : req.params.course }, { $inc: { viewCount: 1 } }).populate([{
            path: 'user',
            select: 'name'
        }, {
            path: 'episodes'
        }

        ]).exec();

        passport.authenticate('jwt', { session : false }, (err, user, msg) => {

                res.json({
                    data : this.filtercourseData(course, user),
                    status : 'success'
                })

        }) (req, res, next)
    }

    filtercourseData(course, user) {
        return {
            id : course.id,
            title : course.title,
            body : course.title,
            type : course.type,
            episodes : course.episodes.map(episode => {
                return {
                    id : episode.id,
                    title :episode.title,
                    body : episode.body,
                    type : episode.type,
                    videoUrl : episode.download( !! user, user)
                }
            })
        }
    }

}



module.exports = new courseController();