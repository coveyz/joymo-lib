<script setup lang="ts">
import { computed } from 'vue';
// import { useRenderIcon } from '@/components/Icons/hooks/hook';

const props = defineProps({
	icon: {
		type: String,
		default: '',
	},
	title: {
		type: String,
		default: '',
	},
});

const getMenuTextStyle = computed(() => {
	return {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		outline: 'none',
	};
});
</script>

<template>
	<!-- <template v-if="props.icon">
		<component class="svg-icon" :is="useRenderIcon(props.icon, { style: { 'margin-right': '5px', 'flex-shrink': '0' } })" />
	</template> -->
	<span v-if="props.title" :style="getMenuTextStyle"> {{ props.title }} </span>
</template>

<style scoped></style>
