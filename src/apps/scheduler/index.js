const scheduler = require('node-schedule');
const DBConnector = require('../../db/DBConnector')
const WSConnector = require('../../websocket/WSConnector')

const atNoon = '0 0 12 * * *'
const continuously = '* * * * * *'

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
        await WSConnector.broadcast('renew quiz', quiz)
        await WSConnector.setCurrentQuizID(quizID)
        await WSConnector.broadcast('renew comments', comments)
    }

    static async renewMoney(){
        const quizID = await DBConnector.getTodayQuizID()
        var money = {}
        var timeStart = new Date()
        var timeNow= Date.now()
        timeStart.setHours(timeStart.getHours()-12)
        timeStart.setMinutes(0)
        timeStart.setSeconds(0)

        money['value'] = Math.floor((timeNow-timeStart)/1000/20)
        money['quizID'] = quizID
        await WSConnector.broadcast('renew money', money)
    }

    static async run(){
        this.schedules = {}
        this.schedules.changeNicknameAtNoon = scheduler.scheduleJob(atNoon,this.changeNicknames)
        this.schedules.broadcastQuizAtNoon = scheduler.scheduleJob(atNoon,this.renewQuiz)
        this.schedules.broadcastMoneyContinuously = scheduler.scheduleJob(continuously,this.renewMoney)
    }
}