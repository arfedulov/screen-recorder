<template>
  <div class="recorder-page">
    <app-media-recorder :videoStream="videoStream" :audioStream="audioStream" />
  </div>
</template>

<script>
import AppMediaRecorder from '@/components/AppMediaRecorder.vue';
import {
  getScreenStream,
  getAudioStream,
} from '@/utils';

export default {
  name: 'RecorderPage',
  components: { AppMediaRecorder },
  data() {
    return {
      audioStream: false,
      videoStream: false,
    };
  },
  async mounted() {
    this.audioStream = await getAudioStream();
    this.videoStream = await getScreenStream();
  },
}
</script>

<style scoped>
.recorder-page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
