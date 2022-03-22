import { GeneralService } from '../services';
import { Toolbox, SendMail, sendMailTemplate } from '../util';
import database from '../models';
import { env } from '../config';

const msal = require('@azure/msal-node');

const {
    successResponse,
    errorResponse,
    createToken,
    hashPassword,
    comparePassword,
    verifyToken,
} = Toolbox;
const {
    addEntity,
    updateByKey,
    findByKey,
    allEntities
} = GeneralService;
const {
    User,
    Supervisor
} = database;
const {
    ADMIN_KEY,
    OAUTH_REDIRECT_URI,
    OAUTH_APP_ID,
    CLIENT_URL,
    MAIL_USER,
    APP_URL
} = env;

const AuthController = {
    /**
     * checkGamer
     * @async
     * @param {object} req
     * @param {object} res
     * @returns {JSON} a JSON response with user details and Token
     * @memberof AuthController
     */
    async checkGamer(req, res) {
        try {
            console.log(req.body);
            const gamer = await findByKey(User, { email: req.body.email });
            if (!gamer) return successResponse(res, { message: "User can play a game" }, 200);
            else {
                if (gamer.score === null || gamer.score === undefined) {
                    return successResponse(res, { message: "User can play a game" }, 200);
                }

                if (gamer.status === "failed") {
                    return errorResponse(res, { code: 400, message: "User has already played a game" });
                }

                return errorResponse(res, { code: 400, message: "User has already played a game" });
            }
        } catch (error) {
            console.log(error);
            errorResponse(res, {});
        }
    },

    /**
    * add gamer
    * @async
    * @param {object} req
    * @param {object} res
    * @returns {JSON} a JSON response with user details and Token
    * @memberof AuthController
    */
    async addGamer(req, res) {
        try {
            let gamer;
            gamer = await findByKey(User, { email: req.body.email });
            console.log(gamer);
            if (!gamer && req.body.id) {
                gamer = await findByKey(User, { id: req.body.id });
            }

            if (gamer) {
                await updateByKey(User, { id: gamer.dataValues.id }, {
                    score: req.body.score || 120,
                    status: req.body.status,
                    name: req.body.name,
                    email: req.body.email
                });
            } else {
                await addEntity(User, {
                    score: req.body.score || 120,
                    status: req.body.status,
                    name: req.body.name,
                    email: req.body.email
                });
            }

            gamer = await findByKey(User, { email: gamer.dataValues.email });
            return successResponse(res, { message: "User has been added", gamer }, 200);
        } catch (error) {
            console.log(error);
            errorResponse(res, {});
        }
    },

     /**
    * get leaderboard games
    * @async
    * @param {object} req
    * @param {object} res
    * @returns {JSON} a JSON response with user details and Token
    * @memberof AuthController
    */
    async getGamesBoard(req, res) {
        try {
            const games = await allEntities(User);
            return successResponse(res, { games }, 200);
        } catch (error) {
            console.log(error);
            errorResponse(res, {});
        }
    }
};

export default AuthController;