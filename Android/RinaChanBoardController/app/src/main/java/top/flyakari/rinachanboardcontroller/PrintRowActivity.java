package top.flyakari.rinachanboardcontroller;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import top.flyakari.rinachanboardcontroller.udp.UdpClientConnector;

public class PrintRowActivity extends AppCompatActivity {
    private Button mBtnSendText;
    private TextView mTxtEd;
    private UdpClientConnector mUdpClientConnector;

    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_print_row);
        mBtnSendText = findViewById(R.id.btn_send_text);
        mTxtEd=findViewById(R.id.et_text_row);
        mUdpClientConnector=UdpClientConnector.getInstance();
        mBtnSendText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String txt=mTxtEd.getText().toString();
                mUdpClientConnector.sendStr("CN"+txt);
            }
        });
    }
}
