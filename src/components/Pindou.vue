<template>
  <div class="container">
    <el-alert type="primary" :closable="false">请选择颜色，会自动匹配 Mard 色号</el-alert>
    <el-form :model="form" label-width="auto">
      <el-form-item label="颜色">
        <el-color-picker v-model="form.color" @change="changeColor" />
        <el-text>（← 点击选择颜色）</el-text>
      </el-form-item>
      <el-form-item label="色号">
        <div style="display: flex;gap: 5px">
          <MardBlock v-if="form.mardName && myPalette.length" :mard-name="form.mardName" />
          <el-button type="primary" link @click="handlePick">已选 {{ myPalette.length }} 色，点击管理</el-button>
        </div>
      </el-form-item>
      <el-form-item label="色板">
        <el-button type="primary" link @click="handlePreview">点击预览</el-button>
      </el-form-item>
    </el-form>

    <PalettePreview v-model:visible="previewVisible" />
    <PickColor v-model:visible="pickVisible" @update:visible="changeColor" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import chroma from 'chroma-js';
import palette from '@/assets/palette';
import useMyPalette from '@/hooks/useMyPalette';
import PalettePreview from '@/components/PalettePreview.vue';
import PickColor from '@/components/PickColor.vue';
import MardBlock from '@/components/MardBlock.vue';

const form = reactive({
  color: '',
  mardName: '',
});

const previewVisible = ref(false);
const pickVisible = ref(false);

const { myPalette } = useMyPalette();

const changeColor = () => {
  if (!form.color) {
    return;
  }
  let deltaE = 100;
  palette.filter(item => myPalette.value.includes(item.name) && item.name !== 'H1').forEach(item => {
    const chromaDeltaE = chroma.deltaE(form.color, item.color);
    if (chromaDeltaE <= deltaE) {
      deltaE = chromaDeltaE;
      form.mardName = item.name;
    }
  });
};

const handlePreview = () => {
  previewVisible.value = true;
};

const handlePick = () => {
  pickVisible.value = true;
};
</script>

<style lang="scss" scoped>
.container {
  padding: 16px;

  .el-alert {
    margin-bottom: 10px;
  }
}
</style>
