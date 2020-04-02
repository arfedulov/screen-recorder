<template>
  <div id="app">
    <component :is="currentPage" @go="onGoToRecorderPage" />
  </div>
</template>

<script>
import StartPage from '@/components/StartPage.vue';
import RecorderPage from '@/components/RecorderPage.vue';

export default {
  name: 'App',
  components: { StartPage, RecorderPage },
  data() {
    return {
      currentPage: StartPage,
    };
  },
  methods: {
    onGoToRecorderPage() {
      this.currentPage = RecorderPage;
    },
  },
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  width: 100vw;
  height: 100vh;;
}
</style>
