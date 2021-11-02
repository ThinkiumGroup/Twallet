import moment from 'moment'
import CryptoJS from "crypto-js"
import BigNumber from "bignumber.js"
import Iban from '@/static/web3-eth-iban/src/index'
export default {
  install(Vue, opt) {
    Vue.prototype.tableHeaderColor = function ({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (rowIndex === 0) {
        return 'background-color:#ffffff ;color: #333;font-weight: 600;font-size: 15px;height:58px;'
      }
    }
    Vue.prototype.timestampToTime = function (timestamp) {
      let time = ''
      if (timestamp == '' || timestamp == null || timestamp == undefined) {
        time = ''
      } else {
        time = moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
      }
      return time
    }
    Vue.prototype.timestampToTime_1 = function (timestamp) {
      let time = ''
      if (timestamp == '' || timestamp == null || timestamp == undefined) {
        time = ''
      } else {
        time = moment(timestamp * 1000).format('YYYY-MM-DD')
      }
      return time
    }
    Vue.prototype.passwordEncryption = function (e) {
      let cipherText = CryptoJS.HmacSHA1(e, '87krsC!IPF@OBRPEOh#Uat9C').toString(CryptoJS.enc.Hex);
      return cipherText;

    }
    Vue.prototype.scientificCounting = function (e) {
      let num = 0
      if (e == 0 || e == '' || e == null || e == undefined || e == NaN) {
        num = 0
      } else {
        num = new BigNumber(`${e}`).div("1e+18").toString(10);
        // if(num.indexOf('.') !== -1 && num.split('.')[1].length > 6){
        //   num = parseFloat(num).toFixed(6)
        // }
      }
      return num
    }

    const isTHAddress = function (address) {  // 判断TH地址是否正确
      return Iban.isValid(address);
    }

    const is0xAddress = function (address) {  // 判断0x地址是否正确
      let reg = /^0[Xx][A-Fa-f0-9]+$/;
      return reg.test(address)
    }

    Vue.prototype.isTHAddress = isTHAddress

    // 转为 TH地址
    Vue.prototype.to_32_decimal = function (e) {
      if(!is0xAddress(e)){
        return e
      }
      let ban = Iban.toIban(e);
      return ban
    }
    Vue.prototype.to_16_decimal = function (e) {
      let bans = Iban.toAddress(e).toLowerCase();
      return bans
    }

    Vue.prototype.slice_hash = function (e) {
      if (e == '' || e == null || e == undefined) {
        return ''
      } else {
        // e=this.to_32_decimal(e)
        let a = e.slice(0, 4)
        let b = e.substring(e.length - 4)
        let c = a + ' *** ' + b
        return c
      }
    }

  }

}
