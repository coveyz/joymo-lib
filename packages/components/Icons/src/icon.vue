<template>
	<component :is="useRenderIcon(props.icon)" :attrs="attrs"/>
</template>

<script setup lang="ts">
import { useRenderIcon } from './hooks/use-icon';
const props = defineProps({
	icon: {
		required: true,
		type: String,
		default: '',
	},
	attrs: {
		type: Object,
		default: () => ({}),
	},
});
</script>