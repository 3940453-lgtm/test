<% @Page Language="C#" AutoEventWireup="true"%>
<%@ Import Namespace="System.IO"%>
<%@ Import Namespace="System.Net"%>
<%@ Import Namespace="System.Web.Security.AntiXss"%>

<script runat="server">

private void Page_Load(object source, EventArgs e){
      String callbackFun = AntiXssEncoder.HtmlEncode(Request.QueryString["callback"], true);
      String filePath = AntiXssEncoder.HtmlEncode(Request.QueryString["file"], true);
      String fileType = AntiXssEncoder.HtmlEncode(Request.QueryString["type"], true);
      String context = AntiXssEncoder.HtmlEncode(Request.QueryString["ctx"], true);
      /* Security fix: Client Reflected File Download */
      Response.AddHeader("Content-Disposition", "inline");
      Response.ContentType = "application/javascript";
      
      try {
            if (isValidAbsoluteUrl(filePath)) {
                  Response.Write(getUrlContent(new URLRequest(callbackFun, filePath, fileType, context)));
            } else {
                  //comment: temporarily disbaled html encode
                  //String content = isAllowedToServe(getOFilePath(filePath)) ? AntiXssEncoder.HtmlEncode(readFile(getOFilePath(filePath)), true) : "";
                  String content = isAllowedToServe(getOFilePath(filePath)) ? readFile(getOFilePath(filePath)) : "";
                  String json = callbackFun + "({status:200, msg:'success', data:'"+ getResponse(content) +"', type:'"+ fileType +"', ctx:'"+ context + "'})";
                  Response.Write(json);
            }
      }
      catch (Exception ex) {
            Response.Write(callbackFun + "({status:500, msg: 'failed to read the requested file due to unknown reason', data:'VITARA_MOBILE_FILE_READ_EXCEPTION'})");
      }
}

private String getPluginsRoot(){
      return Path.GetFullPath(Server.MapPath("~") + "\\plugins\\");
}
private String getChartsRoot(){
      return Path.GetFullPath(getPluginsRoot() + "VitaraCharts\\");
}
private String getOFilePath(String rFilePath){
      return Path.GetFullPath(getChartsRoot() + rFilePath);
}
private String readFile(String filePath){
      String text = "";
      using (StreamReader sr = new StreamReader(filePath)) {
            text = sr.ReadToEnd();
      }
      return text;
}
private String getResponse(String data){
      return System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(data));
}

private string[] getTargetDirectories(){
      return Directory.GetDirectories(getPluginsRoot(), "Vitara*");
}

private List<String> getFileList(string trgtDir){
    List<String> files = new List<String>();
    try{
        foreach (string f in Directory.GetFiles(trgtDir)){
            files.Add(f);
        }
        foreach (string d in Directory.GetDirectories(trgtDir)){
            files.AddRange(getFileList(d));
        }
    }
    catch (Exception ex) {
        throw;
    }
    return files;
}

private List<String> getFilesListToServe(){
      List<String> result = new List<String>(); 
      foreach (string trgt in getTargetDirectories()) {
            result.AddRange(getFileList(trgt));
      }
      return result;
}

private Boolean isAllowedToServe(string file){
      return Array.IndexOf(getFilesListToServe().ToArray(), file) != -1; 
}

private Boolean isValidAbsoluteUrl(String strUrl) {
      return System.Uri.IsWellFormedUriString(strUrl, UriKind.Absolute);
}

private class URLRequest {
      public int status;
      public String callback, url, message, data, fileType, context;

      public URLRequest(String callback, String url, String fileType, String context) {
            this.callback = callback;
            this.url = url;
            this.fileType = fileType;
            this.context = context;
      }

      public String encode(String data) {
            try {
                  return System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(data));
            } catch(Exception ex) {
                  Console.WriteLine("Response Data Encode Exception Handler: {ex}");
            }
            return "";
      }
      public String getResponse() {
            return this.callback + "({status:" + this.status + ", msg:'" 
            + this.message + "', data:'" 
            + encode(this.data) + "', type:'" 
            + this.fileType + "', ctx:'" 
            + this.context + "'})";
      }
}

private String getUrlContent(URLRequest mRequest) {
      try {
            //workaround while using webclient instead of httpclient from newer .net versions.
            //https://support.microsoft.com/en-us/topic/cannot-connect-to-a-server-by-using-the-servicepointmanager-or-sslstream-apis-after-upgrade-to-the-net-framework-4-6-1e3a9788-ab0d-7794-204b-6c4678bc5ed5
            //https://stackoverflow.com/questions/2859790/the-request-was-aborted-could-not-create-ssl-tls-secure-channel
            ServicePointManager.Expect100Continue = true;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls 
                  | SecurityProtocolType.Tls11
                  | SecurityProtocolType.Tls12
                  | SecurityProtocolType.Ssl3;
            
            WebClient mClient = new WebClient();
            mClient.Encoding = System.Text.Encoding.UTF8;
            mRequest.data = mClient.DownloadString (mRequest.url);
            mRequest.status = 200;
            mRequest.message = "success";
      }      
      catch (WebException ex) {
            mRequest.status = 500;
            mRequest.message = ex.ToString();
            Console.WriteLine("Web Exception Handler: {ex}");
      } catch (Exception ex) {
            mRequest.status = 500;
            mRequest.message = ex.ToString();
            Console.WriteLine("Generic Web Exception Handler: {ex}");
      }

      return mRequest.getResponse();
}


</script>