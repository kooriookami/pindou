<template>
  <div class="mard-block" :style="mardBlockStyle">
    <span class="mard-name">{{ mardName }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import chroma from 'chroma-js';
import palette from '../assets/palette';

const props = defineProps({
  size: {
    type: Number,
    default: 32,
  },
  mardName: String,
});

const mardBlockStyle = computed(() => {
  const mard = palette.find(item => item.name === props.mardName);
  if (!mard) {
    return;
  }
  const l = chroma(mard.color).oklch()[0];

  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
    background: mard.color,
    color: l < 0.7 ? 'white' : 'black',
  };
});
</script>

<style scoped lang="scss">
.mard-block {
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.1s;

  &:hover {
    transform: scale(2);
    box-shadow: 0 0 0 4px white;

    .mard-name {
      opacity: 0.2;
    }
  }
}
</style>
