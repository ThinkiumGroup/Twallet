<template>

    <view style="display:flex;flex-direction:row;justify-content:center;align-items:flex-start;">

        <image v-if="src !=''" :style="{width:width,height:height}" :class="[iconClass]" :src="'/static/icon/'+src+'.png'"></image>

        <text v-if="icon !='' " :class="['iconfont',icon,iconClass]" :style="{fontSize:fontSize,color:fontColor}" ></text>

        <!--thk-star font-color-light-->

    </view>

</template>

<script>

    export default {
        data() {
            return {

            };
        },
        name: 'icon-font',
        computed: {

        },
        props: {
            icon:{
                type: String,
                default: ''
            },
            color:{
                type: String,
                default: ''
            },
            fontSize :{
                type: String,
                default: ''
            },
            fontColor:{
                type: String,
                default: ''
            },

            src: {
                type: String,
                default: ''
            },
            width :{
                type: String,
                default: ''
            },
            height :{
                type: String,
                default: ''
            },

            iconClass:{
                type: String,
                default: ''
            }
        },
        created(){
            
        },
        methods: {

            BackPage() {

            }
        }
    }
</script>

<style lang="scss">

</style>
