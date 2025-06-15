<template>
  <el-dialog
    :model-value="visible"
    title="色板预览"
    width="1222px"
    :before-close="closeDialog"
  >
    <div class="operation-group">
      <el-radio-group v-model="sort">
        <el-radio-button value="default">默认</el-radio-button>
        <el-radio-button value="l">亮度</el-radio-button>
        <el-radio-button value="c">色度</el-radio-button>
        <el-radio-button value="h">色相</el-radio-button>
      </el-radio-group>

      <el-checkbox v-model="showMine">只看我的</el-checkbox>
    </div>
    <div class="palette-content">
      <MardBlock
        v-for="item in sortedPalette"
        :key="item.name"
        :size="40"
        :mard-name="item.name"
      />
    </div>
  </el-dialog>
</template>

<script setup>
import chroma from 'chroma-js';
import { computed, ref } from 'vue';
import palette from '@/assets/palette';
import useMyPalette from '@/hooks/useMyPalette';
import MardBlock from '@/components/MardBlock.vue';

const emit = defineEmits(['update:visible']);
const props = defineProps({
  visible: Boolean,
});

const { myPalette } = useMyPalette();
const sort = ref('default');
const showMine = ref(false);

const closeDialog = () => {
  emit('update:visible', false);
};

const sortedPalette = computed(() => {
  const filteredPalette = showMine.value ? palette.filter(item => myPalette.value.includes(item.name)) : palette;
  if (sort.value === 'default') {
    return filteredPalette;
  } else {
    return filteredPalette.toSorted((a, b) => {
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
.operation-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.palette-content {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>

