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


/**
 * Native Android Module that implements a React Native - Android Bridge.
 * Handles the TomTom Point Of interest API Natively
 */
public class TomTomPOIModule extends ReactContextBaseJavaModule {
    TomTomPOIModule(ReactApplicationContext context) {
        super(context);
    }

    /**
     * Builds and  Queues an HTTP GET Request to the Tom Tom Points Of Interest Search API.
     * This method will queue a request only if Internet is available for better battery usage
     * @param queryText Search query for the Points Of Interest Search [API Parameter: query*]
     * @param lat Latitude of the user location for the Points Of Interest Search [API Parameter: lat]
     * @param lon Longitude of the user location for the Points Of Interest Search [API Parameter: lon]
     * @param promise Promise to be resolved or rejected. Containing the response or the error message.
     *                Due to the asynchronous  nature of the business logic inside this method,
     *                a response can only be returned as a promise
     */
    @ReactMethod
    public void createAPIRequest(String queryText,double lat , double lon, Promise promise)  {

        //If Internet is unavailable Reject the promise
        if (!isInternetConnected()){
            promise.reject("API Request Error", "No Internet Connection");
            return;
        }

        //TODO This string should be in a separate uncommitted file
        String apiKey= "STL50FYeIXT5S7PZOY6GNzQ3SmG29JQp";

        try {
            //Build The request URI
            Uri.Builder builder = new Uri.Builder();
            builder.scheme("https")
                    .authority("api.tomtom.com")
                    .appendPath("search")
                    //API Parameter versionNumber*
                    .appendPath("2")
                    .appendPath("poiSearch")
                    //Encoded query parameter (API Parameter query*)
                    //and response file extension parameter (API Parameter ext*)
                    .appendPath(URLEncoder.encode(queryText, "utf-8")+".json")
                    //Enable predictive mode since this is a partial input (API Parameter typeahead)
                    .appendQueryParameter("typeahead", "true")
                    //Limit the response to 10 result to reserve bandwidth while testing
                    .appendQueryParameter("limit", "10")
                    .appendQueryParameter("lat", String.valueOf(lat))
                    .appendQueryParameter("lon", String.valueOf(lon))
                    //Assume Search Radius of 3000 meters (API Parameter radius)
                    .appendQueryParameter("radius", "3000")
                    .appendQueryParameter("key", apiKey);

            // Create a new request queue. Ideally this object should be a singleton or get reused during its context, recreating here is wasteful
            RequestQueue requestQueue = Volley.newRequestQueue(this.getReactApplicationContext());

            //Make a JsonObject Request as well as response and error callbacks using  Android Volley
            JsonObjectRequest req = new JsonObjectRequest(Request.Method.GET,builder.build().toString(), null,
                    response -> promise.resolve(response.toString()),
                    error -> promise.reject("API Request Error", error.getMessage()));
            //add the JSON Object Request to the queue
            requestQueue.add(req);
        }catch (Exception e){
            promise.reject("API Request Error", e);
        }

    }

    /**
     *  Checks if internet is available. Requires android.permission.ACCESS_NETWORK_STATE
     * @return Whether internet is available or not
     */
    public boolean isInternetConnected() {
        ConnectivityManager cm = (ConnectivityManager)getReactApplicationContext().getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo nInfo = cm.getActiveNetworkInfo();
        return  nInfo != null && nInfo.isAvailable() && nInfo.isConnected();
    }

    /**
     * Boilerplate Override to enable the Module React Native Bridging
     * @return
     */
    @NonNull
    @Override
    public String getName() {
        return "TomTomPOIModule";
    }
}
