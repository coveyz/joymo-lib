<template>
	<div class="play-container">
		<JSearchPanel>
			<el-form ref="form" :model="state.form">
				<el-form-item label="测试1:">
					<el-input v-model="state.form.test1" />
				</el-form-item>
				<el-form-item label="测试2:">
					<el-input v-model="state.form.test2" />
				</el-form-item>
				<el-form-item label="测试3:">
					<el-input v-model="state.form.test3" />
				</el-form-item>
			</el-form>
		</JSearchPanel>

		<JIcon icon="ep:arrow-up" :attrs="state.attrsUp" />
		<JIcon icon="ep:arrow-down" :attrs="state.attrsDown" />

    <JTestZkr />

    <div class="666">66</div>
	</div>
</template>

<script setup lang="ts">
// import { JSearchPanel } from '@coveyz/components'
// code here
import { reactive } from 'vue';

const state = reactive({
	form: {
		test1: '',
		test2: '',
		test3: '',
	},
	attrsUp: {
		color: 'red',
	},
	attrsDown: {
		color: 'blue',
	},
});
</script>

<style lang="scss">
html,
body {
	width: 100vw;
	height: 100vh;
	margin: 0;
	#play {
		height: 100%;
		width: 100%;
		.play-container {
			height: 100%;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
</style>
