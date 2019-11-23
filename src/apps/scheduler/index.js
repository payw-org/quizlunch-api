const scheduler = require('node-schedule');
const DBConnector = require('../../db/DBConnector')
const WSConnector = require('../../websocket/WSConnector')

const atNoon = '0 0 12 * * *'

module.exports = class MYScheduler {

    static async changeNicknames(){
        const ipList = await DBConnector.getIps()
        var nickname
        for(var i=0; i<ipList.length; i++){
            nickname = await axios.get('http://rng.api.quizlunch.com/new').data;
            await DBConnector.updateNickname(ipList[i], nickname)
        }
        console.log('>Nickname has been changed.')
    }

    static async renewQuiz(){
        const quizID = await DBConnector.getTodayQuizID()
        const quiz = await DBConnector.getQuiz(quizID)
        const comments = await DBConnector.getComments(quizID)
        const money = await DBConnector.getComments(quizID)
        await WSConnector.broadcast('renew quiz', quiz)
        await WSConnector.setCurrentQuizID(quizID)
        await WSConnector.broadcast('renew money', money)
        await WSConnector.broadcast('renew comments', comments)
    }

    static async run(){
        this.schedules = {}
        this.schedules.changeNicknameAtNoon = scheduler.scheduleJob(atNoon,this.changeNicknames)
        this.schedules.broadcastQuizAtNoon = scheduler.scheduleJob(atNoon,this.renewQuiz)
    }
}