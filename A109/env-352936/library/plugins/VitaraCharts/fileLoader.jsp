<%@ page import="java.io.*"%>
<%@ page import="java.net.*"%>
<%@ page import="java.util.regex.*"%>
<%@ page import="org.owasp.encoder.Encode"%>
<%@ page import="org.apache.commons.codec.binary.Base64"%>
<%@page contentType="application/json; charset=UTF-8"%>
<%!
String getPluginsRoot(ServletContext ctx){
      return ctx.getRealPath("/") + "/plugins/";
}

String getChartsRoot(ServletContext ctx){
      return getPluginsRoot(ctx) + "VitaraCharts/";
}

String getRFilePath(String rFilePath){
      return "/plugins/VitaraCharts/" + rFilePath;
}

void createFile(String path, String data) throws IOException{
      FileWriter filewriter = new FileWriter(path, true);
      filewriter.write(data);
      filewriter.close();
}

void deleteFile(String path){
      File mFile = new File(path);
      if (mFile.exists()){
            mFile.delete();
      }
}

String getOFilePath(ServletContext ctx, String rFilePath){
      return getChartsRoot(ctx) + rFilePath;
}

boolean isAllowedToServe(ServletContext ctx, String resourcePath) {
      try {
            URL resourceUrl = ctx.getResource(resourcePath);
            URL directoryUrl = ctx.getResource(getRFilePath(""));
        
            if (resourceUrl != null && directoryUrl != null) {
                String resourceUrlString = resourceUrl.toString();
                String directoryUrlString = directoryUrl.toString();
                return resourceUrlString.startsWith(directoryUrlString);
            }
      } catch (MalformedURLException ex) {

      }

    return false;
}

String readFileIS(ServletContext ctx, URLRequest mURLRequest) throws FileNotFoundException, IOException{
      InputStream is = ctx.getResourceAsStream(getRFilePath(mURLRequest.url));
      if (is != null) {
            InputStreamReader isr = new InputStreamReader(is);
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            StringBuilder sb = new StringBuilder();
            String line;
            while((line = reader.readLine())!= null){
                  sb.append(line+"\n");
            }
            reader.close();
            mURLRequest.status = 200;
            mURLRequest.message = "success";
            mURLRequest.data = sb.toString();
      }
      return mURLRequest.getResponse();
}

String readFile(ServletContext ctx, String rFilePath) throws FileNotFoundException, IOException{
      String path = getOFilePath(ctx, rFilePath);
      BufferedReader reader = new BufferedReader(new FileReader(path));
      StringBuilder sb = new StringBuilder();
      String line;
      while((line = reader.readLine())!= null){
          sb.append(line+"\n");
      }
      reader.close();
      return sb.toString();
}

String readFromURL(String url) throws MalformedURLException, IOException {
      URL mUrl = new URL(url);
      BufferedReader reader = new BufferedReader(new InputStreamReader(mUrl.openStream()));
      StringBuilder sb = new StringBuilder();
      String line;
      while((line = reader.readLine()) != null) {
            sb.append(line+"\n");
      }
      reader.close();
      return sb.toString();
}

String getResponse(String data){
      return new String(Base64.encodeBase64(data.getBytes()));
}

private class URLRequest {
      int status;
      String callback, url, message, data, fileType, context;

      URLRequest(String callback, String url, String fileType, String context) {
            this.callback = htmlEncode(callback);
            this.url = htmlEncode(url);
            this.fileType = htmlEncode(fileType);
            this.context = htmlEncode(context);
      }

      String htmlEncode(String data) {
            return Encode.forHtml(data);
      }

      String encode(String data) {
            try {
                  return new String(Base64.encodeBase64(data.getBytes()));
            } catch(Exception ex) {
                  ex.printStackTrace();
            }
            return "";
      }

      String getResponse() {
            return this.callback + "({status:" + this.status + ", msg:'" 
            + this.message + "', data:'" 
            + encode(htmlEncode(this.data)) + "', type:'" 
            + this.fileType + "', ctx:'" 
            + this.context + "'})";
      }

      void println(JspWriter out, String data) throws IOException {
            out.println(data);
      }

      void printError(JspWriter out, int status, String msg) throws IOException {
            this.status = status;
            this.message = msg;
            this.data = "VITARA_MOBILE_FILE_READ_EXCEPTION";
            this.println(out, this.getResponse());
      }
}

String getUrlContent (URLRequest mRequest) {
      HttpURLConnection mConnection = null;
      BufferedReader in = null;
      try {
            mConnection = (HttpURLConnection) (new URL(mRequest.url)).openConnection();
            mConnection.setRequestMethod("GET");
            mRequest.status = mConnection.getResponseCode();
            if (mConnection.getResponseCode() == HttpURLConnection.HTTP_OK) {
                  mRequest.message = "success";
                  in = new BufferedReader(new InputStreamReader(mConnection.getInputStream()));
                  StringBuilder content = new StringBuilder();
                  String currentLine;
                  while ((currentLine = in.readLine()) != null) {
                        content.append(currentLine);
                  }
                  mRequest.data = content.toString();
            }
      } catch (MalformedURLException ex) {
            mRequest.status = 500;
            mRequest.message = ex.getMessage();
            System.out.println("ml ex: " + ex.getMessage());
      } catch (Exception ex) {
            mRequest.status = 500;
            mRequest.message = ex.getMessage();
            System.out.println("ex: " + ex.getMessage());
      } finally {
            try {
                  if (in != null) {
                        in.close();
                  }
                  if (mConnection != null) {
                        mConnection.disconnect();
                  }
            } catch(IOException ex) {

            }
      }

      return mRequest.getResponse();
}

Boolean isValidAbsoluteUrl(String strUrl) {
      Boolean res = false;
      try {
            URL mUrl = new URL(strUrl);
            res = true;
      } catch (MalformedURLException ex) {
            res = false;
      } catch (Exception ex) {
            res = false;
      }
      return res;
}

%>

<%
      response.setContentType("application/javascript");
      String filePath = request.getParameter("file");
      String callbackFun = request.getParameter("callback");
      String fileType = request.getParameter("type");
      String context = request.getParameter("ctx");

      URLRequest mURLRequest = new URLRequest(callbackFun, filePath, fileType, context);

      try {
            if (isValidAbsoluteUrl(filePath)) {
                  mURLRequest.println(out, getUrlContent(mURLRequest));
            } else if (isAllowedToServe(application, getRFilePath(mURLRequest.url))) {
                  mURLRequest.println(out, readFileIS(application, mURLRequest));
            } else {
                  mURLRequest.printError(out, 400, "Invalid file path");
            }
      }
      catch(Exception e){
            mURLRequest.printError(out, 500, "Exception occured");
      }
%>
