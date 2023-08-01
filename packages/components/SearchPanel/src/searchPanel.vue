<script setup lang="ts">
//@ts-ignore
// import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { useWrapper } from './hooks/use-searchPanel';
const { id, hidden, showHiddenBtn, toggle } = useWrapper();
</script>

<script lang="ts">
export default {
  name: 'SearchPanel'
}
</script>

<template>
	<div :id="id" class="search-wrapper" :class="{ 'wrapper-hidden': hidden }">
    <slot />
		<div class="form-btn">
      <slot name="btn" />
			<div @click="toggle" v-if="showHiddenBtn">
				<!-- <el-button v-if="hidden" :icon="ArrowDown" class="more-btn" /> -->
				<!-- <el-button v-else :icon="ArrowUp" class="more-btn" /> -->
			</div>
		</div>
	</div>
</template>