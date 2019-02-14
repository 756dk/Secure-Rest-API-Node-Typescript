export class ApiNames {
    public static readonly API_PATH = "/api/";
    public static readonly LOGIN = `${ApiNames.API_PATH}login`;
    public static readonly REGISTER = `${ApiNames.API_PATH}register`;
    public static readonly LOGOUT = `${ApiNames.API_PATH}logout`;    
    public static readonly REFRESHTOKEN = `${ApiNames.API_PATH}refreshtoken`;    
    public static readonly ADDUSER = `${ApiNames.API_PATH}adduser`;
    public static readonly VIEWUSER = `${ApiNames.API_PATH}viewuser`;
}


export class Global {
    public static readonly SECRET = "jsonwebtokensecret";
}