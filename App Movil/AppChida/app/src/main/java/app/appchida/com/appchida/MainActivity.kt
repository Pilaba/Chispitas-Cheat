package app.appchida.com.appchida

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v4.app.ActivityCompat
import android.support.v4.content.ContextCompat
import android.text.Editable
import android.text.TextWatcher
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    lateinit var sp : SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        if(ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED){
            ActivityCompat.requestPermissions(this,
                    arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE), 1)
            return
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
                startService(Intent(this, MyService::class.java))
            }else {
                stopService(Intent(this, MyService::class.java))
            }
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        if(requestCode == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED){
            setupUI()
        }else{ finish() }
    }

}
