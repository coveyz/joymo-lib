<!-- <script lang="ts">
export default {
	name: 'JSearchPanel',
};
</script> -->

<script setup lang="ts">
//@ts-ignore
import { useWrapper } from './hooks/use-searchPanel';
import { useRenderIcon } from '@coveyz/components';
const { id, hidden, showHiddenBtn, toggle } = useWrapper();


defineOptions({
  name: 'JSearchPanel',
})
</script>

<template>
	<div :id="id" class="search-wrapper" :class="{ 'wrapper-hidden': hidden }">
		<slot />
		<div class="form-btn">
			<slot name="btn" />
			<div @click="toggle" v-if="showHiddenBtn">
				<!-- <el-button v-if="hidden" :icon="useRenderIcon('ep:arrow-up')" class="more-btn" />
				<el-button v-else :icon="useRenderIcon('ep:arrow-down')" class="more-btn" /> -->
			</div>
		</div>
	</div>
</template>
