<% @Page Language="C#" %>
<%@ Import Namespace="System.IO"%>
<%@ Import Namespace="System.Net"%>

<script runat="server">

    private enum SERVER_TECH {
        DOTNET,
        JEE,
        UNDETERMINED
    }

    private class UrlConResponse {
        public Boolean reachable;
        public HttpStatusCode statusCode;
    }

    private void Page_Load(object source, EventArgs e){
        /* Security fix: Missing X-Frame-Options */
        Response.AddHeader("X-Frame-Options", "DENY");
        savedConfigUrl.InnerHtml = getSavedMobileServerURL();
        //if (isDebugModeEnabled()) {
         //   debugMode.Checked = true;
       // }
    }

    private Boolean isValidURL(String strUrl) {
        Uri uriResult;
        return Uri.TryCreate(strUrl, UriKind.Absolute, out uriResult)
        && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);      
    }

    private void onSubmit(object sender, EventArgs e) {
        
        // if (isEDMChecked()) {
        //     setDebugFlag(true);
        // }
        // else {
        //     setDebugFlag(false);
        // }
        //debugMode.Checked = isDebugModeEnabled();
        String urlString = "none";
        String urlConfig = getMobileConfigURL();
        errorLabel.Style["display"] = "none";
        if (!String.IsNullOrEmpty(urlConfig)){
            if (isValidURL(urlConfig.ToString())) {
                String mUrl = extractURL(urlConfig);                
                if (!String.IsNullOrEmpty(mUrl)){                
                    UrlConResponse conResponse = isURLReachable(mUrl.Trim());
                    insertMobileServerURL(mUrl.Trim());
                    insertServerType(getServerTechnology(mUrl.Trim()));
                    if (conResponse == null && conResponse.reachable != true) {                                            
                        errorLabel.Style["display"] = "block";
                        if(conResponse.statusCode == HttpStatusCode.Unauthorized){
                            errorMessage.InnerHtml = "Warning, Unauthorized access to URL: " + urlConfig.ToString();
                        } else {
                            errorMessage.InnerHtml = "Warning, Unable to reach URL: " + urlConfig.ToString();
                        }
                    }
                } else {
                    errorLabel.Style["display"] = "block";
                    errorMessage.InnerHtml = "Error, Invalid URL: " + urlConfig.ToString();
                }
            } else {
                errorLabel.Style["display"] = "block";
                errorMessage.InnerHtml = "Error, Invalid URL: " + urlConfig.ToString();
            }
        }
                        urlString = getSavedMobileServerURL();
        if(String.IsNullOrEmpty(urlString)){
            savedConfigUrl.InnerHtml = "none";
                    } else {
        savedConfigUrl.InnerHtml = urlString;
    }
    }

    private String getPackageName() {
        return "VitaraCharts";
    }
    private String getPackageSampleChart(){
        return "VitaraHCBarChartLibrary";
    }
    private Boolean belongsToPackage(String chart){
        Boolean result = false;
        if (chart.StartsWith("Vitara") && !chart.Equals(getPackageName())) {
            result = true;
        }
        if (getPackageName().Contains("Charts") && chart.Contains("HCMapChart")) {
            result = false;
        }
        else if (getPackageName().Contains("Maps") && !chart.Contains("HCMapChart")) {
            result = false;
        }
        return result;
    }
    private String getPluginsRoot(){
        return Server.MapPath("~") + "\\plugins\\";
        //return Server.MapPath("~");
    }
    private String getChartsRoot(){
        return getPluginsRoot() + "VitaraCharts\\";
    }
    private String getSourceRoot(){
        return getChartsRoot() + "javascript\\mojo\\js\\source\\";
    }
    private String getDebugFilePath(){
        return getPluginsRoot() + "VitaraHCBarChartMobile\\javascript\\mojo\\js\\source\\VitaraHCBarChartLibrary.js";
    }
    private String getMobileServerFilePath(String dir){
    	String SourceDirPath = getPluginsRoot() + dir + "\\javascript\\mojo\\js\\source\\";
    	List<string> dirs = new List<string>(Directory.EnumerateFiles (SourceDirPath));
        foreach(String aFile in dirs){
            return aFile;
        }

        return SourceDirPath + "MobileServerUrl.js";
    }
    private String getMobileConfigURL(){
        return mobileConfigUrl.Value;
    }
    private Boolean isEDMChecked(){
        return debugMode.Checked;
    }
    private String getRegExMatch(String config, String pattern){
        String result = "";
        MatchCollection matches = Regex.Matches(config, pattern);
        //temp as all regex yields single match.
        foreach(Match match in matches){
            result = match.ToString();
        }
        /* if(String.IsNullOrEmpty(result)){
            result = config;
        } */
        return result;
    }
    private String extractURL(String config){
        String result = getRegExMatch(config, "http.+?(?=servlet|api|asp)");
        if(!String.IsNullOrEmpty(result)){
            return result;
        } else {
            return config;
        }        
        return null;
    }
    private List<string> getDirs(String path){
        List<string> dirs = new List<string>(Directory.EnumerateDirectories(path));
        List<string> res = new List<string>();
        foreach(String dir in dirs){
            res.Add(dir.Substring(dir.LastIndexOf("\\") + 1));
        }
        return res;
    }
    private String readFile(String filePath){
        String text = "";
        using (StreamReader sr = new StreamReader(filePath)) {
                text = sr.ReadToEnd();
        }
        return text;
    }
    private void createFile(String path, String data){
        using (FileStream fs = File.Create(path)) {
            Byte[] info = new UTF8Encoding(true).GetBytes(data);
            fs.Write(info, 0, info.Length);
        }
    }
    private void deleteFile(String path){
        if (File.Exists(path)) {
            File.Delete(path);
        }
    }
    private String getStringUrlFun(String url, String dirName){
        return "(function(){if(!mstrmojo.plugins." + dirName + ") mstrmojo.plugins."+dirName+"={};mstrmojo.plugins."+dirName+".MobileServerUrl=Object;window.getMobileServerURL =  function getMobileServerURL(){return '" + url + "';}}());";
    }
    private String getStringUrlFun1(String url, String dirName){
        return "window.getMobileServerURL=function(){return '" + url + "';}";
    }    
    private String getSavedMobileServerURL(){
        String result = "none";
        String fPath = getMobileServerFilePath(getPackageSampleChart());
        if (File.Exists(fPath)){
            String content = readFile(fPath);
            String matchContent = getRegExMatch(content, "(window.getMobileServerURL)=(null|function.*?})");
            if(!String.IsNullOrEmpty(matchContent)){                
                result = getRegExMatch(matchContent, "http.+?(?=';})");
            }
        }
        return result;
    }
    private Boolean isDebugModeEnabled(){
        String result = "false";
        String path = getDebugFilePath();
        String content = readFile(path);
        result = getRegExMatch(content, "(?<=var isVitaraMobileDebug = )true|false");
        return Boolean.Parse(result);
    }
    private Boolean isRegExMatch(String content, String regEx){
        return Regex.IsMatch(content, regEx);
    }
    private void setDebugFlag(Boolean mBool){
        String path = getDebugFilePath();
        String content = readFile(path);
        if (Regex.IsMatch(content, "var isVitaraMobileDebug\\s*=\\s*true|var isVitaraMobileDebug\\s*=\\s*false")) {
            if (mBool) {
                content = Regex.Replace(content, "var isVitaraMobileDebug\\s*=\\s*true|var isVitaraMobileDebug\\s*=\\s*false", "var isVitaraMobileDebug = true");
            }
            else {
                content = Regex.Replace(content, "var isVitaraMobileDebug\\s*=\\s*true|var isVitaraMobileDebug\\s*=\\s*false", "var isVitaraMobileDebug = false");                
            }
        }
        createFile(path, content);
    }
    private void updateMobileServerURL(String mServerURLString, String filePath, String dirName){
        

    	String fileContent = readFile(filePath);
    	String updatedFileString = "mstrmojo.plugins." + dirName +".MobileServerUrl=function getMobileServerURL(){return '" + mServerURLString + "';}();";
    	String line = fileContent;
        String pattern = "(window.getMobileServerURL)=(null|function.*?})";
    	String String_final_str = "";
    	if(isRegExMatch(line, pattern)){
    		String m = getRegExMatch(line, pattern);
    		String_final_str = line.Replace(m, mServerURLString);
            if(!String.IsNullOrEmpty(String_final_str)){
                fileContent = String_final_str;
            }
    	}
    	createFile(filePath, fileContent);

    }
    private void insertMobileServerURL(String strUrl){
        List<String> dirs = getDirs(getPluginsRoot());
        if (strUrl != null) {
            foreach(String dir in dirs){
                if (belongsToPackage(dir)) {
        			

                    updateMobileServerURL(getStringUrlFun1(strUrl, dir), getMobileServerFilePath(dir), dir);
                }
            }
        }
    }

    private void insertServerType(SERVER_TECH serverTech) { 
        String serverTechValidationFunc = getAspxValidationFunc(serverTech);      
        List<String> dirs = getDirs(getPluginsRoot());
        if (serverTech != null) {
            foreach(String dir in dirs){
                if (belongsToPackage(dir)) {        			
                    insertServerTechDetails(serverTechValidationFunc, getMobileServerFilePath(dir));
                }
            }
        }   
    }

    private UrlConResponse isURLReachable(String strUrl) {

        UrlConResponse conResponse = new UrlConResponse();
        
        conResponse.reachable = false;

        if(String.IsNullOrEmpty(strUrl)){
            return conResponse;
        }
        
        String fileUrl = strUrl + "/plugins/VitaraCharts/style/global.css";
        HttpWebResponse response = null;
        
        try {           
            //workaround while using webclient instead of httpclient from newer .net versions.
            //https://support.microsoft.com/en-us/topic/cannot-connect-to-a-server-by-using-the-servicepointmanager-or-sslstream-apis-after-upgrade-to-the-net-framework-4-6-1e3a9788-ab0d-7794-204b-6c4678bc5ed5
            //https://stackoverflow.com/questions/2859790/the-request-was-aborted-could-not-create-ssl-tls-secure-channel
            ServicePointManager.Expect100Continue = true;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls 
                  | SecurityProtocolType.Tls11
                  | SecurityProtocolType.Tls12
                  | SecurityProtocolType.Ssl3;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(fileUrl);
            request.Method = WebRequestMethods.Http.Get;
            // Get the response.
            response = (HttpWebResponse)request.GetResponse();
            conResponse.statusCode = response.StatusCode;
            if(conResponse.statusCode == HttpStatusCode.OK){
                conResponse.reachable = true;
            }
        } catch (WebException ex) {
            if(ex.Status == WebExceptionStatus.ProtocolError) {
                // 401 unauthorised access
                conResponse.statusCode = ((HttpWebResponse)ex.Response).StatusCode;
                Console.WriteLine("Status Description : ", ((HttpWebResponse)ex.Response).StatusDescription);
            }

        } catch (Exception ex) {
            Console.WriteLine(ex.Message);
            // Something more serious happened
            // like for example you don't have network access
            // we cannot talk about a server exception here as
            // the server probably was never reached
        } finally {
            if(response != null){
                response.Close();
            }
        }
        return conResponse;
    }

    private Boolean isHtmlContentType(String contentType) {
        if(String.IsNullOrEmpty(contentType)){
            return false;
        }
        return contentType.StartsWith("application/javascript");
    }

    private Boolean isIISServer(String serverHeader) {
        if (String.IsNullOrEmpty(serverHeader)) {
                return false;
        }
        return serverHeader.Contains("Microsoft-IIS");
    }

    private SERVER_TECH getServerTechnologyByUrl(String mUrl, SERVER_TECH testFor) {
        String serverHeader;
        Boolean hasHtmlContent = false;
        HttpWebResponse response = null;
        
        try {
            //workaround while using webclient instead of httpclient from newer .net versions.
            //https://support.microsoft.com/en-us/topic/cannot-connect-to-a-server-by-using-the-servicepointmanager-or-sslstream-apis-after-upgrade-to-the-net-framework-4-6-1e3a9788-ab0d-7794-204b-6c4678bc5ed5
            //https://stackoverflow.com/questions/2859790/the-request-was-aborted-could-not-create-ssl-tls-secure-channel
            ServicePointManager.Expect100Continue = true;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls 
                  | SecurityProtocolType.Tls11
                  | SecurityProtocolType.Tls12
                  | SecurityProtocolType.Ssl3;
                  
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(mUrl);
            request.Method = WebRequestMethods.Http.Get;
            // Get the response.
            response = (HttpWebResponse)request.GetResponse();
            if(response.StatusCode == HttpStatusCode.OK){
                serverHeader = response.GetResponseHeader("Server").ToString();

        if (isIISServer(serverHeader)) {
            return SERVER_TECH.DOTNET;
        }
                hasHtmlContent = response.StatusCode == HttpStatusCode.OK && isHtmlContentType(response.ContentType);
            }

        } catch (WebException ex) {
            Console.WriteLine("Status Description : ", ((HttpWebResponse)ex.Response).StatusDescription);
        } catch (Exception ex) {
            Console.WriteLine(ex.Message);
            // Something more serious happened
            // like for example you don't have network access
            // we cannot talk about a server exception here as
            // the server probably was never reached
        } finally {
            if(response != null){
                response.Close();
            }
        }
    
        if (hasHtmlContent && testFor == SERVER_TECH.DOTNET) {
                return SERVER_TECH.DOTNET;
        }
        if (hasHtmlContent && testFor == SERVER_TECH.JEE) {
                return SERVER_TECH.JEE;
        }
        return SERVER_TECH.UNDETERMINED;
    }

    private SERVER_TECH getServerTechnology(String mServerUrl) {
        String filePath = "/plugins/VitaraCharts/";
        String aspxPage = mServerUrl + filePath + "fileLoader.aspx";
        String jspPage = mServerUrl + filePath + "fileLoader.jsp";

        SERVER_TECH aspTech, jspTech;

        aspTech = getServerTechnologyByUrl(aspxPage, SERVER_TECH.DOTNET);
        if (aspTech != SERVER_TECH.UNDETERMINED) {
                return aspTech;
        }

        jspTech = getServerTechnologyByUrl(jspPage, SERVER_TECH.JEE);
        if (jspTech != SERVER_TECH.UNDETERMINED) {
                return jspTech;
        }

        //default to jee bcuz this config is a aspx.
        return SERVER_TECH.DOTNET;
    }

    private void insertServerTechDetails(String mServerTechFuncString, String filePath){
        String fileContent = readFile(filePath);
        String line = fileContent;
        String pattern = "(window.isMSTRAspxMobileServer)=(null|function.*?})";
        String String_final_str = "";
        if(isRegExMatch(line, pattern)){
            String m = getRegExMatch(line, pattern);
            String_final_str = line.Replace(m, mServerTechFuncString);
            if(!String.IsNullOrEmpty(String_final_str)){
                fileContent = String_final_str;
            }
        }    	
        createFile(filePath, fileContent);
    }

    private String getAspxValidationFunc(SERVER_TECH serverTech) {      
        String isIIS = "0";
        if(serverTech == SERVER_TECH.DOTNET){
            isIIS = "!0";
        }        
        return "window.isMSTRAspxMobileServer=function isMSTRAspxMobileServer(){return " + isIIS + ";}";
    }


</script>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style>
            .vtrButton {
                width: 80px;
                height: 25px;
            }

            .inputBox {
                width: 350px;
                height: 150px;
                box-sizing: border-box;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                background-color: #fcfcfc;
                padding: 3px;
                resize: none;
            }

            body {
                font-family: Arial, Helvetica, sans-serif;
                font-size: 14px;
            }

            .valid-url {
                color: blue;
            }
            .label-hide {
                display: none;
            }
            .label-show {
                color: crimson;
            }
        </style>
    </head>
    <body>
        <form runat="server">
            <!-- <br> Enable Debug Mode:
            <input runat="server" type="checkbox" name="debugMode" id="debugMode">
            <br> -->
            <br> Web Configuration URL:
            <br>
            <textarea runat="server" type="text" name="mobileConfigUrl" id="mobileConfigUrl" class="inputBox"></textarea>
            <br>
            <div runat="server" class="label-hide" id="errorLabel">
            <br>
                <label runat="server" class="label-show" id="errorMessage">
                </label>
            </div>
            <div>
                <br>
                <label>Configured: </label>
                <label runat="server" class="valid-url" id="savedConfigUrl">
                </label>
            </div>
            <br>
            <input runat="server" id="formSubmit" class="vtrButton" type="submit" value="Submit" OnServerClick="onSubmit">
        </form>
    </body>
</html>