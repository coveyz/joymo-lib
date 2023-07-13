<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
	to: {
		type: String,
		required: true,
	},
});

const type = computed(() => {
	// toodo
	return 'router-link';
});

const linkProps = (to: string) => {
	//todo
	return {
		to: to,
	};
};

// console.log('link=>', props.to);
</script>

<template>
	<component :is="type" v-bind="linkProps(props.to)">
		<slot />
	</component>
</template>

<style scoped></style>
