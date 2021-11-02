<template>
    <view>
       <view class="zclb">
			<view class="zclb_box1">
				<view class="tkm">
					<view class="tkm_left">
						<image src="../../static/image/home/icon_tkm.png"></image>
						<text>TKM</text>
					</view>
					<view class="tkm_right">
						<view class="t_r_t1">{{$lan('total')}}:</view>
						<!-- <view class="t_r_t2">-1366.23</view> -->
					</view>

				</view>
                 <view class="tkm_bottom">
                        <text>
                             SHWUEY327E382EY37RY4FHCE7UCGDYS123e2473eydegcf46
                        </text>

                    </view>
				<view class="zcl1">
					<view class="zcl1_cont" >
						<view class="zcl1_left">
                            <view class="zcl_img">
                                <view class="left_center">12</view>
                            </view>
							<!-- <image src="../../static/image/transfer/yh_r.png"></image> -->
							<view class="left_bottom">{{$lan('numberOfTransactions')}}</view>
						</view>
						<view class="zcl1_left">
                            <view class="zcl_img">
                                <view class="left_center">{{$lan('12')}}</view>
                            </view>
							<!-- <image src="../../static/image/transfer/yh_r.png"></image> -->
							<view class="left_bottom">{{$lan('numberOfAccounts')}}</view>
						</view>
					</view>
				</view>


			</view>


		<view class="llq_ban">

        </view>
        <view class="llq_search">
            <!-- <view class="sea_inp"> -->
                 <input type="text" :placeholder="this.$lan('pleaseEnterTransactionHashAccountAddress')"  >
        <!-- </view> -->
           <view class="sea_btn">
               <text>{{$lan('transactionInquiry')}}</text>
        </view>
        </view>
        <view class="llq_bottom">
            <view class="llq_cont1">
                <view class="llq_cont_txt1">{{$lan('mainChain')}}</view>
                 <view class="llq_cont_txt2">
                     {{$lan('blockHeight')}}
                 </view>
            </view>
            <view class="llq_cont1">
                <view class="llq_cont_txt1">{{$lan('mainChain')}}</view>
                 <view class="llq_cont_txt2">
                     {{$lan('blockHeight')}}
                 </view>
            </view>
            <view class="llq_cont1">
                <view class="llq_cont_txt1">{{$lan('mainChain')}}</view>
                 <view class="llq_cont_txt2">
                     {{$lan('blockHeight')}}
                 </view>
            </view>
            <view class="llq_cont1">
                <view class="llq_cont_txt1">{{$lan('mainChain')}}</view>
                 <view class="llq_cont_txt2">
                     {{$lan('blockHeight')}}
                 </view>
                  <view class="llq_cont_txt2">
                     {{$lan('blockHeight')}}
                 </view>
            </view>

        </view>


		</view>
    </view>
</template>

<script>
export default {
    data() {
        return {

        };
    },
    created() {

    },
    mounted() {

    },
    methods: {

    }
};
</script>

<style scoped lang="scss">
.zclb {
			width: 94%;
            min-height: 1870rpx;
			margin: 0 auto;
            overflow: auto;
			// overflow-y: auto;
			margin-top: 50rpx;
			margin-bottom: 36rpx;
			display: felx;
			justify-content: flex-start;
			align-items: center;

			.zclb_topTxt {
				font-size: 36rpx;
				font-weight: 700;
				color: #555555;
			}
			.zclb_topImg {
				width: 20rpx;
				height: 23rpx;
				margin-left: 20rpx;
			}
			.zclb_box1 {
				width: 98%;
				height: 460rpx;
				margin: 18rpx auto;
				background-color: #FFFFFF;
				border-radius: 4rpx;
				box-sizing: content-box;
				box-shadow: 2rpx 0 20rpx #dddddd;
                 border-radius: 20rpx;
			}
			.tkm {
				width: 92%;
				margin: 16rpx auto;
				padding: 36rpx 0rpx 00rpx 0rpx;
				height: 50rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				// border-bottom: 1rpx solid #DEDEDE;
				.tkm_left {
					display: flex;
					justify-content: space-between;
					align-items: center;
					text {
                    font-size: 30rpx;
                    font-family: PingFang SC;
                    font-weight: bold;
                    color: #333333;
                    line-height: 320px;
					}
					image {
						width: 30rpx;
						height: 30rpx;
						margin-right: 20rpx;
					}
				}

				.tkm_right {
					.t_r_t1 {

                        font-size: 30rpx;
                        font-family: PingFang SC;
                        font-weight: bold;
                        color: #333333;
                        line-height: 320px;
						text-align: end;
					}

					// .t_r_t2 {
					// 	font-size: 20rpx;
					// 	text-align: end;
					// 	color: #999999;
					// }
				}


			}
             .tkm_bottom{
                    width: 92%;
                    margin: 16rpx auto;
                    padding: 0rpx 0rpx 20rpx 0rpx;
                    height: 100rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1rpx solid #DEDEDE;
                    text{
                        max-width:624rpx;
                        margin: 0 auto;
                        word-wrap: break-word;
                        font-size: 28rpx;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #333333;
                        line-height: 45rpx;
                    }
                }
			.zcl1 {
				width: 92%;
				margin: 8rpx auto;
				height: 240rpx;

				.zcl1_cont {
					width: 70%;
                    margin: 0 auto;
					height: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.zcl1_left {
                    width: 40%;
                    display: flex;
                    flex-direction: column;
					// justify-content: center;
					align-items: center;

					// text {
					// 	font-size: 30rpx;
					// 	color: #666666;

					// }
					.zcl_img {
						width: 92rpx;
						height: 92rpx;
                        background-image: url(../../static/image/transfer/yh_r.png);
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: cover;
                        .left_center{
                            width: 92rpx;
						    height: 92rpx;
                            text-align: center;
                            line-height: 92rpx;
                            font-size: 32rpx;
                            font-family: Arial;
                            font-weight: 400;
                            color: #0A1135;

                        }
						// margin-right: 34rpx;
					}
                    .left_bottom{
                        margin-top: 26rpx;
                        font-size: 28rpx;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #666666;
                    }
				}
			}
            .llq_ban{
                width: 100%;
                height: 210rpx;
				margin: 8rpx auto;
                background-image: url(../../static/image/transfer/banner.png);
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
            }
            .llq_search{
                width: 98%;
                height: 300rpx;
                // margin: 8rpx auto;
                margin: 18rpx auto;
				background-color: #FFFFFF;
				border-radius: 4rpx;
				box-sizing: content-box;
				box-shadow: 2rpx 0 20rpx #dddddd;
                border-radius: 20rpx;
                display: flex;
                justify-content: space-around;
                flex-direction: column;
                align-items: center;
                 input{
                     width: 88%;
                    height: 90rpx;
                    margin: 0rpx auto;
                    padding-left: 24rpx;
                    background: #F5F5F8;
                    border-radius: 20rpx;
                    font-size: 30rpx;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    margin-top: 40rpx;
                    margin-bottom: 10rpx;
                 }
            }
                .sea_btn{
                    width: 400rpx;
                    height: 80rpx;
                    margin: 40rpx auto;
                    background: #243FFF;
                    border-radius: 40rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                text{

                    font-size: 32rpx;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #FFFFFF;
                }
            }
            .llq_bottom{
                width: 98%;
                margin: 0 auto;
                height: 570rpx;
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                align-items: center;
            .llq_cont1{
                width: 48%;
                height: 270rpx;
                background: #FFFFFF;
                border-radius: 20rpx;
                display: flex;
                // justify-content: center;
                flex-direction: column;

                align-items: center;
            .llq_cont_txt1{
                width: 60%;
                margin: 0rpx auto;
                margin-top: 34rpx;
                margin-bottom: 54rpx;
                font-size: 30rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #333333;
            }
            .llq_cont_txt2{
                //  width: 60%;
                margin: 0rpx auto;
                font-size: 26rpx;
                font-family: PingFang SC;
                font-weight: 400;
                color: #999999;
                margin-bottom: 36rpx;
            }
            }

            }


		}
</style>
