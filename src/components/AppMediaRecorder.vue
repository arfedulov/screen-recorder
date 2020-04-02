<template>
  <div class="media-recorder">
    <div class="video-cantainer" :style="videoContainerStyles">
      <video
        class="video"
        :controls="showVideo"
        ref="video"
        :width="videoSizes[0]"
        :height="videoHeight[1]"
        :src="recordUrl"
      />
    </div>

    <div class="controls">
      <button class="button" :disabled="mediaToggleDisabled" :title="toggleVideoTitle" @click="onToggleRecordVideo">
        <img v-if="recordVideo" class="icon" src="../assets/icons/cam.svg" />
        <img v-else class="icon" src="../assets/icons/cam-disabled.svg" />
      </button>

      <button class="button" :disabled="mediaToggleDisabled" :title="toggleAudioTitle" @click="onToggleRecordAudio">
        <img v-if="recordAudio" class="icon" src="../assets/icons/mic.svg" />
        <img v-else class="icon" src="../assets/icons/mic-disabled.svg" />
      </button>

      <button v-if="showStartRecordingButton" class="button" @click="onStartRecording" title="Start recording">
        <img class="icon" src="../assets/icons/record.svg" />
      </button>
      <button v-else class="button" @click="onStopRecording" title="Stop">
        <img class="icon" src="../assets/icons/stop.svg" />
      </button>

      <button v-if="showPauseRecordingButton" class="button" title="Pause" @click="onPauseRecording">
        <img class="icon" src="../assets/icons/pause.svg" />
      </button>
      <button v-else class="button" :disabled="resumeButtonDisabled" title="Resume" @click="onResumeRecording">
        <img class="icon" src="../assets/icons/resume-record.svg" />
      </button>

      <button class="button" :disabled="downloadButtonDisabled" title="Download" @click="onDownloadRecord">
        <img class="icon" src="../assets/icons/download.svg" />
      </button>
    </div>
  </div>
</template>

<script>
const RECORDER_STATE = {
  RECORDING: 'recording',
  INACTIVE: 'inactive',
  PAUSED: 'paused',
};

const getCombinedStream = (...streams) => {
  const tracks = streams.map(stream => stream && stream.getTracks())
    .filter(val => !!val)
    .flat();

  return new MediaStream(tracks);
};

export default {
  name: 'AppMediaRecorder',
  props: {
    videoStream: {
      type: [MediaStream, Boolean],
      default: false,
    },
    audioStream: {
      type: [MediaStream, Boolean],
      default: false,
    },
    videoWidth: {
      type: Number,
      default: 300,
    },
    videoHeight: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      recordBlob: null,
      recordVideo: true,
      recordAudio: false,
      recorderState: RECORDER_STATE.INACTIVE,
    };
  },
  computed: {
    mediaToggleDisabled() {
      return this.recorderState !== RECORDER_STATE.INACTIVE;
    },
    toggleVideoTitle() {
      return this.recordVideo ? 'Disable video recording' : 'Enable video recording';
    },
    toggleAudioTitle() {
      return this.recordAudio ? 'Disable audio recording' : 'Enable audio recording';
    },
    videoSizes() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const res = w / h;
      const width = Math.min(w, 800);
      const height = width / res;

      return [ width, height ];
    },
    videoContainerStyles() {
      return {
        '--video-width': `${this.videoSizes[0]}px`,
        '--video-height': `${this.videoSizes[1]}px`,
      };
    },
    showVideo() {
      return this.recordUrl !== '';
    },
    combinedStream() {
      if (!this.waitForAudioStream && !this.waitForVideoStream) {
        return getCombinedStream(...[ this.recordAudio && this.audioStream, this.recordVideo && this.videoStream ]);
      }

      return null;
    },
    waitForAudioStream() {
      return this.recordAudio && !this.audioStream && this.audioStream !== false;
    },
    waitForVideoStream() {
      return this.recordVideo && !this.videoStream && this.videoStream !== false;
    },
    recorder() {
      if (!this.combinedStream) {
        return null;
      }

      const recorder = new MediaRecorder(this.combinedStream);
      recorder.ondataavailable = (dataObj) => this.recordBlob = dataObj.data;

      return recorder;
    },
    showStartRecordingButton() {
      return this.recorderState === RECORDER_STATE.INACTIVE;
    },
    showPauseRecordingButton() {
      return this.recorderState === RECORDER_STATE.RECORDING;
    },
    recordUrl() {
      if (this.recordBlob) {
        return URL.createObjectURL(this.recordBlob);
      }

      return '';
    },
    resumeButtonDisabled() {
      return this.recorderState !== RECORDER_STATE.PAUSED;
    },
    downloadButtonDisabled() {
      return !this.recordBlob;
    },
  },
  methods: {
    onToggleRecordAudio() {
      this.recordAudio = !this.recordAudio;
    },
    onToggleRecordVideo() {
      this.recordVideo = !this.recordVideo;
    },
    onStopRecording() {
      this.recorder.stop();
      this.recorderState = this.recorder.state;

      if (this.$refs.video.srcObject) {
        this.$refs.video.srcObject = null;
      }
    },
    onStartRecording() {
      this.recordBlob = null;

      this.$nextTick(() => {
        this.recorder.start();
        this.recorderState = this.recorder.state;

        if (this.recordVideo) {
          this.$refs.video.srcObject = this.videoStream;
          this.$refs.video.play();
        }
      });
    },
    onPauseRecording() {
      this.recorder.pause();
      this.recorderState = this.recorder.state;

      if (this.recordVideo) {
        this.$refs.video.pause();
      }
    },
    onResumeRecording() {
      this.recorder.resume();
      this.recorderState = this.recorder.state;

      if (this.recordVideo) {
        this.$refs.video.play();
      }
    },
    onDownloadRecord() {
      if (this.recordUrl !== '') {
        const a = document.createElement('a');
        a.href = this.recordUrl;
        a.download = `screen-record-${Date.now()}`;
        a.click();
      }
    },
  },
}
</script>

<style scoped>
.video-cantainer {
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--video-width);
  height: var(--video-height);
  margin-bottom: 40px;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  padding: 5px 10px;
  border: 1px solid lightgray;
  border-radius: 5px;
  width: fit-content;
}

.button {
  border: 1px solid lightgray;
  background-color: transparent;
  font-size: 1.5em;
  border-radius: 5px;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0 4px;
  padding: 4px;

  min-width: 3em;
  width: fit-content;
  height: 1.8em;
}

.icon {
  display: block;
  height: 100%;
  max-width: 100%;
}

.button[disabled] {
  opacity: .5;
  cursor: not-allowed;
  outline: none;
}
</style>
