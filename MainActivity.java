
package com.example.boycottalert;

import android.Manifest;
import android.content.pm.PackageManager;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.Vibrator;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.RecognitionListener;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    private Button toggleButton;
    private boolean isListening = false;
    private SpeechRecognizer speechRecognizer;
    private Intent recognizerIntent;

    private final List<String> boycottList = Arrays.asList(
            "pepsi", "coca cola", "nestle", "mcdonald's", "domino's", "starbucks", "kfc",
            "lays", "maggi", "sprite", "appy fizz", "mountain dew", "pizza hut", "tropicana",
            "fanta", "bournvita", "cadbury", "dairy milk", "unilever", "pond's", "vaseline",
            "glow and lovely", "lux", "surf excel", "lipton", "brooke bond", "red label",
            "kitkat", "nescafe", "johnson and johnson", "dettol", "colgate", "closeup",
            "palmolive", "garnier", "loreal", "revlon", "pantene", "head and shoulders",
            "magnum", "amul", "oreo", "bisleri", "aquafina", "kinley", "minute maid",
            "real juice", "kinder joy", "nutella", "toblerone", "7up"
    );

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        toggleButton = findViewById(R.id.toggleButton);

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.RECORD_AUDIO}, 1);
        }

        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this);
        recognizerIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault());

        speechRecognizer.setRecognitionListener(new RecognitionListener() {
            @Override public void onReadyForSpeech(Bundle params) {}
            @Override public void onBeginningOfSpeech() {}
            @Override public void onRmsChanged(float rmsdB) {}
            @Override public void onBufferReceived(byte[] buffer) {}
            @Override public void onEndOfSpeech() {
                if (isListening) speechRecognizer.startListening(recognizerIntent);
            }
            @Override public void onError(int error) {
                if (isListening) speechRecognizer.startListening(recognizerIntent);
            }
            @Override public void onResults(Bundle results) {
                ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                if (matches != null) {
                    for (String word : matches) {
                        for (String keyword : boycottList) {
                            if (word.toLowerCase().contains(keyword)) {
                                triggerAlert();
                                return;
                            }
                        }
                    }
                }
                if (isListening) speechRecognizer.startListening(recognizerIntent);
            }
            @Override public void onPartialResults(Bundle partialResults) {}
            @Override public void onEvent(int eventType, Bundle params) {}
        });

        toggleButton.setOnClickListener(v -> {
            if (!isListening) {
                speechRecognizer.startListening(recognizerIntent);
                toggleButton.setText("Stop Listening");
                isListening = true;
                Toast.makeText(MainActivity.this, "Listening started", Toast.LENGTH_SHORT).show();
            } else {
                speechRecognizer.stopListening();
                toggleButton.setText("Start Listening");
                isListening = false;
                Toast.makeText(MainActivity.this, "Listening stopped", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void triggerAlert() {
        MediaPlayer mediaPlayer = MediaPlayer.create(this, android.provider.Settings.System.DEFAULT_ALARM_ALERT_URI);
        mediaPlayer.start();

        Vibrator vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
        vibrator.vibrate(1000);

        runOnUiThread(() -> Toast.makeText(MainActivity.this, "Boycott Product Detected – No Thanks!", Toast.LENGTH_LONG).show());
    }
}
