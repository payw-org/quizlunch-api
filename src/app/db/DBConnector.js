const mysql = require('mysql2/promise');
const config = require('../configs/environments');

class DBConnector {
  
  static async getConnection(){
    if(!this.connection){
      this.connection = await mysql.createConnection(config)      
    }

    return this.connection
  }
  
  static async getOneQuiz20Comments(quizID){
    if(!this.connection){
      this.connection = await mysql.createConnection(config)      
    }
    result= await this.connection.query("SELECT * from comments where quizID='"+ quizID + "' ORDER BY commentID DESC LIMIT 20")
    return result
  }

  static async getOneQuizAllComments(quizID){
    if(!this.connection){
      this.connection = await mysql.createConnection(config)      
    }
    result= await this.connection.query("SELECT * from comments where quizID='"+ quizID + "' ORDER BY commentID DESC")
    return result
  }


  static async insertNickname(ip, nickname){
    if(!this.connection){
      this.connection = await mysql.createConnection(config)      
    }
    result= await this.connection.query("insert into nicknames (ip ,nickname) VALUES ('"+ ip + "', '" + nickname + "') ");
    return result
  }

  static async findNickname(ip){
    if(!this.connection){
      this.connection = await mysql.createConnection(config)      
    }
    result= await this.connection.query("SELECT nickname from nicknames where ip='"+ip+"'")
    return result
  }

  static async insertComment(comment){
    if(!this.connection){
      this.connection = await mysql.createConnection(config)      
    }
    result= await this.connection.query("insert into comments (quizID ,nickname, password, text, ip ,time ) VALUES ('"+ comment.quizID + "', '" + comment.nickname + "', '" + comment.password+ "', '" + comment.text+ "', '" + comment.ip+ "', '" + comment.time+ "') ")
    return result
  }

  static async findPassword(commentID){
    if(!this.connection){
      this.connection = await mysql.createConnection(config)      
    }
    result= await this.connection.query("SELECT password from comments where commentID='"+commentID+"'")
    return result
  }

  static async deleteComment(commentID){
    if(!this.connection){
      this.connection = await mysql.createConnection(config)      
    }
    result= await this.connection.query("DELETE FROM comments WHERE commentID ='"+commentID+"'")
    return result
  }

  static async getOneQuiz(quizID){
    if(!this.connection){
      this.connection = await mysql.createConnection(config)      
    }
    result= await this.connection.query("SELECT * from quizs where quizID='"+quizID+"'")
    return result
  }

  static async insertQuiz(quiz){
    if(!this.connection){
      this.connection = await mysql.createConnection(config)      
    }
    result= await this.connection.query("insert into quizs(title,picture,information,answer,time,gotAnswer) VALUES ('"+ quiz.title + "', '" + quiz.picture + "','"+ quiz.information + "', '" + quiz.answer+ "', '" + quiz.time +"', '" + quiz.gotAnswer + "') ")
    return result
  }

  static async findAnswer(quizID){
    if(!this.connection){
      this.connection = await mysql.createConnection(config)      
    }
    result= await this.connection.query("SELECT answer from quizs where quizID='"+quizID+"'")
    return result
  }

  static async updateGotAnswer(quizID){
    if(!this.connection){
      this.connection = await mysql.createConnection(config)      
    }
    result= await this.connection.query("UPDATE quizs set gotAnswer ='" +1+"'" +" where quizID='"+ quizID+"'")
    return result
  }
  
  static async insertWinner(winner){
    if(!this.connection){
      this.connection = await mysql.createConnection(config)      
    }
    result= await this.connection.query("insert into winners(quizID,nickname,text,ip,time) VALUES ('"+ winner.quizID + "', '" + winner.nickname + "','"+ winner.text + "', '" + winner.ip+ "', '" + winner.time + "') ")
    return result
  }

}

module.exports = DBConnector