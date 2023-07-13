<script setup lang="ts">
import path from 'path-browserify';
import { childrenType } from './type';
import { PropType, ref, computed } from 'vue';
import Item from './Item.vue';
import AppLink from './Link.vue';
import Settings from '../../../config';

const props = defineProps({
	item: {
		type: Object as PropType<any>,
	},
	isNest: {
		type: Boolean,
		default: false,
	},
	basePath: {
		type: String,
		default: '',
	},
});

const platform = computed(() => {
  return Settings.platform
})

const onlyOneChild: childrenType = ref(null);
const alwaysShowRootMenu = computed(() => {
	if (props.item.meta && props.item.meta.alwaysShow) {
		return true;
	}
	return false;
});

const hasOneShowingChild = (children: childrenType[] = [], parent: childrenType) => {
  if (!children) {
        children = [];
      }
      const showingChildren = children.filter(item => {
        if (props.item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          onlyOneChild.value = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
};

const resolvePath = (routePath: string = '') => {
	//todo
	//todo
	return path.resolve(props.basePath, routePath);
};
</script>


<template>
	<div v-if="!props.item || !props.item.hidden">
		<!-- if -->
		<template
			v-if="
				hasOneShowingChild(props.item.children, props.item) &&
				(!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
				!item.alwaysShow
			"
		>
			<!-- <app-link :to="resolvePath(onlyOneChild.path)" v-if="onlyOneChild.meta">
				<el-menu-item :index="resolvePath(onlyOneChild.path)">
					<Item :icon="onlyOneChild.meta?.icon || (props.item.meta && props.item.meta.icon)" :title="onlyOneChild.meta?.title" />
				</el-menu-item>
			</app-link> -->
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            v-if="platform === 'joymolib'"
            :title="onlyOneChild.meta.title"
          />
          <item
            v-else
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
		</template>
		<!-- else -->
		<el-sub-menu v-else :index="resolvePath(item.path)" popper-append-to-body>
			<template #title>
					<Item v-if="props.item.meta" :icon="props.item.meta && props.item.meta.icon" :title="props.item.meta.title" />
			</template>
			<!-- <template v-if="props.item.children"> -->
			<SidebarItem
				v-for="child in props.item.children"
				:key="child.path"
				:is-nest="true"
				:item="child"
				:base-path="resolvePath(child.path)"
				class="nest-menu"
			/>
			<!-- </template> -->
		</el-sub-menu>
	</div>
</template>
<style scoped></style>
