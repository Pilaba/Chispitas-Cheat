package app.appchida.com.appchida

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import android.net.Uri
import android.os.Build
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.provider.Settings
import android.support.v4.app.ActivityCompat
import android.support.v4.content.ContextCompat
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import kotlinx.android.synthetic.main.activity_main.*

@SuppressLint("NewApi")
class MainActivity : AppCompatActivity() {

    //Variables
    lateinit var mediaProjectionManager: MediaProjectionManager
    lateinit var mediaProjection : MediaProjection

    lateinit var sp : SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        mediaProjectionManager = getSystemService(MEDIA_PROJECTION_SERVICE) as MediaProjectionManager

        //permiso de almacenamiento
        if(ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED){
            ActivityCompat.requestPermissions(this,
                    arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE), 1)
        }
        //permiso OVERLAY
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)){
            //Request overlay
            val permissionIntent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName"))
            startActivityForResult(permissionIntent, 2)
        }

        setupUI()
    }

    fun setupUI(){
        sp = getSharedPreferences("SP", Context.MODE_PRIVATE)

        dirIP.setText(sp.getString("ip", ""))
        dirIP.addTextChangedListener(object: TextWatcher {
            override fun afterTextChanged(s: Editable?) { }
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
               sp.edit().putString("ip", s.toString()).apply()
            }
        })

        start.isChecked = MyService.isRunning
        start.setOnCheckedChangeListener { _, isChecked ->
            if(isChecked){
                startActivityForResult(mediaProjectionManager.createScreenCaptureIntent(),3)
            }else {
                stopService(Intent(this, MyService::class.java))
            }
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        if(requestCode == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED){
            Log.d("XXX", "PERMISO STORAGE OK")
        }else if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && requestCode == 2 && Settings.canDrawOverlays(this)){
            Log.d("XXX", "PERMISO OVERLAY OK")
            //startActivityForResult(mediaProjectionManager.createScreenCaptureIntent(), 1)
        }else{
            finish()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if(requestCode == 3 && resultCode == RESULT_OK && data != null){
            //mediaProjection = mediaProjectionManager.getMediaProjection(resultCode, data)

            MyService.setMediaProjectionDATA(resultCode, data)
            val intent = Intent(this, MyService::class.java)
            startService(intent)
            this.finish()
        }
    }

}
