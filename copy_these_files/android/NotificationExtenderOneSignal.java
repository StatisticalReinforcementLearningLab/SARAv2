package edu.harvard.srl.SARA;




import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.onesignal.OSNotificationReceivedResult;
import com.onesignal.NotificationExtenderService;

import java.io.DataOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.json.JSONException;
import org.json.JSONObject;


public class NotificationExtenderOneSignal extends NotificationExtenderService {


    /*

        Add the following to AndroidManifest.xml

        <service
           android:name="edu.harvard.srl.SARA.NotificationExtenderOneSignal"
           android:permission="android.permission.BIND_JOB_SERVICE"
           android:exported="false">
           <intent-filter>
              <action android:name="com.onesignal.NotificationExtender" />
           </intent-filter>
        </service>

    */

    private static final String TAG = "NotificationExtenderOneSignal";

    @Override
    protected boolean onNotificationProcessing(OSNotificationReceivedResult receivedResult) {
        

        // Read properties from result.
        //receivedResult contains a detailed payload of the notification.
        Log.i(TAG, receivedResult.toString());
        String title = receivedResult.payload.title;
        String body  = receivedResult.payload.body;
        String additionalData = receivedResult.payload.additionalData.toString();

        Log.e(TAG, "Title: " + title);
        Log.e(TAG, "Body: " + body);
        Log.e(TAG, "AdditionalData: " + additionalData);

        //Write a JSON object
        JSONObject object = new JSONObject();
        try {
            //
            SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss dd/MM/yyyy");
            String currentDateandTime = sdf.format(new Date());
            object.put("ReceivedTime", currentDateandTime);
            object.put("ReceivedTs", System.currentTimeMillis());
            object.put("NoticationID", receivedResult.payload.notificationID);
            object.put("ParticipantID", receivedResult.payload.additionalData.getString("user"));
            object.put("NotificationType", receivedResult.payload.additionalData.getString("type"));

        } catch (JSONException e) {
            e.printStackTrace();
        }

        //upload it to the cloud.
        upload(object);

        return false;
    }

    private void upload(JSONObject object){
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                try {

                    // TODO: change the URL to a flask end-point. 
                    // The flask file is available in the 'flask' directory of 'copy_these_files'.

                    URL url = new URL("http://SERVER-IP-ADDRESS:PORT/adapts-notification-insert");
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("POST");
                    conn.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
                    conn.setRequestProperty("Accept","application/json");
                    conn.setDoOutput(true);
                    conn.setDoInput(true);

                    Date c = Calendar.getInstance().getTime();
                    SimpleDateFormat df = new SimpleDateFormat("dd-MMM-yyyy");
                    String formattedDate = df.format(c);
                    df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS Z");
                    String formattedReadbleTs = df.format(c);


                    JSONObject jsonParam = new JSONObject();
                    jsonParam.put("PARTICIAPANT_ID", object.getString("ParticipantID"));
                    jsonParam.put("DATE", formattedDate);
                    jsonParam.put("Notification_Id", object.getString("NoticationID"));
                    jsonParam.put("whenReceivedTs", System.currentTimeMillis());
                    jsonParam.put("whenReceivedReadableTs", formattedReadbleTs);
                    jsonParam.put("typeOfNotification", object.getString("NotificationType"));
                    jsonParam.put("JSON_dump", "empty");
                    jsonParam.put("device_type", "android");


                    Log.i("JSON", jsonParam.toString());
                    DataOutputStream os = new DataOutputStream(conn.getOutputStream());
                    os.writeBytes(jsonParam.toString());

                    os.flush();
                    os.close();

                    Log.i("STATUS", String.valueOf(conn.getResponseCode()));
                    Log.i("MSG" , conn.getResponseMessage());

                    conn.disconnect();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        thread.start();
    }

}


