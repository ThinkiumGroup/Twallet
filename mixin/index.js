export const BackPress = {
	//原生点击返回按键
	onBackPress(e) {
		if (e.from === 'navigateBack') {  
		   return false;  
		}
		this.$refs.returnPopup.openReturnPopup()
		
		return true;
		
	},
	//头部返回按钮 配合头部组件返回自定义事件
	methods: {
		backPopup () {
			this.$refs.returnPopup.openReturnPopup()
		},
	}
}