export const getScreenStream = () => {
  return navigator.mediaDevices.getDisplayMedia().catch(console.error);
};

export const getAudioStream = () => {
  return navigator.mediaDevices.getUserMedia({ audio: true, video: false }).catch(console.error);
};
