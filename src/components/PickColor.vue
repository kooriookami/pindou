<template>
  <el-dialog
    :model-value="visible"
    title="挑选色号"
    width="500px"
    :before-close="closeDialog"
  >
    <el-form :model="form" label-width="auto">
      <el-form-item label="我的色号">
        <el-select
          v-model="form.myPalette"
          multiple
          filterable
          collapse-tags
          clearable
          @change="changeMyPalette"
        >
          <template #header>
            <el-button type="primary" link @click="selectAll">点击全选</el-button>
          </template>
          <el-option
            v-for="item in palette"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
            <div class="flex items-center">
              <el-tag :color="item.color" style="margin-right: 10px" size="small" />
              <span>{{ item.name }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive } from 'vue';
import palette from '../assets/palette';

const emit = defineEmits(['update:visible']);
const props = defineProps({
  visible: Boolean,
});

const form = reactive({
  myPalette: [],
});

try {
  form.myPalette = JSON.parse(localStorage.getItem('myPalette')) || palette.map(item => item.name);
} catch {

}

const closeDialog = () => {
  emit('update:visible', false);
};

const changeMyPalette = () => {
  localStorage.setItem('myPalette', JSON.stringify(form.myPalette));
};

const selectAll = () => {
  form.myPalette = palette.map(item => item.name);
  changeMyPalette();
};
</script>

<style scoped lang="scss">
.el-tag {
  border: none;
  aspect-ratio: 1;
}
</style>
