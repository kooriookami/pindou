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
          <div v-if="form.mardColor" class="mard-block" :style="mardBlockStyle">
            <span>{{ form.mardName }}</span>
          </div>
          <el-button type="primary" link @click="handlePick">已选 {{ myPalette.length }} 色，点击管理</el-button>
        </div>
      </el-form-item>
      <el-form-item label="色板">
        <el-button type="primary" link @click="handlePreview">点击预览</el-button>
      </el-form-item>
    </el-form>

    <PalettePreview v-model:visible="previewVisible" />
    <PickColor v-model:visible="pickVisible" @update:visible="updateMyPalette" />
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import chroma from 'chroma-js';
import palette from '../assets/palette';
import PalettePreview from '@/components/PalettePreview.vue';
import PickColor from '@/components/PickColor.vue';

const form = reactive({
  color: '',
  mardName: '',
  mardColor: '',
});

const previewVisible = ref(false);
const pickVisible = ref(false);
const myPalette = ref([]);

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
      form.mardColor = item.color;
    }
  });
};

const mardBlockStyle = computed(() => {
  if (!form.mardColor) {
    return;
  }
  const l = chroma(form.mardColor).oklch()[0];

  return {
    background: form.mardColor,
    color: l < 0.7 ? 'white' : 'black',
  };
});

const handlePreview = () => {
  previewVisible.value = true;
};

const handlePick = () => {
  pickVisible.value = true;
};

const updateMyPalette = () => {
  try {
    myPalette.value = JSON.parse(localStorage.getItem('myPalette')) || palette.map(item => item.name);
    changeColor();
  } catch {

  }
};

updateMyPalette();
</script>

<style lang="scss" scoped>
.container {
  padding: 16px;

  .el-alert {
    margin-bottom: 10px;
  }

  .mard-block {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
