package app.appchida.com.appchida

import android.app.Service
import android.content.Intent
import android.app.NotificationManager
import android.app.NotificationChannel
import android.content.Context
import android.content.SharedPreferences
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.*
import android.support.v4.app.NotificationCompat
import java.io.File
import android.os.FileObserver
import android.util.Base64
import com.google.firebase.ml.vision.FirebaseVision
import com.google.firebase.ml.vision.common.FirebaseVisionImage
import com.koushikdutta.async.http.AsyncHttpClient
import com.koushikdutta.async.http.AsyncHttpPost
import com.koushikdutta.async.http.body.MultipartFormDataBody
import java.io.ByteArrayOutputStream
import com.google.firebase.ml.vision.text.FirebaseVisionTextRecognizer
import android.widget.Toast
import com.koushikdutta.async.AsyncServer.post
import android.os.Looper
import android.util.Log


class MyService : Service() {
    lateinit var observer : FileObserver
    lateinit var sp : SharedPreferences
    companion object { var isRunning = false }

    override fun onCreate() {
        super.onCreate()
        sp = getSharedPreferences("SP", Context.MODE_PRIVATE)

        val pictures: File = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES)
        val screenShots = File(pictures, "Screenshots")
        observer = object: FileObserver(screenShots.absolutePath, FileObserver.CLOSE_WRITE){
            override fun onEvent(event: Int, file: String?) {
                if(file != null){
                    val pic = File(screenShots, file)

                    val originalBitmap: Bitmap = BitmapFactory.decodeFile(pic.absolutePath)
                    val newBitmap = Bitmap.createBitmap(originalBitmap, 0, 470, originalBitmap.width , originalBitmap.height-470)

                    /////////////////////////////////////////////////////////////////////////////////
                    val image = FirebaseVisionImage.fromBitmap(newBitmap)

                    val detector = FirebaseVision.getInstance().cloudTextRecognizer

                    detector.processImage(image).addOnSuccessListener {
                        Log.d("XXXText", it.text)
                        for (block in it.textBlocks) {
                            val blockText = block.text
                            Log.d("XXXBlock", it.text)
                        }
                    }.addOnFailureListener {
                        Log.d("XXX", it.message)
                    }.addOnCanceledListener {
                        Log.d("XXX", "Canceled")
                    }.addOnCompleteListener {
                        Log.d("XXX", it.result?.text)
                    }

                    /////////////////////////////////////////////////////////////////////////////////

                    /*val newFile = File(pictures, file)
                    FileOutputStream(newFile).use{
                        newBitmap.compress(Bitmap.CompressFormat.JPEG, 100, it)
                        it.flush()
                        it.close()
                    }.also {
                        Ion.with(this@MyService)
                            .load("http://${sp.getString("ip", "")}")
                            .setMultipartFile("archive", "image/jpeg", newFile)
                            .asJsonObject().setCallback { _, _ -> }
                    }*/

                    /*
                    val byteArr = ByteArrayOutputStream()
                    newBitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArr)
                    val stringB64 = Base64.encodeToString(byteArr.toByteArray(), Base64.DEFAULT)

                    val post = AsyncHttpPost("http://${sp.getString("ip", "")}")
                    val body = MultipartFormDataBody()
                    body.addStringPart("imgasB64", stringB64)
                    post.body = body
                    AsyncHttpClient.getDefaultInstance().execute(post) {_,_ -> }
                    */
                }
            }
        }

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
        observer.startWatching() // start the observer
        return START_STICKY
    }

    override fun onDestroy() {
        isRunning = false
        observer.stopWatching()
        stopSelf()
    }

    override fun onBind(intent: Intent): IBinder { TODO("UPCONMING") }
}
