<template>
	<view class="forsageExplain">
		<!-- <CustomBar class="topBar" :styles="{background: '#fff'}"/> -->
		<!-- <view></view> -->
		<!-- <text></text> -->
		<view class="explainTop">
			<image src="../../static/image/forsage/explainTop.png"></image>
			<view class="explainTopTitle">
				<view class="titleTop">
					<view class="titleTopText">
                        <image src="../../static/image/forsage/explainTopImg1.png"></image>
					</view>
					<view class="titleTopBorder"></view>
				</view>
				<view class="titlebottom">
					<view class="titlebottomText">Global Decentralized Ecosystem
					</view>

				</view>
			</view>

		</view>
		<view class="explainTopIntroduce">
            <view>
                Decentralized marketing is powered by the revolutionary smart contract technology*. 
            </view>
            <view>
                The code for Forsage’s smart contract can be seen here fully open, so you can be completely confident in the security and long-term operation of the project.
            </view>
            <text class="explainTopIntroduceYuan topYuan"></text>
            <text class="explainTopIntroduceYuan bottomYuan"></text>
        </view>
       <view class="explainDetails">
            <!-- v-for="(item,index) in itemList" :key="index" -->
           <!-- <view class="explainDetailItem" v-for="(item,index) in itemList" :key="index">
               <view class="explainDetailItemTop">
                   <image src="../../static/image/forsage/gift.png"></image>
               <view class="itemTopTitle">
                   <image :src="item.img"></image>
               </view>
               </view>
               <view  class="explainDetailItemBottom">
                   <view class="itemLine"></view>
                   <view class="itemBottomText">
                       {{ item.title }}
                   </view>
               </view>
           </view> -->
           <view class="explainDetailItem">
               <view class="explainDetailItemTop">
                   <image src="../../static/image/forsage/gift.png"></image>
               <view class="itemTopTitle">
                  <image style="width:187rpx;" src="../../static/image/forsage/explainImg1.png"></image>
               </view>
               </view>
               <view  class="explainDetailItemBottom">
                   <view class="itemLine"></view>
                   <view class="itemBottomText">
                      On February 22, 2021, Forsage developers deployed a self-executing smart contract on the Thinkium Blockchain that exists in perpetuity and cannot be modified by any entity.
                   </view>
               </view>
           </view>
           <view class="explainDetailItem">
               <view class="explainDetailItemTop">
                   <image src="../../static/image/forsage/gift.png"></image>
               <view class="itemTopTitle">
                  <image  style="width:550rpx;" src="../../static/image/forsage/explainImg2.png"></image>
               </view>
               </view>
               <view  class="explainDetailItemBottom">
                   <view class="itemLine"></view>
                   <view class="itemBottomText">
                      The Forsage smart contract is nothing more than a payment gateway that facilitates peer-to-peer commission payments between its participants.
                   </view>
               </view>
           </view>
           <view class="explainDetailItem">
               <view class="explainDetailItemTop">
                   <image src="../../static/image/forsage/gift.png"></image>
               <view class="itemTopTitle">
                  <image style="width:619rpx;" src="../../static/image/forsage/explainImg3.png"></image>
               </view>
               </view>
               <view  class="explainDetailItemBottom">
                   <view class="itemLine"></view>
                   <view class="itemBottomText">
                     The smart contract is public. Anyone can see the code and the entire transaction history. This guarantees the integrity of the system and real project statistics.
                   </view>
               </view>
           </view>
           <view class="explainDetailItem">
               <view class="explainDetailItemTop">
                   <image src="../../static/image/forsage/gift.png"></image>
               <view class="itemTopTitle">
                  <image style="width:449rpx;" src="../../static/image/forsage/explainImg4.png"></image>
               </view>
               </view>
               <view  class="explainDetailItemBottom">
                   <view class="itemLine"></view>
                   <view class="itemBottomText">
                     The profit routes from other members directly into your personal wallet. There is no hoarding in the system, the income belongs only to you.
                   </view>
               </view>
           </view>
           <view class="explainDetailItem">
               <view class="explainDetailItemTop">
                   <image src="../../static/image/forsage/gift.png"></image>
               <view class="itemTopTitle">
                  <image  style="width:358rpx;" src="../../static/image/forsage/explainImg5.png"></image>
               </view>
               </view>
               <view  class="explainDetailItemBottom">
                   <view class="itemLine"></view>
                   <view class="itemBottomText">
                     There are no managers or administrators, there are only the creators who are equal participants in the project, like everyone else.
                   </view>
               </view>
           </view>
           <view class="explainDetailItem">
               <view class="explainDetailItemTop">
                   <image src="../../static/image/forsage/gift.png"></image>
               <view class="itemTopTitle">
                  <image style="width:232rpx;" src="../../static/image/forsage/explainImg6.png"></image>
               </view>
               </view>
               <view  class="explainDetailItemBottom">
                   <view class="itemLines"></view>
                   <view class="itemBottomText">
                       All funds are transferred between members, there are no hidden fees. The contract balance is always zero.
                   </view>
               </view>
           </view>
       </view>



	</view>
</template>
<script>
	import CustomBar from "../../components/CustomBar";
	import NoDefaultWallet from "../../components/NoDefaultWallet";
	import {
		mapState,
		mapGetters
	} from "vuex";
	export default {
		data() {
			return {
               itemList:[
                    {
                        name:'ZERO RISK',
                        img:'../../static/image/forsage/explainImg1.png',
                        title:'On February 22, 2021, Forsage developers deployed a self-executing smart contract on the Thinkium Blockchain that exists in perpetuity and cannot be modified by any entity.'
                    },
                    {
                        name:'IMMUTABILITY OF CONDITIONS',
                        img:'../../static/image/forsage/explainImg2.png',
                        title:'The Forsage smart contract is nothing more than a payment gateway that facilitates peer-to-peer commission payments between its participants.'
                    },
                    {
                        name:'TRANSPARENCY AND ANONYMITY',
                        img:'../../static/image/forsage/explainImg3.png',
                        title:'The smart contract is public. Anyone can see the code and the entire transaction history. This guarantees the integrity of the system and real project statistics.'
                    },
                    {
                        name:'INSTANT TRANSACTIONS',
                        img:'../../static/image/forsage/explainImg4.png',
                        title:'The profit routes from other members directly into your personal wallet. There is no hoarding in the system, the income belongs only to you.'
                    },
                    {
                        name:'DECENTRALIZATION',
                        img:'../../static/image/forsage/explainImg5.png',
                        title:'There are no managers or administrators, there are only the creators who are equal participants in the project, like everyone else.'
                    },
                    // {
                    //     name:'100% ONLINE',
                    //     title:'All funds are transferred between members, there are no hidden fees. The contract balance is always zero.'
                    // }
                ],
			};
		},
		onShow() {


		},
		onReady() {

		},
		onLoad(option) {
			if (option.src) this.src = option.src;


		},

		computed: {
			...mapState(["defaultWallet"]),
			...mapGetters(["hasDefaultWallet"])
		},
		components: {
			CustomBar,
			NoDefaultWallet
		},
		methods: {

		}
	};
</script>

<style scoped lang="scss">
	.forsageExplain {
		width: 750rpx;

		.explainTop {
            position: relative;
			width: 740rpx;
			// margin-bottom: 45rpx;
			image {
				width: 100%;
			    height: 379rpx;
            }
            .explainTopTitle {
				width: 750rpx;
				margin: 0 auto;
                text-align: center;
                position: absolute;
                top: 248rpx;
				.titleTop {
					margin: 0 auto;
					.titleTopText {
                        // // height: 53rpx;
                        // font-size: 44rpx;
                        // font-family: eryakuheiti;
                        // font-weight: 900;
                        // color: #F3CF9E;
                        // line-height: 22rpx;
                        image{
                            width: 587rpx;
                            height: 53rpx;
                        }
					}
					.titleTopBorder {
						margin: 0 auto;
						width: 328rpx;
                        height: 14rpx;
                        background: #3D4055;
                        border-radius: 5rpx;
                        margin-top: -24rpx;
						margin-bottom: 21rpx;
					}

				}
				.titlebottom {
					.titlebottomText {
                        height: 29rpx;
                        font-size: 30rpx;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #F3CF9E;
                        line-height: 30rpx;
                        padding-bottom: 28rpx;
					}
				}
            }
        }
        .explainTopIntroduce{
            position: relative;
            margin: 0 auto;
            margin-top: 41rpx;
            margin-bottom: 129rpx;
            width: 690rpx;
            height: 388rpx;
            background: linear-gradient(90deg, #303145, #44495E);
            box-shadow: 0rpx 11rpx 62rpx 0rpx rgba(21, 21, 34, 0.67);
            border-radius: 30rpx;
            view{
                // width: 614rpx;
                // height: 267rpx;
                padding-top: 60rpx;
                padding-left: 28rpx;
                margin: 0 auto;
                word-spacing: 5rpx;
                font-size: 28rpx;
                font-family: PingFang SC;
                font-weight: 400;
                color: #F3E4CF;
                line-height: 38rpx;
            }
            .explainTopIntroduceYuan{
                position: absolute;
				background: linear-gradient(90deg, #D6A364, #F8D9AD);
				border-radius: 50%;
				box-shadow: 1rpx 1rpx 20rpx 1rpx #F8D9AD;
            }
            .topYuan{
                width: 5rpx;
                height: 5rpx;
                top: -15rpx;
                left: 26rpx;
            }
            .bottomYuan{
                 width: 10rpx;
                height: 10rpx;
                bottom: -63rpx;
                right: 34rpx;
            }
        }
        .explainDetails{
            padding-bottom: 30rpx;
            .explainDetailItem{
                width: 100%;
                margin: 0 auto;
                
                .explainDetailItemTop{
                    height: 40rpx;
                    display: flex;
                    align-items: center;
                    image{
                        width: 40rpx;
                        height: 36rpx;
                        // margin-right: 20rpx;
                        margin-left: 29rpx;
                    }
                    .itemTopTitle{
                        height: 40rpx;
                        display: flex;
                    align-items: center;
                        image{
                            height: 31rpx;
                        }
                        // height: 31rpx;
                        // font-size: 36rpx;
                        // font-family: eryakuheiti;
                        // font-weight: 700;
                        // color: #F3CF9E;
                        // line-height: 30rpx;
                        // background: linear-gradient(0deg, #F8D9AD 0.146484375%, #D6A364 100%);
                        // -webkit-background-clip: text;
                        // -webkit-text-fill-color: transparent;
                    }
                }
                .explainDetailItemBottom{
                    display: flex;
                    // align-items: center;
                    .itemLine,.itemLines{
                        width: 2px;
                        height: 229rpx;
                        background: linear-gradient(0deg, #F8D9AD, #D6A364);
                        border-radius: 2px;
                        // margin-right: 37rpx;
                        // margin-left: 48rpx;
                        // margin-top: 10px;
                        margin: 10rpx 37rpx 13rpx 48rpx;
                    }
                    .itemLines{
                        
                        background: #23222A;
                    }
                    .itemBottomText{
                       
                        display: flex;
                        justify-content: center;
                        align-items: center;
                         margin-top: 50rpx;
                        margin-bottom: 57rpx;
                        width: 613rpx;
                        // height: 219rpx;
                        font-size: 28rpx;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #F3E4CF;
                        // line-height: 40rpx;
                    }
                }
            }
        }
    }
</style>
