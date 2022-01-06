

class HttpError extends  Error {
 
    constructor(status_code, response_message, body){
        super({response_message:response_message, status_code:status_code,body});
      this.status_code = status_code,
      this.body = body;
      this.response_message = response_message;  
    }

}

module.exports={
    HttpError
}