<template>
  <view class="app" :style="{paddingTop: customBar + 105 + 'rpx'}">
    <view style="position: fixed; top: 0;left: 0; width: 100%; z-index: 99">
      <nav-bar :title="$lan('兑换记录')"/>
    </view>
    <view class="record-list">
      <view v-for="(item,index) in recordList" class="record-item" :key="index">
         <view class="record-item-top nav-row-between-center">
           <view class="left nav-row-start-center">
             <icon-font src="wallet-p-time" width="26rpx" height="26rpx" />
             <text class="time">{{item.timeStamp | formatDate}}</text>
           </view>
           <view class="right">
             <template v-if="lodash.get(item, 'swap')">
               <text class="trade-type trade-type-blue" v-if="lodash.get(item, 'swap.swapType') == 0">
                 {{ $lan('出兑MTO、BTO')}}
               </text>
               <text class="trade-type trade-type-orange" v-else-if="lodash.get(item, 'swap.swapType') == 1">
                 {{ $lan('兑入MTO、BTO')}}
               </text>
               <text class="trade-type trade-type-purple" v-else>
                 {{$lan('其他兑换')}}
               </text>
             </template>
             <template v-if="lodash.get(item, 'liquidity')">
               <text class="trade-type trade-type-blue" v-if="lodash.get(item, 'liquidity.type') == 1">
                 {{ $lan('添加通证兑换池')}}
               </text>
               <text class="trade-type trade-type-blue" v-else-if="lodash.get(item, 'liquidity.type') == 2">
                 {{ $lan('添加结算凭证兑换池')}}
               </text>
               <text class="trade-type trade-type-blue" v-else>
                 {{$lan('其他')}}
               </text>
             </template>
           </view>
         </view>
         <view class="dotted-line"/>
         <view class="record-item-body">
           <template v-if="item.swap">
             <view class="nav-row-start-start" v-if="item.swap.swapVOS">
               <view class="label">{{$lan('出兑：')}}</view>
               <view class="value">{{lodash.get(item, 'swap.swapVOS[0].value') | $toRegularNumber}}&nbsp;{{lodash.get(item, 'swap.swapVOS[0].name')}}</view>
             </view>
             <view class="nav-row-start-start" v-if="item.swap.swapVOS">
               <view class="label">{{$lan('获得：')}}</view>
               <view class="value">{{lodash.get(item, 'swap.swapVOS[1].value') | $toRegularNumber}}&nbsp;{{lodash.get(item, 'swap.swapVOS[1].name')}}</view>
             </view>
           </template>
           <template v-else-if="item.liquidity">
             <view class="nav-row-start-start" v-if="item.liquidity.liquidityVOS">
               <view class="label">{{$lan('添加：')}}</view>
               <view class="value">
                 <text>
                   {{lodash.get(item, 'liquidity.liquidityVOS[0].amount')  | $toRegularNumber}}&nbsp;{{lodash.get(item, 'liquidity.liquidityVOS[0].tokenName')}}
                 </text>
                 <text v-if="lodash.get(item, 'liquidity.liquidityVOS[1]')">
                   及{{lodash.get(item, 'liquidity.liquidityVOS[1].amount')  | $toRegularNumber}}&nbsp;{{lodash.get(item, 'liquidity.liquidityVOS[1].tokenName')}}
                 </text>
               </view>
             </view>
           </template>
            <view class="nav-row-start-start">
              <view class="label" >{{$lan('兑换hash：')}}</view>
              <view class="value" style="width: 320rpx" @longtap="copyData(item.tradingHash)">{{item.tradingHash}}</view>
            </view>
         </view>
      </view>
    </view>
  </view>
</template>
<script>
  import { mapState } from 'vuex';
  import { getTradingList } from '@/apis/transfer.js';
  import _ from 'lodash'
  import {copy} from "../../utils/common";

  export default {
    data() {
      return {
        recordList: [],
        pagination: {
          pageSize: 10,
          total: 0,
          currentPage: 1,
        },
        tables: '',

        // #ifndef H5
        customBar: plus.navigator.getStatusbarHeight(),
        // #endif
        // #ifdef H5
        customBar: 0,
        // #endif

        lodash:_,
      }
    },
    computed: {
      ...mapState(['defaultWallet', '_contractAddress']),
    },
    onReachBottom(){//uniapp 监听下拉加载生命周期
      this.getData(2)
    },
    methods: {
      handleTablesParams() {
        this.tables = _.cloneDeep(this.recordList.slice(this.recordList.length -10, this.recordList.length))
        this.tables = this.tables.map(item => item = {chainId:item.chainId, tableName:item.tableName, tableId:item.tableId})
      },
      async getData(type){  // 2是上划刷新
        if(this.pagination.total != 0 &&this.pagination.total <= this.recordList.length){
          return;
        }
        if(type == 2){
          this.pagination.currentPage++
        }else{
          this.pagination.currentPage = 1;
        }

        this.handleTablesParams();

        let params = {
          address: this.defaultWallet.address.toLowerCase(),
          parentType:"2",
          childType:"",
          page: this.pagination.currentPage,
          rows: this.pagination.pageSize,
          contractAddresss: [this._contractAddress.CONTRACT_ROUTER, this._contractAddress.CONTRACT_FLASH_SWAP, this._contractAddress.CONTRACT_FLASH_SWAP_POOL],
          chainId: '103',
          tables: this.tables,
        };

        if(this.recordList.length) {
          params.timeStamp = this.recordList[this.recordList.length -1 ].timeStamp
        }

        const { data } = await getTradingList(params);
        this.pagination.total = data.total;

        if(type == 2){
          this.recordList = this.recordList.concat(data.data)
        }else{
          this.recordList = data.data;
        }
      },
      copyData(data) {
        copy(data)
        uni.showToast({
          title: this.$lan('复制成功'),
          icon: 'none',
          duration: 2000
        });

      },

    },
    onLoad(){
      this.getData();
    }
  }
</script>
<style scoped lang="scss">
  *{
    box-sizing: border-box;
  }
  .record-list{
    .record-item{
      margin: 31rpx auto 0;
      width: 690rpx;
      padding: 0 37rpx 0 37rpx;
      background: url('../../static/image/decentralizedTransactions/block-bg-white.png') no-repeat;
      background-size: cover;
      border-radius: 20rpx;
      overflow: hidden;
      .record-item-top{
        height: 81rpx;
        .left{
          .time{
            color: #676767;
            font-size: 24rpx;
            margin-left: 12rpx;
          }
        }
        .right{
          .trade-type{
            font-size: 26rpx;
            font-weight: bold;
          }
          .trade-type-blue{
            color: #634DFF;
          }
          .trade-type-purple{
            color: #E324CF;
          }
          .trade-type-orange{
            color: #FD6D27
          }

        }
      }
      .dotted-line{
        width: 100%;
        height: 1px;
        background: url('../../static/image/decentralizedTransactions/dotted-line.png') no-repeat;
        background-size: cover;
      }
      .record-item-body{
        line-height: 58rpx;
        padding: 14rpx 0 0 ;
        .label{
          color: #666;
          font-size: 30rpx;
        }
        .value{
          display: inline-block;
          word-break: break-all;
          color: #999;
          font-size: 30rpx;
          flex-grow:1;
        }
      }
    }
  }
</style>
