const scheduler = require('node-schedule');
const DBQuizs = require('../../db/DBQuizs')
const DBComments = require('../../db/DBComments')
const DBNicknames = require('../../db/DBNicknames')
const WSConnector = require('../../websocket/WSConnector')
const axiot = require('axios')

const atNoon = '0 0 12 * * *'
const everyMinute = '0 * * * * *'

module.exports = class MYScheduler {

    static async changeNicknames(){
        const ipList = await DBNicknames.getIPAll()
        var nickname
        for(var i=0; i<ipList.length; i++){
            nickname = await axios.get('http://rng.api.quizlunch.com/new').data;
            await DBNicknames.updateNickname({ip:ipList[i], name:nickname})
        }
        console.log('>Nickname has been changed.')
    }

    static async renewQuiz(){
        const quizID = await DBQuizs.getIDByTime()
        const quiz = await DBQuizs.getQuizByID(quizID)
        const comments = await DBComments.getCommentsByQuizID(quizID)
        await WSConnector.broadcast('renew quiz', quiz)
        await WSConnector.broadcast('renew comments', comments)

        const quizIDPrevious = await DBQuizs.getPreviousIDByID(quizID)
        if(quizIDPrevious !== quizID)
            await DBQuizs.updateNotSolvedByID(quizIDPrevious)
    }

    static async renewMoney(){
        const quizID = await DBQuizs.getIDByTime()
        var money = {}

        // calc money
        var quizStartAt = new Date()
        if(quizStartAt.getHours() < 12)
            quizStartAt.setDate(quizStartAt.getDate()-1)
        quizStartAt.setHours(12)
        quizStartAt.setMinutes(0)
        quizStartAt.setSeconds(0)
        
        money['value'] = parseFloat(((Date.now()-quizStartAt)/1000/20).toFixed(4))
        money['quizID'] = quizID
        await WSConnector.broadcast('renew money', money)
    }

    static async run(){
        this.schedules = {}
        this.schedules.changeNicknameAtNoon = scheduler.scheduleJob(atNoon,this.changeNicknames)
        this.schedules.broadcastQuizAtNoon = scheduler.scheduleJob(atNoon,this.renewQuiz)
        this.schedules.broadcastMoneyContinuously = scheduler.scheduleJob(everyMinute,this.renewMoney)
    }
}