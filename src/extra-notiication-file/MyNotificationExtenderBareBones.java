package io.ionic;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Environment;
import android.support.v4.app.ActivityCompat;
import android.util.Log;

import com.microsoft.azure.storage.CloudStorageAccount;
import com.microsoft.azure.storage.OperationContext;
import com.microsoft.azure.storage.StorageException;
import com.microsoft.azure.storage.blob.BlobContainerPublicAccessType;
import com.microsoft.azure.storage.blob.BlobRequestOptions;
import com.microsoft.azure.storage.blob.CloudBlobClient;
import com.microsoft.azure.storage.blob.CloudBlobContainer;
import com.microsoft.azure.storage.blob.CloudBlockBlob;
import com.onesignal.OSNotificationPayload;
import com.onesignal.NotificationExtenderService;
import com.onesignal.OSNotificationReceivedResult;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.net.HttpURLConnection;
import java.net.URISyntaxException;
import java.net.URL;
import java.security.InvalidKeyException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by admin_lxh37 on 10/24/2018.
 */

public class MyNotificationExtenderBareBones extends NotificationExtenderService {
    private static final String TAG = "MyNotificationExtender";
    // Storage Permissions
    private static final int REQUEST_EXTERNAL_STORAGE = 1;
    private static String[] PERMISSIONS_STORAGE = {
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };
/*
    public static final String storageConnectionString =
            "DefaultEndpointsProtocol=https;" +
                    "AccountName=bloblyh;" +
                    "AccountKey=wfvhXnbdvQuM2cn+eIZUcA2fNWhkwUNrcBOWvHbW9xlxEaXCKUwrjtbZfDs4I6Fb9sygszbTHbEVUP7Nf+w3rw==";
*/

    public static final String storageConnectionString =
            "DefaultEndpointsProtocol=https;" +
                    "AccountName=securebloblyh;" +
                    "AccountKey=ls0Qt3qZlai7QRp48ZWwUxunwIfUVbIaqpLl+FoB6DksFhoMxjReaPxTnFIlpKAJE2B8xftNP5+gjRFQTn2kHA==";

    @Override
    protected boolean onNotificationProcessing(OSNotificationReceivedResult receivedResult) {
        // Read properties from result.

        // Return true to stop the notification from displaying.

        Log.i(TAG,receivedResult.toString());
        SharedPreferences prefs = getSharedPreferences(
                "ActionInMyReceiver", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss dd/MM/yyyy");
        String currentDateandTime = sdf.format(new Date());
        Log.i(TAG, TAG+" "+currentDateandTime);

        Set<String> fetch = prefs.getStringSet(TAG, null);

        Set<String> newSet = new LinkedHashSet<String>();
        if(fetch != null) {
            newSet.addAll(fetch);
            List<String> list = new ArrayList<String>(fetch);
            Log.i(TAG,TAG+" fetched size: "+fetch.size());
            for (int i = 0; i < fetch.size(); i++) {
                Log.i(TAG,TAG+"fetch value " + list.get(i));
            }
        }

        newSet.add(currentDateandTime);
        editor.putStringSet(TAG, newSet);
        editor.apply();

        //upload(prefs);

        return false;
    }


    // upload file to azure blob storage
    private void uploadPicture() {
        try {

// Parse the connection string and create a blob client to interact with Blob storage
            CloudStorageAccount storageAccount = null;
            storageAccount = CloudStorageAccount.parse(storageConnectionString);
            CloudBlobClient blobClient = storageAccount.createCloudBlobClient();
            CloudBlobContainer container = blobClient.getContainerReference("mycontainer");

// Create the container if it does not exist with public access.
           Log.i(TAG,"Creating container: " + container.getName());
            container.createIfNotExists(BlobContainerPublicAccessType.CONTAINER, new BlobRequestOptions(), new OperationContext());


//Getting a blob reference
            CloudBlockBlob blob = container.getBlockBlobReference("picture.jpg");

//Creating blob and uploading file to it
            //verifyStoragePermissions(getActivity());
            Log.i(TAG,"Uploading the sample file ");
            File path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);
            Log.i(TAG,"getExternalStoragePublicDirectory: "+Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES));
            File file = new File(path, "picture.jpg");
            blob.uploadFromFile(file.getAbsolutePath());
            Log.i(TAG,file.getAbsolutePath()+" uploaded");

    } catch (StorageException e) {
            e.printStackTrace();
            Log.e(TAG,e.getMessage());
        } catch (URISyntaxException e) {
            e.printStackTrace();
            Log.e(TAG,e.getMessage());
        } catch (IOException e) {
            e.printStackTrace();
            Log.e(TAG,e.getMessage());
        } catch (InvalidKeyException e) {
            e.printStackTrace();
            Log.e(TAG,e.getMessage());
        }

    }

    // upload file to azure blob storage
    private void upload(SharedPreferences prefs) {
        try {
/*
            // Get the file data
            File file = new File(filePath);
            if (!file.exists()) {
                return false;
            }

            String absoluteFilePath = file.getAbsolutePath();

            FileInputStream fis = new FileInputStream(absoluteFilePath);
            int bytesRead = 0;
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            byte[] b = new byte[1024];
            while ((bytesRead = fis.read(b)) != -1) {
                bos.write(b, 0, bytesRead);
            }
            fis.close();
           byte[] bytes = bos.toByteArray();

 */
// Parse the connection string and create a blob client to interact with Blob storage
            CloudStorageAccount storageAccount = null;
            storageAccount = CloudStorageAccount.parse(storageConnectionString);
            CloudBlobClient blobClient = storageAccount.createCloudBlobClient();
            CloudBlobContainer container = blobClient.getContainerReference("mycontainer");

// Create the container if it does not exist with public access.
            Log.i(TAG,"Creating container: " + container.getName());
            container.createIfNotExists(BlobContainerPublicAccessType.CONTAINER, new BlobRequestOptions(), new OperationContext());

//Creating a sample file
            //File sourceFile = File.createTempFile("sampleFile", ".txt");
            File path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM);
            File f = new File(path, "survey");
            if (!f.exists()) {
                Log.d(TAG, "Folder doesn't exist, creating it...");
                boolean rv = f.mkdir();
                Log.d(TAG, "Folder creation " + ( rv ? "success" : "failed"));
            } else {
                Log.d(TAG, "Folder already exists.");
            }

            SimpleDateFormat sdf = new SimpleDateFormat("yyMMddHHmmssZ");
            String currentDateandTime = sdf.format(new Date());
            File sourceFile = new File(path
                    + File.separator
                    + "survey"
                    + File.separator
                    , "sampleFile"+currentDateandTime+".json");

            Log.i(TAG,"Creating a sample file at: " + sourceFile.toString());
            Writer output = new BufferedWriter(new FileWriter(sourceFile));

            String str = "";
            Set<String> fetch = prefs.getStringSet(TAG, null);

            Set<String> newSet = new LinkedHashSet<String>();
            JSONObject jsonObject = new JSONObject();
            if(fetch != null) {
                newSet.addAll(fetch);
                List<String> list = new ArrayList<String>(fetch);
                for (int i = 0; i < fetch.size(); i++) {
                    jsonObject.put(list.get(i),i);
                }
            }
            str = jsonObject.toString();
            Log.i(TAG,str);
            /*Set<String> newSet = new LinkedHashSet<String>();
            if(fetch != null) {
                newSet.addAll(fetch);
                List<String> list = new ArrayList<String>(fetch);
                for (int i = 0; i < fetch.size(); i++) {
                    str+=TAG+"fetch value " + list.get(i);
                }
            }*/

            output.write(str);
            output.close();

//Getting a blob reference就
            CloudBlockBlob blob = container.getBlockBlobReference(sourceFile.getName());
            Log.i(TAG,"Blob name: "+sourceFile.getName());

//Creating blob and uploading file to it
            blob.uploadFromFile(sourceFile.getAbsolutePath());
            Log.i(TAG,"uploaded: "+sourceFile.getAbsolutePath());

            sourceFile.deleteOnExit();
            Log.i(TAG,"source file deleted");

        } catch (StorageException e) {
            e.printStackTrace();
            Log.e(TAG,e.getMessage());
        } catch (URISyntaxException e) {
            e.printStackTrace();
            Log.e(TAG,e.getMessage());
        } catch (IOException e) {
            e.printStackTrace();
            Log.e(TAG,e.getMessage());
        } catch (InvalidKeyException e) {
            e.printStackTrace();
            Log.e(TAG,e.getMessage());
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }
    /**
     * Checks if the app has permission to write to device storage
     *
     * If the app does not has permission then the user will be prompted to grant permissions
     *
     * @param activity
     */
    public static void verifyStoragePermissions(Activity activity) {
        // Check if we have write permission
        int permission = ActivityCompat.checkSelfPermission(activity, Manifest.permission.READ_EXTERNAL_STORAGE);

        if (permission != PackageManager.PERMISSION_GRANTED) {
            // We don't have permission so prompt the user
            ActivityCompat.requestPermissions(
                    activity,
                    PERMISSIONS_STORAGE,
                    REQUEST_EXTERNAL_STORAGE
            );
        }
    }

    public static Activity getActivity() {
    Class activityThreadClass = null;
    try {
        activityThreadClass = Class.forName("android.app.ActivityThread");
        Object activityThread = activityThreadClass.getMethod("currentActivityThread").invoke(null);
        Field activitiesField = activityThreadClass.getDeclaredField("mActivities");
        activitiesField.setAccessible(true);


        Map<Object, Object> activities = (Map<Object, Object>) activitiesField.get(activityThread);
        if (activities == null)
            return null;

        for (Object activityRecord : activities.values()) {
            Class activityRecordClass = activityRecord.getClass();
            Field pausedField = activityRecordClass.getDeclaredField("paused");
            pausedField.setAccessible(true);
            if (!pausedField.getBoolean(activityRecord)) {
                Field activityField = activityRecordClass.getDeclaredField("activity");
                activityField.setAccessible(true);
                Activity activity = (Activity) activityField.get(activityRecord);
                return activity;
            }
        }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }
        return null;
    }
}

