<template>
  <el-dialog
    :model-value="visible"
    title="色板预览"
    width="1222px"
    :before-close="closeDialog"
  >
    <el-radio-group v-model="sort">
      <el-radio-button value="default">默认</el-radio-button>
      <el-radio-button value="l">亮度</el-radio-button>
      <el-radio-button value="c">色度</el-radio-button>
      <el-radio-button value="h">色相</el-radio-button>
    </el-radio-group>
    <div class="palette-content">
      <div
        v-for="item in sortedPalette"
        :key="item.name"
        class="palette-item"
        :style="paletteItemStyle(item)"
      >
        <span>{{ item.name }}</span>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import chroma from 'chroma-js';
import { computed, ref } from 'vue';
import palette from '../assets/palette';

const emit = defineEmits(['update:visible']);
const props = defineProps({
  visible: Boolean,
});

const sort = ref('default');

const closeDialog = () => {
  emit('update:visible', false);
};

const paletteItemStyle = item => {
  const l = chroma(item.color).oklch()[0];
  return {
    background: item.color,
    color: l < 0.7 ? 'white' : 'black',
  };
};

const sortedPalette = computed(() => {
  if (sort.value === 'default') {
    return palette;
  } else {
    return palette.toSorted((a, b) => {
      const lchMap = {
        l: 0,
        c: 1,
        h: 2,
      };
      const l1 = chroma(a.color).oklch()[lchMap[sort.value]];
      const l2 = chroma(b.color).oklch()[lchMap[sort.value]];
      return l2 - l1;
    });
  }
});
</script>

<style scoped lang="scss">
.palette-content {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .palette-item {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

