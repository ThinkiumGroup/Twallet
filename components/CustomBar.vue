<template>
    <view 
			class="custom-bar-container" 
			:style="{paddingTop: customBar + 5 + 'px', ...styles}"
		/>
</template>

<script>

    export default {
        props: {
            title: {
                type: String,
                default: ''
            },
            isgoBack: {
                type: Boolean,
                default: true
            },
            confirm: {
                type: Boolean,
                default: false
            },
						styles: {
							type: Object,
							default: () => ({})
						}

        },
        data() {
            return {
                customBar: 0,
            }
        },
        methods: {
            goBack() {
                this.confirm ? this.$emit('customizeBack') : uni.navigateBack()
            }
        },
        created(){
            // #ifndef H5
            this.customBar = plus.navigator.getStatusbarHeight();
            // #endif
        },
        
    }
</script>

<style lang="scss" scoped>
    .custom-bar-container {
        width: 100%;
        background: #FBFBFB;
        box-sizing: border-box;
    }
</style>
