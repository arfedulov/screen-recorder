<template>
  <div class="start-page">
    <h1>
      Screen video recorder
    </h1>
    <button class="button" @click="onGo">Let's go</button>
  </div>
</template>

<script>
export default {
  name: 'Start-Page',
  methods: {
    onGo() {
      this.$emit('go');
    },
  },
}
</script>

<style scoped>
.start-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.button {
  padding: .5em 1em;
  border: none;
  cursor: pointer;

  background-color: #6A7D8C;
  border-radius: 5px;
  color: #FFFFFF;
  font-weight: 500;
  font-size: 1.2em;
}
</style>
