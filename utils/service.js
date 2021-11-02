import Vue from 'vue';
import PasswordPopup from '@/components/PasswordPopup'; //Introduce the bullet frame component just written
import TransferLoading from "../components/TransferLoading";
import EasyDialog from "../components/EasyDialog";


let passwordPopupConstructor  = Vue.extend(PasswordPopup); // Returns an "extended instance constructor"
export const passwordPopup = (o = {}) => {
  let passwordDom = new passwordPopupConstructor({
    el: document.createElement('div') //Mount the Alert component to the newly created div
   });
  document.body.appendChild(passwordDom.$el); //Add the dom of the Alert component to the body

  console.log('passwordDom', passwordDom);
  passwordDom.showPasswordPopup();

  passwordDom.a_cancel = o.cancel;
  passwordDom.a_fail = o.fail;
  passwordDom.a_success = o.success;
};



let transferLoadingPopupConstructor  = Vue.extend(TransferLoading);
let contentDom;
export const transferLoading = (o = {}) => {
  if(!contentDom && o.show){
    contentDom = new transferLoadingPopupConstructor({
      el: document.createElement('div')
    });
    document.body.appendChild(contentDom.$el);
  }
  contentDom.text = o.text;
  contentDom.isShow = o.show;
};



export const easyDialog = (o = {}) => {
  let easyDialogConstructor  = Vue.extend(EasyDialog);
  let easyDialogDom = new easyDialogConstructor({
    el: document.createElement('div')
  });
  document.body.appendChild(easyDialogDom.$el);

  easyDialogDom.showDialog();

  easyDialogDom.title = o.title;
  easyDialogDom.text = o.text;
  easyDialogDom.isOneBtn = o.isOneBtn;
  if(o.okText){easyDialogDom.okText = o.okText};
  if(o.cancelText){easyDialogDom.cancelText = o.cancelText};

  easyDialogDom.onOk = o.ok;
  easyDialogDom.onCancel = o.cancel;
};


