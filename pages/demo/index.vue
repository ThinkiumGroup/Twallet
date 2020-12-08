<template>
  <view class="content">
    <scroll-view :scroll-y="true" style="height: 2000rpx">
      <view class="text-area">
        <text class="title">{{title}}</text>
      </view>
      <button @click="createWallet">
        {{$lan('创建钱包')}}
      </button>
      <view class="block">
        {{$lan('助记词：')}}{{mnemonicWords}}
      </view>
      <view class="block">
        {{$lan('私钥')}}：{{privateKey}}
      </view>
      <view class="block">
        {{$lan('公钥：')}}{{publicKey}}
      </view>
      <view class="block">
        {{$lan('地址：')}}{{address}}
      </view>
      <button @click="addWalletToList">{{$lan('将创建的钱包加入内存列表')}}</button>

      <button @click="setDefaultWallet">{{$lan('设置当前钱包为默认钱包')}}</button>

      <button @click="getWalletPrivateKey(address)">{{$lan('解密获得指定钱包(内存里的)的私钥')}}</button>

      <button @click="encryptData('123')">{{$lan('加密123')}}</button>
      <button @click="decryptData">{{$lan('解密')}}</button>
      <view>{{origin}}</view>
      <button @click="getRandomIV">{{$lan('获得随机的iv')}}</button>
      <view>{{iv}}</view>
      <button @click="getAccount">{{$lan('获取钱包账户余额(看log)')}}</button>
      <button @click="changeWalletNanme">{{$lan('更改钱包名称')}}</button>

      <button @click="checkPassword">{{$lan('校验密码')}}</button>
      <button @click="deleteWallet">{{$lan('删除钱包')}}</button>
      <button @click="changePassword">{{$lan('更改密码')}}</button>
    </scroll-view>
  </view>
</template>

<script>
  import walletApi from "../../apis/walletApi";
  import dataCrypto from "../../utils/dataCrypto";
  import {aboutWallet} from "../../utils/businessCommon"

  export default {
    data() {
      return {
        title: 'demo',
        mnemonicWords: '',
        privateKey: '',
        publicKey: '',
        address: '0x6f6503d46d0649f300839b566c69b832fe3f5392',
        origin: '',
        sign: '',
        iv: '',
        password: '123456',
      }
    },
    onLoad() {

    },
    methods: {
      toDemo() {
        console.log(this.$lan('去 demo 页'));
        uni.navigateTo({url: `/pages/demo/demo`})
      },
      async createWallet() {
        this.mnemonicWords = await walletApi.createMnemonicWords();
        this.privateKey = await walletApi.getPrivateKeyFromMnemonicWords(this.mnemonicWords);
        this.publicKey = walletApi.getPublicKeyFromPrivateKey(this.privateKey);
        this.address = walletApi.getAddressFromPublicKey(this.publicKey);
      },

      async addWalletToList() {
        // 设置密码
        let password = this.password;
        let walletData = {
          // mnemonic: this.mnemonicWords,
          privateKey: '0xa8ce7663494495809a64aac44554bfaf32b2804b0e37d90c70bc880d6732cf0c',
          name: this.$lan('哈哈哈'),
        };
        await aboutWallet.addNewWallet(walletData, password);
      },
      async setDefaultWallet() {
        // await this.addWalletToList();
        aboutWallet.setDefaultWallet('0x9ae84284d7b152af900281c9e3969c8770197459');
      },
      checkPassword() {
        let result = aboutWallet.checkPassword(this.address, '123456');
        console.log('result', result);
      },
      async getWalletPrivateKey(address) {
        // 假定已输入密码
        let password = this.password;
        let privateKey = await aboutWallet.getWalletPrivateKey(address, password);
        console.log('privateKey', privateKey);
      },
      deleteWallet() {
        aboutWallet.deleteWalletAndSetDefault('0x0cfb68e61f4264a380daf511e839b6dbd3d2a0bb');
      },
      changePassword() {
        aboutWallet.changePassword('0x9ae84284d7b152af900281c9e3969c8770197459', '1234567', '123456')
      },
      encryptData(data) {
        this.sign = dataCrypto.encryptData(data, '123456', '1234567890123456')
      },
      decryptData() {
        this.origin = dataCrypto.decryptData(this.sign, '123456', '1234567890123456')
      },
      getRandomIV() {
        this.iv = dataCrypto.getRandomIV();
      },
      getAccount() {
        let account = walletApi.getAccount('1', this.address);
        console.log('account', account);
      },
      changeWalletNanme() {
        aboutWallet.changeWalletName('0xda3a39585d16b778ba776d0314b0b83ff19fb16d', '咻咻')
      }
    }
  }
</script>

<style>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo {
    height: 200 rpx;
    width: 200 rpx;
    margin-top: 200 rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50 rpx;
  }

  .text-area {
    display: flex;
    justify-content: center;
  }

  .title {
    font-size: 36 rpx;
    color: #8f8f94;
  }

  .block {
    width: 600 rpx;
    word-break: break-all;
  }
</style>
