import { ref, watchEffect } from 'vue';
import palette from '@/assets/palette';

let isInit = false;
const myPalette = ref([]);

const getMyPalette = () => {
  try {
    myPalette.value = JSON.parse(localStorage.getItem('myPalette')) || palette.map(item => item.name);
  } catch {

  }
};
const setMyPalette = () => {
  localStorage.setItem('myPalette', JSON.stringify(myPalette.value));
};

const init = () => {
  if (!isInit) {
    getMyPalette();
    watchEffect(setMyPalette);
    isInit = true;
  }
};

export default function useMyPalette() {
  init();

  return {
    myPalette,
  };
}
