<template>
  <div class="container">
    <el-alert type="primary" :closable="false">请选择颜色，会自动匹配 Mard 色号</el-alert>
    <el-form :model="form" label-width="auto">
      <el-form-item label="颜色">
        <el-color-picker v-model="form.color" @change="changeColor"></el-color-picker>
      </el-form-item>
      <el-form-item label="色号">
        <div class="mard-block" :style="mardBlockStyle">
          <span>{{ form.mardName }}</span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';
import chroma from 'chroma-js';
import palette from '../assets/palette.js';

const form = reactive({
  color: '',
  mardName: '',
  mardColor: '',
});

const changeColor = () => {
  let deltaE = 100;
  palette.forEach(item => {
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
    color: l < 0.7 ? 'white' : 'black'
  };
});

</script>

<style lang="scss" scoped>
.container {
  padding: 20px;

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
