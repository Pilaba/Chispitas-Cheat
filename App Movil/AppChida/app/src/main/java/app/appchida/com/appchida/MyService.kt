package app.appchida.com.appchida

import android.annotation.SuppressLint
import android.app.Service
import android.content.Intent
import android.app.NotificationManager
import android.app.NotificationChannel
import android.content.Context
import android.content.SharedPreferences
import android.graphics.*
import android.hardware.display.DisplayManager
import android.hardware.display.VirtualDisplay
import android.media.ImageReader
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import android.os.*
import android.support.v4.app.NotificationCompat
import android.support.v7.widget.AppCompatButton
import android.support.v7.widget.AppCompatImageButton
import android.util.Base64
import com.koushikdutta.async.http.AsyncHttpClient
import com.koushikdutta.async.http.AsyncHttpPost
import com.koushikdutta.async.http.body.MultipartFormDataBody
import java.io.ByteArrayOutputStream
import android.util.DisplayMetrics
import android.view.*
import android.widget.Button
import android.widget.ImageButton
import kotlin.concurrent.thread

@SuppressLint("NewApi")  //Supress warning api level
class MyService : Service(), ImageReader.OnImageAvailableListener {
    lateinit var sp : SharedPreferences
    lateinit var windowManager: WindowManager
    lateinit var mediaProjectionManager: MediaProjectionManager
    lateinit var mediaProjection : MediaProjection
    lateinit var metrics: DisplayMetrics
    lateinit var display: VirtualDisplay
    lateinit var handler: Handler

    companion object {
        var isRunning = false
        lateinit var data: Intent
        var code = 0

        fun setMediaProjectionDATA(code: Int, intent: Intent){
            this.code = code; this.data = intent
        }
    }

    override fun onCreate() {
        super.onCreate()
        sp = getSharedPreferences("SP", Context.MODE_PRIVATE)
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        mediaProjectionManager = getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager

        //Get phone dimensions and so on
        metrics = android.util.DisplayMetrics()
        windowManager.defaultDisplay.getMetrics(metrics)

        //Background handler
        object: Thread() {
            override fun run() {
                Looper.prepare()
                handler = Handler(Looper.myLooper())
                Looper.loop()
            }
        }.start()

        val channelId = "CHANNEL-01"
        val builder = NotificationCompat.Builder(this, channelId)
                .setContentTitle("Cheat").setContentText("Confetti Cheat up")
                .setOngoing(true).setSmallIcon(R.drawable.ic_money)
                .setWhen(System.currentTimeMillis())
        val mNotificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = getString(R.string.app_name)
            val mChannel = NotificationChannel(channelId, name, NotificationManager.IMPORTANCE_DEFAULT)
            mNotificationManager.createNotificationChannel(mChannel)
            builder.setChannelId(channelId) // Channel ID
        }
        startForeground(1, builder.build())
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        isRunning = true

        //Create floating widget
        val params: WindowManager.LayoutParams = WindowManager.LayoutParams()
        params.height = ViewGroup.LayoutParams.WRAP_CONTENT
        params.width = ViewGroup.LayoutParams.MATCH_PARENT
        params.type = WindowManager.LayoutParams.TYPE_PHONE //or WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY > ANDROID OREO
        params.flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_SECURE
        params.format = PixelFormat.TRANSLUCENT
        params.gravity = Gravity.TOP

        val inflater = getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val view = inflater.inflate(R.layout.overlay_widget, null)
        windowManager.addView(view, params)

        //Listeners widget Buttons
        view.findViewById<Button>(R.id.GO).setOnClickListener {
            //Create mediaprojection, thanks to succesful screen capture request
            mediaProjection = mediaProjectionManager.getMediaProjection(code, data)

            //Imagereader shell for the image
            val mImageReader = ImageReader.newInstance(metrics.widthPixels, metrics.heightPixels, PixelFormat.RGBA_8888, 1)
            mImageReader.setOnImageAvailableListener(this, handler)

            display =  mediaProjection.createVirtualDisplay("MyScreen", metrics.widthPixels, metrics.heightPixels, metrics.densityDpi,
                    DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
                    mImageReader.surface, null, handler)
        }

        view.findViewById<ImageButton>(R.id.STOP).setOnClickListener {
            windowManager.removeView(view)
            onDestroy()
        }

        return START_STICKY
    }

    //Callback - Once we catch an image convert it to bitmap send it to server
    override fun onImageAvailable(reader: ImageReader?) {
        reader?.use {
            val image = it.acquireLatestImage()
            val planes = image.planes
            val buffer = planes[0].buffer

            val pixelStride = planes[0].pixelStride
            val rowStride = planes[0].rowStride
            val rowPadding = rowStride - pixelStride * metrics.widthPixels

            //Create a bitmap
            var bitmap = Bitmap.createBitmap(metrics.widthPixels + rowPadding / pixelStride,
                    metrics.heightPixels, Bitmap.Config.ARGB_8888)
            bitmap.copyPixelsFromBuffer(buffer)

            //Crop Bitmap
            bitmap = Bitmap.createBitmap(bitmap, 0, 470, bitmap.width,bitmap.height-470)

            //Send image to server
            val byteArr = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArr)
            val stringB64 = Base64.encodeToString(byteArr.toByteArray(), Base64.DEFAULT)

            val post = AsyncHttpPost(sp.getString("ip", ""))
            val body = MultipartFormDataBody()
            body.addStringPart("imgasB64", stringB64)
            post.body = body
            AsyncHttpClient.getDefaultInstance().execute(post) {_,_ -> }

            //Once we get the image, release stuff
            mediaProjection.stop()
            display.release()
        }
    }

    override fun onDestroy() {
        isRunning = false
        stopSelf()
    }

    override fun onBind(intent: Intent): IBinder { TODO("UPCONMING") }
}
