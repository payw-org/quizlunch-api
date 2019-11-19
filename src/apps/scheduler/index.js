const scheduler = require('node-schedule');
const DBConnector = require('../../db/DBConnector')
const WSConnector = require('../../db/DBConnector')

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

    static async broadcastQuiz(){
        const quizID = await DBConnector.getTodayQuizID()
        
    }

    static async run(){
        this.schedules = {}
        this.schedules.changeNicknameAtNoon = scheduler.scheduleJob(atNoon,this.changeNicknames)
        this.schedules.broadcastQuizAtNoon = scheduler.scheduleJob(atNoon,this.broadcastQuiz)
    }
}