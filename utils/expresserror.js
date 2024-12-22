class expresserror extends Error{
    constructor(message,statusCode=500){
        super();
        this.statusCode=statusCode;
        this.message=message;
    }
}

module.exports=expresserror;