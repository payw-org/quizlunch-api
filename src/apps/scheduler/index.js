const scheduler = require('node-schedule');
const DBConnector = require('../../db/DBConnector')

const atNoon = '0 0 12 * *'

module.exports = class MYScheduler {

    static changeNicknames(){
        const ipList = await DBConnector.getIps()
        var nickname
        for(var i=0; i<ipList.length; i++){
            nickname = await axios.get('http://rng.api.quizlunch.com/new').data;
            await DBConnector.updateNickname(ipList[i], nickname)
        }
        console.log('>Nickname has been changed.')
    }

    static async run(){
        this.schedule = scheduler.scheduleJob(atNoon,this.changeNicknames())
    }
}