const flames = document.querySelectorAll(".flame, .flame2, .flame3");
      const text = document.querySelector(".text");

      function extinguishCandles() {
        flames.forEach((flame) => {
          flame.style.opacity = "0"; // Extinguish the flame
        });
        text.style.top = "-90px";
        text.style.opacity = "1";
      }

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const audioContext = new AudioContext();
          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);

          microphone.connect(analyser);
          analyser.connect(audioContext.destination);

          analyser.fftSize = 256;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          function detectBlow() {
            analyser.getByteFrequencyData(dataArray);
            const average =
              dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;

            // Adjust this threshold according to your environment
            const threshold = 50;

            if (average > threshold) {
              // Hide the flame
              extinguishCandles();
            }
            //else {
            // Show the flame
            //  flame.style.opacity = 1;
            //}

            requestAnimationFrame(detectBlow);
          }

          detectBlow();
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
