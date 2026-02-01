<%@ page import="java.io.*"%>
<%@ page import="java.util.Arrays"%>
<%@ page import="java.net.*"%>
<%@ page import="java.util.regex.*"%>
<%@ page import="org.owasp.encoder.Encode"%>

<%!

enum SERVER_TECH {
      DOTNET,
      JEE,
      UNDETERMINED
}

class UrlConResponse {
      public Boolean reachable;
      public int statusCode;
}

String getPackageName(){
      return "VitaraCharts";
}

String getPackageSampleChart(){
      return "VitaraHCBarChartLibrary";
}

Boolean isValidURL(String strUrl) throws URISyntaxException, MalformedURLException {
      Boolean res = true;
      new URL(strUrl);
      res = !strUrl.contains(System.getProperty("line.separator"));
      return res;
}

Boolean belongsToPackage(String chart){
      Boolean result = false;
      if (chart.startsWith("Vitara") && !chart.equals(getPackageName())){
            result = true;
      }
      if (getPackageName().contains("Charts") && chart.contains("HCMapChart")) {
            result = false;
      }
      else if (getPackageName().contains("Maps") && !chart.contains("HCMapChart")) {
            result = false;
      }
      return result;
}

String getPluginsRoot(ServletContext ctx){
      return ctx.getRealPath("/") + "/plugins/";
}

String getChartsRoot(ServletContext ctx){
      return getPluginsRoot(ctx) + "VitaraCharts/";
}

String getSourceRoot(ServletContext ctx){
      return getChartsRoot(ctx) + "javascript/mojo/js/source/";
}

String getDebugFilePath(ServletContext ctx){
      return getPluginsRoot(ctx) + "VitaraHCBarChartMobile/javascript/mojo/js/source/VitaraHCBarChartLibrary.js";
}

String getMobileServerFilePath(ServletContext ctx, String dir){
      String sourceDirPath = getPluginsRoot(ctx) + dir + "/javascript/mojo/js/source/";
      File ABC = new File(sourceDirPath);
      File[] list = ABC.listFiles();
      for (File aFile : list) {
            if(aFile.getName().contains("Vitara")){
                  return sourceDirPath + aFile.getName();
            }
      }
      return sourceDirPath + "MobileServerUrl.js";
}

StringBuffer getMobileConfigURL(HttpServletRequest request){
      StringBuffer result = new StringBuffer();
      String val = htmlEncode(request.getParameter("mobileConfigUrl"));
      if (val != null){
            result.append(val);
      }
      return result;
}

Boolean isEDMChecked(HttpServletRequest request){
      Boolean result = false;
      String select[] = request.getParameterValues("debugMode");
      if (select != null && select.length > 0) {
            for (int i = 0; i < select.length; i++) {
                  if (select[i].equals("enable")) {
                        result = true;
                  }
            }
      }
      return result;
}

URL extractURL(StringBuffer config) throws URISyntaxException, MalformedURLException {
      URL result = null;
      Pattern p = Pattern.compile("http.+?(?=servlet|api)", Pattern.CASE_INSENSITIVE);
      Matcher m = p.matcher(config);
      if (m.find()) {
            result = new URL(URLDecoder.decode(m.group()));
      }
      else{
            result = new URL(URLDecoder.decode(config.toString().trim()));
      }
      return result;
}


String[] getDirs(String path){
      File file = new File(path);
      String[] directories = file.list(new FilenameFilter() {
            @Override
            public boolean accept(File current, String name) {
              return new File(current, name).isDirectory();
            }
          });
      return directories;
}

private final int[] BYTE_ORDER_MARK = {239, 187, 191};

private boolean startsWithBOM(File textFile) throws IOException {
      if(textFile.length() < BYTE_ORDER_MARK.length) {
            return false;
      }

      boolean result = false;
      int[] firstFewBytes = new int[BYTE_ORDER_MARK.length];
      InputStream input = null;

      try {
            input = new FileInputStream(textFile);
            for (int index = 0; index < BYTE_ORDER_MARK.length; ++index) {
                  firstFewBytes[index] = input.read();
            }
            result = Arrays.equals(firstFewBytes, BYTE_ORDER_MARK);
      }
      finally {
            input.close();
      }

      return result;
}

private void overwriteWithoutBOM(byte[] bytesWithoutBOM, File textFile) throws IOException {
      OutputStream output = null;
      try {
            output = new BufferedOutputStream(new FileOutputStream(textFile));
            output.write(bytesWithoutBOM);
      }
      finally {
            output.close();
      }
}

private void stripBomFrom(String textFile) throws IOException {
      File bomFile = new File(textFile);
      long initialSize = bomFile.length();
      long truncatedSize = initialSize - BYTE_ORDER_MARK.length;
      byte[] memory = new byte[(int)(truncatedSize)];
      InputStream input = null;

      try {
            input = new BufferedInputStream(new FileInputStream(bomFile));
            input.skip(BYTE_ORDER_MARK.length);
            int totalBytesReadIntoMemory = 0;
            while(totalBytesReadIntoMemory < truncatedSize) {
                  int bytesRemaining = (int)truncatedSize - totalBytesReadIntoMemory;
                  int bytesRead = input.read(memory, totalBytesReadIntoMemory, bytesRemaining);
                  if(bytesRead > 0) {
                        totalBytesReadIntoMemory = totalBytesReadIntoMemory + bytesRead;
                  }
            }
            overwriteWithoutBOM(memory, bomFile);
      }
      finally {
            input.close();
      }

      File after = new File(textFile);
      long finalSize = after.length();
      long changeInSize = initialSize - finalSize;
      if(changeInSize != BYTE_ORDER_MARK.length) {
            throw new RuntimeException("New File Size: " + changeInSize + " Expected change: " + BYTE_ORDER_MARK.length);
      }
}

String readFile(String filePath) throws FileNotFoundException, IOException {
      if (startsWithBOM(new File(filePath))) {
            stripBomFrom(filePath);
      }
      BufferedReader reader = new BufferedReader(new FileReader(filePath));
      StringBuilder sb = new StringBuilder();
      String line;
      while((line = reader.readLine())!= null){
          sb.append(line+"\n");
      }
      reader.close();
      return sb.toString();
}

void createFile(String path, String data) throws IOException {
      BufferedWriter writer = null;
      try {
            writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(path), "UTF-8"));
            writer.write(data);
      } finally {
            writer.close();
      }
}

void deleteFile(String path){
      File mFile = new File(path);
      if (mFile.exists()){
            mFile.delete();
      }
}

String getStringUrlFun(String url, String dirName){
      return "(function(){if(!mstrmojo.plugins." + dirName + ") mstrmojo.plugins."+ dirName +"={};mstrmojo.plugins." + dirName + ".MobileServerUrl=Object;window.getMobileServerURL=function getMobileServerURL(){return '" + url + "';}}());";
}

String getStringUrlFun1(String url, String dirName){
      return "window.getMobileServerURL=function(){return '" + url + "';}";
}

String getSavedMobileServerURL(ServletContext ctx) throws FileNotFoundException, IOException{
      String result = "";
      String fPath = getMobileServerFilePath(ctx, getPackageSampleChart());
      File mFile = new File(fPath);
       if (mFile.exists()){
            String fileContent = readFile(fPath);
            String line = fileContent;
            String pattern = "(window.getMobileServerURL)=(null|function.*?})";
            Pattern r = Pattern.compile(pattern);
            Matcher m = r.matcher(line);
            if (m.find()) {
                  Pattern p = Pattern.compile("http.+?(?=';})", Pattern.CASE_INSENSITIVE);
                  Matcher m2 = p.matcher(m.group(2));
                  if (m2.find()) {
                        result = m2.group();
                  }
            } 
      }
      return result;
}

Boolean isDebugModeEnabled(ServletContext ctx) throws FileNotFoundException, IOException{
      Boolean result = false;
      String path = getDebugFilePath(ctx);
      String content = readFile(path);
      Pattern p = Pattern.compile("(?<=var isVitaraMobileDebug = )true|false", Pattern.CASE_INSENSITIVE);
      Matcher m = p.matcher(content);
      if (m.find()){
            result = m.group().equalsIgnoreCase("true");
      }
      return result;
}

void setDebugFlag(ServletContext ctx, Boolean bool) throws IOException {
      String path = getDebugFilePath(ctx);
      String content = readFile(path);
      Pattern p = Pattern.compile("var isVitaraMobileDebug\\s*=\\s*true|var isVitaraMobileDebug\\s*=\\s*false", Pattern.CASE_INSENSITIVE);
      Matcher m = p.matcher(content);
      if (m.find()) {
            if (bool) {
                  content = m.replaceFirst("var isVitaraMobileDebug = true");
            }
            else {
                  content = m.replaceFirst("var isVitaraMobileDebug = false");
            }
      }
      createFile(path, content);
}
void updateMobileServerURL(String mServerURLString, String filePath, String dirName) throws IOException, URISyntaxException{
      String fileContent = readFile(filePath);
      String updatedFileString = "mstrmojo.plugins." + dirName +".MobileServerUrl=function getMobileServerURL(){return '" + mServerURLString + "';}();";
      String line = fileContent;
      String pattern = "(window.getMobileServerURL)=(null|function.*?})";
      Pattern r = Pattern.compile(pattern);
      Matcher m = r.matcher(line);
      if (m.find()) {
            String final_str = m.replaceFirst(mServerURLString);
            fileContent = final_str;
      } 
      createFile(filePath, fileContent);
}

void insertMobileServerURL(String strUrl, ServletContext ctx) throws IOException, URISyntaxException, MalformedURLException {
      String[] dirs = getDirs(getPluginsRoot(ctx));
      if (!strUrl.isEmpty()) {
            for (int i = 0; i < dirs.length; i++){
                  if (belongsToPackage(dirs[i])) {
                        updateMobileServerURL(getStringUrlFun1(strUrl, dirs[i]), getMobileServerFilePath(ctx, dirs[i]).toString(), dirs[i]);
                  }
            }
      }
}

void insertServerType(SERVER_TECH serverTech, ServletContext ctx) throws IOException, URISyntaxException, MalformedURLException {      
      String serverTechValidationFunc = getAspxValidationFunc(serverTech);
      String[] dirs = getDirs(getPluginsRoot(ctx));
      if (serverTech != null) {
            for (int i = 0; i < dirs.length; i++){
                  if (belongsToPackage(dirs[i])) {
                        insertServerTechDetails(serverTechValidationFunc, getMobileServerFilePath(ctx, dirs[i]).toString());
                  }
            }
      }
}

UrlConResponse isURLReachable(String strUrl) {
      UrlConResponse conResponse = new UrlConResponse();
      conResponse.reachable = false;

      if (strUrl == null || strUrl.isEmpty()) {
            return conResponse;
      }
      String fileUrl = strUrl + "/plugins/VitaraCharts/style/global.css";
      HttpURLConnection mConnection = null;
      try {
            mConnection = (HttpURLConnection) (new URL(fileUrl)).openConnection();
            mConnection.setRequestMethod("GET");
            conResponse.reachable = (mConnection.getResponseCode() == HttpURLConnection.HTTP_OK);
            conResponse.statusCode = mConnection.getResponseCode();
      } catch (MalformedURLException ex) {
            conResponse.reachable = false;
      } catch (IOException ex) {
            conResponse.reachable = false;
      } catch (Exception ex) {
            conResponse.reachable = false;
      } finally {
            if (mConnection != null) {
                  mConnection.disconnect();
            }
      }

      return conResponse;
}

Boolean isHtmlContentType(String contentType) {
      if (contentType == null && contentType.isEmpty()) {
            return false;
      }
      return contentType.startsWith("application/javascript");
}

Boolean isIISServer(String serverHeader) {
      if (serverHeader == null || serverHeader.isEmpty()) {
            return false;
      }
      return serverHeader.contains("Microsoft-IIS");
}

SERVER_TECH getServerTechnologyByUrl(String mUrl, SERVER_TECH testFor) {
      String serverHeader;
      Boolean hasHtmlContent = false;
      HttpURLConnection mConnection = null;

      try {
            mConnection = (HttpURLConnection) (new URL(mUrl)).openConnection();
            mConnection.setRequestMethod("GET");
            serverHeader = mConnection.getHeaderField("Server");

            if (isIISServer(serverHeader)) {
                  return SERVER_TECH.DOTNET;
            }
            hasHtmlContent = (mConnection.getResponseCode() == HttpURLConnection.HTTP_OK) 
                                    && isHtmlContentType(mConnection.getContentType());
      } catch (MalformedURLException ex) {
            hasHtmlContent = false;
      } catch (IOException ex) {
            hasHtmlContent = false;
      } catch (Exception ex) {
            hasHtmlContent = false;
      } finally {
            if (mConnection != null) {
                  mConnection.disconnect();
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

SERVER_TECH getServerTechnology(String mServerUrl) {
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

      //default to jee bcuz this config is a jsp.
      return SERVER_TECH.JEE;
}

void insertServerTechDetails(String mServerTechFuncString, String filePath) throws IOException, URISyntaxException{
      String fileContent = readFile(filePath);
      String line = fileContent;
      String pattern = "(window.isMSTRAspxMobileServer)=(null|function.*?})";
      Pattern r = Pattern.compile(pattern);
      Matcher m = r.matcher(line);
      if (m.find()) {
            String final_str = m.replaceFirst(mServerTechFuncString);
            fileContent = final_str;
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

String htmlEncode(String data) {
      return Encode.forHtml(data);
}


%>
<html>
      <head> 
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
                  .label-warning {
                        color: coral;
                  }
            </style>
      </head>
      <body>
                 
      <%    
            String savedMobileServerUrl = "None";
            StringBuffer urlConfig = null;
            String errorLabelStyle = "label-hide";
            String errorMessage = "";
            try {
                  urlConfig = getMobileConfigURL(request);
                  if (!urlConfig.toString().trim().isEmpty()) {
                        if (!isValidURL(urlConfig.toString())) {
                              throw new MalformedURLException("invalid url");
                        }

                        URL mUrl = extractURL(urlConfig);
                        UrlConResponse conResponse = isURLReachable(mUrl.toString().trim());
                        if (conResponse == null || !conResponse.reachable) {
                              if(conResponse.statusCode == HttpURLConnection.HTTP_UNAUTHORIZED){
                                    errorMessage = "Warning: Unauthorized access to URL.";
                                    errorLabelStyle = "label-warning";
                              } else {
                                    errorMessage = "Warning: Unable to reach the url.";
                                    errorLabelStyle = "label-warning";
                              }
                        }
                        SERVER_TECH serverTech = getServerTechnology(mUrl.toString().trim());

                        insertMobileServerURL(mUrl.toString().trim(), application);
                        insertServerType(serverTech, application);
                  }
            }
            catch (MalformedURLException | URISyntaxException ex) {
                  errorLabelStyle = "label-show";
                  errorMessage = "Error: Invalid URL" + ": " + urlConfig.toString();
            }
            catch (IOException ex) {
                  System.out.println(ex.getMessage());
            }
            catch (Exception ex) {
                  errorLabelStyle = "label-show";
                  errorMessage = "Error: " + ex.getMessage() + ": " + urlConfig.toString();                  
            }
            finally {
                  savedMobileServerUrl = getSavedMobileServerURL(application);
                  if (savedMobileServerUrl.isEmpty()) {
                        savedMobileServerUrl = "None";
                  }
            }
            
      %>
            
      <form ACTION="config.jsp">
            <br>
            <br>
            Web Configuration URL:<br>
            <textarea type = "text" name = "mobileConfigUrl" class="inputBox"></textarea><br>
            <div class="<%=errorLabelStyle%>"><br><label><%=errorMessage%></label><br></div>
            <div><br><label>Configured: </label><label class="valid-url"><%=savedMobileServerUrl%></label></div><br>
            <input class="vtrButton" type="submit" value="Submit">
      </form>
</body>
</html>