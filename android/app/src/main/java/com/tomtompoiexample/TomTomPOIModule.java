package com.tomtompoiexample;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import androidx.annotation.NonNull;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.net.URLEncoder;
import com.facebook.react.bridge.Promise;



public class TomTomPOIModule extends ReactContextBaseJavaModule {
    TomTomPOIModule(ReactApplicationContext context) {
        super(context);
    }

    @ReactMethod
    public void createAPIRequest(String queryText,double lat , double lon, Promise promise)  {

        if (!isInternetConnected()){
            promise.reject("API Request Error", "No Internet Connection");
            return;
        }

        String apiKey= "STL50FYeIXT5S7PZOY6GNzQ3SmG29JQp";
        try {
            Uri.Builder builder = new Uri.Builder();
            builder.scheme("https")
                    .authority("api.tomtom.com")
                    .appendPath("search")
                    .appendPath("2")
                    .appendPath("poiSearch")
                    .appendPath(URLEncoder.encode(queryText, "utf-8")+".json")
                    .appendQueryParameter("typeahead", "true")
                    .appendQueryParameter("limit", "10")
                    .appendQueryParameter("lat", String.valueOf(lon))
                    .appendQueryParameter("lon", String.valueOf(lat))
                    .appendQueryParameter("radius", "3000")
                    .appendQueryParameter("key", apiKey);

            RequestQueue requestQueue = Volley.newRequestQueue(this.getReactApplicationContext());
            JsonObjectRequest req = new JsonObjectRequest(Request.Method.GET,builder.build().toString(), null,
                    response -> promise.resolve(response.toString()),
                    error -> promise.reject("API Request Error", error.getMessage()));
            requestQueue.add(req);
        }catch (Exception e){
            promise.reject("API Request Error", e);
        }

    }


    public boolean isInternetConnected() {
        ConnectivityManager cm = (ConnectivityManager)getReactApplicationContext().getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo nInfo = cm.getActiveNetworkInfo();
        return  nInfo != null && nInfo.isAvailable() && nInfo.isConnected();
    }

    @NonNull
    @Override
    public String getName() {
        return "TomTomPOIModule";
    }
}
