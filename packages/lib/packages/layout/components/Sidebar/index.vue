<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import settings from '../../../config';
import { usePermissionStore } from '../../../store/modules/permission';
import SidebarItem from './SidebarItem.vue';

const showLogo = ref(true);
// route = useRoute();
const route = ref<any>(null);

onMounted(() => {
	route.value = useRoute();
});

// const activeMenu = computed(() => {
// 	// const { path } = route;
// 	console.log('route=>', route);
// 	if (route.meta && route.meta.activeMenu) {
// 		return route.meta.activeMenu as string; //todo
// 	}
// 	return route?.path || '';
// });

const activeMenu = computed(() => {
	console.log('route=>', route);
	if (route.value?.meta?.activeMenu) {
		return route.value?.meta.activeMenu as string;
	}
	return route.value?.path || '';
});

const defaultOpeneds = computed(() => {
	if (settings.platform === 'joymolib') {
		return ['/guide', '/biz-component'];
	}
	return [];
});

//🧀 todo useApp
const isCollapse = computed(() => {
	return false;
});

const uniqueOpened = computed(() => {
	return settings.platform !== 'joymolib';
});

const sidebarRouters = computed(() => {
	return usePermissionStore().sidebarRouters;
});
</script>

<template>
	<div :class="['sidebar-container', showLogo ? 'has-logo' : '']">
		<!-- Logo -->
		<el-scrollbar wrap-class="scrollbar-wrapper">
			<el-menu
				router
				:default-active="activeMenu"
				:default-openeds="defaultOpeneds"
				:collapse="isCollapse"
				:unique-opened="uniqueOpened"
				:collapse-transition="false"
				mode="vertical"
			>
				<sidebar-item v-for="(route, index) in sidebarRouters" :key="route.path + index" :item="route" :base-path="route.path" />
			</el-menu>
		</el-scrollbar>
	</div>
</template>

<style scoped></style>
