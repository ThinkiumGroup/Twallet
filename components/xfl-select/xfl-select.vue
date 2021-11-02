<template>
	<div class="show-box"  :class="{disabled: disabled, active: isShowList}" :style="style_Container">
		<!-- 输入框，仅在可输入模式下使用 -->
		<input  
			v-if="showInput"  class="input"  placeholder-style="color: #bbb;"
			type="text" v-model="selectText"  :placeholder="placeholder"
			@focus="onFocus" @blur="onBlur" @input="onInput" @confirm="$emit('confirm', $event)"
		>
		<!-- 显示框 -->
		<div v-else class="input" :class="{placeholder: selectText === placeholder}" @click="onUpperClick" >{{selectText}}</div>

		<!-- 右侧的小三角图标 -->
		<span 
			@click="onUpperClick" 
			class="iconfont iconarrowBottom-fill right-arrow" 
			:class="{isRotate: isRotate}"
		></span>
		
		<!-- 清除按钮图标 -->
		<span 
			v-if="clearable && selectText && selectText != placeholder" 
			class="right-arrow" @click="onClear" 
		>
			<span class="iconfont iconshanchu1 clear"></span>
		</span>
		
		
		<!-- 列表框 -->
		<div class="list-container" 
		@click.stop="onListClick"
		:style="'top:' + listTop__ + 'px;'" v-show="isShowList">
			<span class="popper__arrow"></span> <!-- 列表框左上角的空心小三角 -->
			<scroll-view 
				class="list" style="background-color: #fff;"  
				:style="'max-height: ' + listBoxHeight__ +'em;'"
			    scroll-y=true scroll-x=true
			>
				<div 
					class="item" @click="onClickItem(index, item.value)"
					v-for="(item, index) in innerList" :key="index" 
					:class="{active: activeIndex == index, disabled: item.disabled}"
				>
					<div>{{item.value}}</div>
				</div>
				<div v-show="innerList.length==0" class="data-state item">无数据</div>
				<!-- <slot></slot> -->
			</scroll-view>
		</div>
		
	</div>
</template>

<script>
	/**
	 * v1.1.1
	 * 最后修改: 2019.7.29
	 * 创建: 2019.6.27
	 */
	import Vue from 'vue';
	Vue.__xfl_select = Vue.__xfl_select || new Vue();  // 这个实例专门用来做xfl-select多个实例之间的通信中间站
	export default {
		name: 'xfl-select',
		props: {
			list: {            // 原始数据
			  type: Array,  
			  default: function(){
				  return [];
			  }
			},
			focusShowList: null, // 当input获取焦点时，是否自动弹出列表框
			initValue: null,   // 选择框的初始值
			isCanInput: {      // 选择框是否可以输入值
			  type: Boolean,  
			  default: false,
			},
			selectHideType: {     // 本选择框与其它选择框之间的关系
			  type: String,        
			  default: 'hideAll', // 'independent' - 是独立的，与其它选择框互不影响  'hideAll' - 任何一个选择框展开时，隐藏所有其它选择框
								  // 'hideOthers'- 当本选择框展开时，隐藏其它的选择框。  当其它选择框展开时，不隐藏本选择框。 
								  // 'hideSelf' -  当本选择框展开时，不隐藏其它的选择框。当其它选择框展开时，隐藏本选择框。
			},
			placeholder: {     // 选择框的placeholder
			  type: String,  
			  default: '请选择',
			},
			style_Container: { // 最外层的样式
			  type: String,  
			  default: ''
			},
			disabled: {        // 是否禁用整个选择框
			  type: Boolean,  
			  default: false,
			},
			showItemNum: {     // 显示列表框的窗口高度，数字表示能显示几个列表项
			  type: Number,  
			  default: 5
			},
			listShow: {        // 是否显示列表框
			  type: Boolean,  
			  default: false
			},
			clearable: {       // 是否显示右侧的清除按钮
			  type: Boolean,  
			  default: true
			},
		},
		data() {
			return {
				isShowList: false, // 是否显示列表框
				selectText: '',    // 已经选择的内容
				activeIndex: -1,   // 列表中当前活动的索引号
				isRotate: false,   // 右侧的小三角是否旋转
				listTop__: 50,       // 列表框的top位置，在初始时，根据input节点的高度来调整
			};
		},
		// 进行监听的话，在组件外改变这个值，组件内就能响应变化
		watch: { // 监听变化 ，注意，初始的值是不会被监听到的，只有在mounted回调中手动赋值
			listShow(newVal, oldVal){
				this.onDataChange_listShow(newVal, oldVal);
			},
		},
		computed:{
			focusShowList__(){ // 是否在输入框获得焦点时，自动弹出列表框
				if(this.focusShowList == null ){
					// 应该是判断在 pc端还是移动端
					// #ifdef H5
						return isPC();
					// #endif
					// #ifndef H5
						return false;
					// #endif
				}else{
					return 	this.focusShowList;
				}
			},
			listBoxHeight__(){ // 列表框的总高度
				const itemHeight = 2; // 每个列表项的高度(em), 默认为2个文字高
				return this.showItemNum*itemHeight;
			},
			showInput(){    // 是否显示输入框
				return this.isCanInput && !this.disabled;
			},
			innerList(){    // 转换列表的数据格式
				const arr = [], orginArr = this.list;
				orginArr.forEach((val, index)=>{
					let value = typeof val === 'object' && 'value' in val ? val.value : val;
					let isDisabled = typeof val === 'object' && val.disabled == true;
					arr.push({
						isActive: false,
						value: value,
						disabled: isDisabled,
					});
				});
				return arr;
			},
		},
		mounted(){
			Vue.__xfl_select.$on('open', this.onOtherXflSelectOpen);
			this.switchMgr = new Switch(this.onListShow, this.onListHide);  // 创建开关对象
			this.onDataChange_listShow(this.listShow, null); // 由于 watch 不到初始值，所以需要在这里手动调用一次
			this.init(); //进行初始化
		},
		beforeDestroy(){
			Vue.__xfl_select.$off('open', this.onOtherXflSelectOpen);
		},
		methods: {
			onOtherXflSelectOpen(component){ //当本组件的其它实例展开时的回调
				if(this.selectHideType === 'independent' || this.selectHideType === 'hideOthers'){
					return;
				}
				component !== this && this.switchMgr.close(100);
			},
			/************************** 初始化函数 ****************************/
			//进行初始化
			init(){
				this.clearInput();  // 清空输入框中的显示，主要是设置placeholder
				this.setInput(this.initValue); // 在输入框中显示初始值
				this.changeActiveIndex(this.initValue); // 根据初始值设置列表框中的活动项
				this.getInputBoxHeight(); // 初始化列表框的top值
			},
			
			// 获取输入框的总高度 px
			getInputBoxHeight(){
				let component = this;
				// #ifdef H5
					component = undefined;  // 在h5中传入了component反而拿不到数据
				// #endif
				getNodeInfo('.show-box', component, (data)=>{
					if(data){
						const trangleHeight = 6; //列表框左上角的小的空心三角形的高度(px)
						this.listTop__ = data[0].height + trangleHeight;
					}
				})
			},
			/************************** 初始化函数 ****************************/

			/************************** 数据 ****************************/
			getIndex(value){  // 将值转换为索引
				let activeIndex = searchIndex(
									this.innerList, value, 'value')
				return activeIndex;  // 转换失败，则返回-1
			},
			itemIsDisabled(index){ // 某个列表项是否已经被禁用了
				return this.innerList[index].disabled;
			},

			itemIsActive(index){ // 某个列表项是否是被选中的(活动的)
				return index === this.activeIndex;
			},

			// listShow 这个字段的值变化时的回调
			onDataChange_listShow(newVal = false, oldVal){ 
				newVal ? this.switchMgr.open() : this.switchMgr.close(100);
			},
			/************************** 数据 ****************************/
			
			
			/************************** “输入框”的操作 ****************************/
			// 输入框获得焦点时
			onFocus(event){
				this.focusShowList__ && this.switchMgr.open();
				this.$emit('focus', event);
			},
			
			// 输入框失去焦点时
			onBlur(event){
				// 失去焦点时隐藏，在电脑上很好，但在移动端体验不好，因为会弹出数字键盘，然后隐藏键盘时会失去焦点
				this.focusShowList__ && this.switchMgr.close(100); 
				this.$emit('blur', event);
			},
			
			//当显示的不是输入框时，上面的点击事件
			onUpperClick(){
				if(this.disabled){
					return;
				}
				this.switchMgr.toggle('auto', -1, 100);
				this.$emit('input-click');
			},
			
			//清空已经选择的内容
			onClear(){ 
				this.clearItemActive(); // 清空列表框中的所有活动项
				this.clearInput(); // 清空输入框中的显示
				this.$emit('clear');
			},
			
			// 输入框的值变化时
			onInput(event){
				const inputVal = event.detail.value;
				this.changeActiveIndex(inputVal);
				this.$emit('input', event);
			},

			// 清空input中显示的内容
			clearInput(placeholder = null){
				this.placeholder = placeholder== null ? this.placeholder : placeholder;
				this.selectText = this.showInput ? '' : this.placeholder;
			},
			// 设置input中显示的内容
			setInput(text = null){ 
				if(text == null){
					return;
				}
				this.selectText = text;
			},
			/************************** “输入框”的操作 ****************************/
			
			
			/************************** 列表的操作(显示/隐藏/点击) ****************************/

			/**
			 * 传入数字表示索引，其它值表示value, 会自动去搜索对应的索引
			 * 注意： 
			 * 1. 如果没有找到对应的索引，则什么也不会做  
			 * 2. 如果找到了，只会把对应项设置为活动的，并不会清除其它的活动项  
			 */
			changeActiveIndex(value_index){ //改变列表中的活动项
				if(value_index == null){
					return;
				}
				let activeIndex = value_index, value = value_index;
				if(typeof value_index !== 'number'){ //认为是值，否则就是索引
					activeIndex = this.getIndex(value); // 搜索对应的值所在的索引
				}else{
					value = this.innerList[activeIndex].value;
				}
				if(activeIndex > -1){
					!this.itemIsActive(activeIndex) && this.setItemActive(activeIndex, value);
				}else{
					this.clearItemActive();
				}
				this.setInput(value);  // 更改输入框的值
			},

			clearItemActive(index = -1){  // 设置为不选中
				if(index < 0){ // 清空全部
					this.activeIndex = -1;
				}
			},
			setItemActive(index, value){ //选中某一项，必须传入索引和对应的值
			    if(this.itemIsDisabled(index)){
					return;
				}
				this.activeIndex = index;
			},

			// 整个列表框上的点击事件
			onListClick(){

			},
			onClickItem(index, value){  // 列表项上的点击事件
				if( this.itemIsDisabled(index) ){
					this.switchMgr.open(); // 点在禁用项上，就不隐藏
					return;
				}
				this.switchMgr.close(100);   // 开始隐藏，因为会延迟隐藏，所以可以写在这里
				if(this.disabled){ //如果本项被禁用 或 整个列表框被禁用
					return;
				}
				if( !this.itemIsActive(index) ){  //如果点在非选中项上
				    this.clearItemActive(); // 清空其它的选中的列表项
					this.setItemActive(index, value); // 将这一项设置为选中项
					this.$emit('change', {newVal: value, oldVal: this.selectText, 
											index: index, orignItem: this.list[index]});
											
					this.setInput(value);   // 更改输入框的值
				}
			},
			onListHide(){ //列表隐藏时的回调
				this.isRotate = false;
				this.isShowList = false;
				this.$emit('visible-change', false);
			},
			onListShow(){  //列表显示时的回调
				this.isShowList = true;
				this.isRotate = true;
				this.$emit('visible-change', true);
				
				if(this.selectHideType === 'independent' || this.selectHideType === 'hideSelf'){
					return;
				}
				Vue.__xfl_select.$emit('open', this);
			}
			/************************** 列表的操作(显示/隐藏/点击) ****************************/
		}
	}

/************************** uniapp libs ****************************/

	/**
	 * 是否是web的移动端
	 * @public
	 * @returns {boolean} true表示当前环境是web，并且是移动端，false表示非web或是pc端
	 */
	function isMobile(){
		try{  // 可能不存在window对象
			let reg = /iPhone|iPad|iPod|iOS|Android|SymbianOS|Windows Phone|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince/i;
			return reg.test(navigator.userAgent); 
		}catch(e){
			return false;
		}
	}
	/**
	 * 是否是web的pc端
	 * @public
	 * @returns {boolean} true表示当前环境是web，并且是pc端，false表示非web或是移动端
	 */
	function isPC(){
		try{  // 可能不存在window对象
			let reg = /iPhone|iPad|iPod|iOS|Android|SymbianOS|Windows Phone|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince/i;
			return !reg.test(navigator.userAgent); 
		}catch(e){
			return false;
		}
	}
	/**
	 * 获取指定元素的样式
	 * 注意:  
	 * 1. 必须在使用这个函数的文件中 导入 import Vue from 'vue'  
	 * 2. 自定义组件编译模式（默认模式）时, 必须传入component参数。(h5中测试时不管传不传都能正常获取，但wx中必须传入才行)
	 * @public
	 * @param {Object|string} options - 配置对象，如果传入一个字符串，则识别为selector
	 *                         selector - dom元素的选择器，仅支持以下选择器: 
	 * 							1. ID选择器：'#the-id'
								2. class选择器（可以连续指定多个）：'.a-class.another-class'
								3. 子元素选择器：'.the-parent > .the-child'
								4. 后代选择器：'.the-ancestor .the-descendant'
								5. 跨自定义组件的后代选择器：'.the-ancestor >>> .the-descendant'
								6. 多选择器的并集：'#a-node, .some-other-nodes'
								7. 传入 'viewport' 表示获取视口对象，有点类似于选中window。
	 * @param {function|component} [callback=null] - 如果传入一个函数，则识别为获取到样式后的回调，也可以传入一个组件, 
	            回调的第一个参数如下:   
				// 获取信息成功时，是对象数组,  
				// 对象根据options的配置而有不同的字段  
				{  
					id: '',         // String 节点的 ID, 经测试，这个id并不一定正确(特别是选中多个节点时)  
					dataset: null,  // Object 节点的 dataset  
					left: 0,        // Number 节点的包围盒的左边界坐标(px)(page元素的左上角为坐标原点)  
					right: 0,       // Number 节点的包围盒的右边界坐标(px)  
					top: 0,         // Number 节点的包围盒的上边界坐标(px)  
					bottom: 0,      // Number 节点的包围盒的下边界坐标(px)  
					width: 0,       // Number 节点的宽度(px)  
					height: 0,      // Number 节点的高度(px)  
					scrollLeft: 0,  // Number 节点的水平滚动位置(px)  
					scrollTop: 0,   // Number 节点的竖直滚动位置(px)  
					context: {} || null,   // Object节点对应的Context对象(如VideoContext、CanvasContext、和MapContext)  
					...        // properties 数组中指定的属性值和computedStyle数组中指定的样式值  
				}  
				// 当获取信息失败，则为null  
	 * @param {any} [thisObj=null] 回调中的this, 可能位于第三个参数或第四个参数。
	 * @return {undefined|promise} 当没有callback时，则返回promise，否则返回undefined  
	 * @example
	 * 1. 传入选择器，返回promise
	 * getNodeInfo('#aa').then((data)=>{ console.log(data);});
	 * 
	 * 2. 传入选择器和component, 返回promise
	 * getNodeInfo('#aa', this).then((data)=>{ console.log(data);});
	 * 
	 * 3. 传入选择器和callback, 返回undefined
	 * getNodeInfo('#aa', (data)=>{ console.log(data);});
	 * 
	 * 4. 传入配置对象和callback, 返回undefined
	 * getNodeInfo({selector: '#aa', component: this}, (data)=>{ console.log(data);});
	 */
	function getNodeInfo({
		selector = 'selector', // 选择器
		component = null, // 选择器所在的组件，不传入的话，相当于是在整个当前页面中选择
		attemptSpaceTime = 16,  // 尝试获取节点信息的时间间隔(ms): 16 24 36 54 81 122 183 275 413 
		attemptSpaceRate = 1.5, // 时间间隔的增长系数
		totalAttemptNum = 8,    // 如果获取信息失败，再次进行尝试获的最大次数
		// 以下为获取到的结果字段的配置
		id = true,        // Boolean	是否返回节点 id	
        dataset = true,   // Boolean	是否返回节点 dataset	
        rect = true,      // Boolean	是否返回节点布局位置（left right top bottom）	
        size = true,      // Boolean 是否返回节点尺寸（width height）	
        scrollOffset = true, //Boolean 是否返回节点的 scrollLeft scrollTop
        // 以下三个 仅 App 和微信小程序支持
        properties = [],  // Array＜string＞ 指定属性名列表，返回节点对应属性名的当前属性值   
                          // 只能获得组件文档中标注的常规属性值，
                          // id class style 和事件绑定的属性值不可获取
        computedStyle = [],  //Array＜string＞指定样式名列表，返回节点对应样式名的当前值
        context = true,  // Boolean 是否返回节点对应的 Context 对象	
	} = {}, callback = null, thisObj = null){
		// arguments 始终会记录最原始的传进来的参数，而不管这些默认值会怎么转换
		// 因为传入一个对象或非字符串会报错，强制转换为字符串
		const args = arguments;
		selector = typeof args[0] === 'string' ? args[0] : String(selector);
		if(typeof args[1] !== 'function'){
			component = args[1]; callback = args[2]; thisObj = args[3];
		}
		!component instanceof Vue && (component = null);  //传入非组件对象，会报错
		
		// 不能把 component 字符添加到这个对象上，否则在wx中会报循环引用的错误
		const options = { selector, attemptSpaceTime, totalAttemptNum, attemptSpaceRate,
		id, dataset, rect, size, scrollOffset, properties, computedStyle, context };
		
		const selectorQuery = uni.createSelectorQuery();
		component && selectorQuery.in(component);
		const nodesRef = selector === 'viewport' ? selectorQuery.selectViewport() : selectorQuery.selectAll(selector);
		nodesRef.fields(options); // 注意，只注册了这一个命令

		let result; // 必须把创建promise的代码放在前面，否则在h5端会出现exec先执行完成的情况
		if(typeof callback !== 'function'){
			result =  new Promise(resolve=>callback = resolve);
		}
		stepRunFunc((next, currNum)=>{
			selectorQuery.exec( ([data]) => { // 开始查询页面中的节点
				data && data.length === 0 && (data = null);
				data || totalAttemptNum <= currNum ? typeof callback === 'function' && callback.call(thisObj, data) : next(attemptSpaceTime);
				attemptSpaceTime = Math.round( attemptSpaceTime * attemptSpaceRate );
			});
		})(); // 立即执行一次
		
		return result;
	}
/************************** uniapp libs ****************************/

/************************** js libs ****************************/
	/**
	 * 开关类，管理两个状态的切换
	 * 特点是: 状态的切换可能是延迟进行的。
	 * @class
	 */
	class Switch{
		constructor(onopen = null, onclose = null){
			this.onopen = onopen;  // 打开后的回调
			this.onclose = onclose;  // 关闭后的回调
			this.isOpen = false;  // 初始时状态是关闭的
		}
		toggle(toState = 'auto', ...args){ //切换开关的状态
			if( !(toState === 'close' || toState === 'open') ){
				toState = this.isOpen ? 'close' : 'open';
			}
			let delayTime_open, delayTime_close, cancelType_open, cancelType_close;
			for(let i=0, arg; i<args.length; i++){
				arg = args[i];
				switch(typeof arg){
					case 'number': delayTime_open == null ? (delayTime_open = arg) : (delayTime_close = arg); break;
					case 'string': cancelType_open == null ? (cancelType_open = arg) : (cancelType_close = arg); break;
				}
			}
			const delayTime = toState === 'open' ? delayTime_open : delayTime_close;
			const cancelType = toState === 'open' ? cancelType_open : cancelType_close;
			this.change(toState, delayTime == null ? -1 : delayTime, cancelType == null ? 'both' : cancelType);
		}
		open(delayTime = -1, cancelType = 'both'){ // 打开
			this.change('open', delayTime, cancelType);
		}
		close(delayTime = -1, cancelType = 'both'){  // 关闭
			this.change('close', delayTime, cancelType);
		}
		cancel(type = 'both'){  // 取消定时器
			if(type === 'open'){
				clearTimeout(this.openTimer); this.openTimer = null;
			}else if(type === 'close'){
				clearTimeout(this.closeTimer); this.closeTimer = null;
			}else if(type === 'both'){
				clearTimeout(this.closeTimer); this.closeTimer = null;
				clearTimeout(this.openTimer); this.openTimer = null;
			}
		}
		change(toState, delayTime = -1, cancelType = 'both' ){ // 改变到指定的状态
			this.cancel(cancelType); // 取消定时器
			if(this.isOpen && toState === 'open' || !this.isOpen && toState === 'close'){
				return;
			}
			const funcName = 'on' + toState;
			if(delayTime < 0){
				this.isOpen = toState === 'open';
				typeof this[funcName] === 'function' && this[funcName]();
			}else{
				this[toState + 'Timer'] = setTimeout(()=>{ 
					this.isOpen = toState === 'open';
					typeof this[funcName] === 'function' && this[funcName]();
				}, delayTime)
			}
		}
	}


	/**
	 * 从一个数组中进行搜索，返回一个索引, 主要特点是可以深层搜索
	 * 依赖: forEach  props 这两个函数
	 * @public
	 * @param {Array} arr - 要搜索的数组或类数组或普通对象
	 * @param {any} searchVal - 要搜索的值 
	 * @param {string|Array} [propPath=''] - 要搜索的值的路径， 如 'aa.bb.cc' 或 ['aa', 'bb', 'cc']
	 * @param {function} [compareFunc=null] - 比较函数 compareFunc(val, searchVal, arrElem, index, orignArr)
	 *                                        省略时，表示进行全等比较。
	 * @example
	 * 1. 简单的使用
	 * searchIndex([1, 2, 3], 2); // => 1
	 * 
	 * 2. 使用自定义的比较函数
	 * searchIndex([1, 2, 3], '2', '', (val, searchVal)=>val==searchVal); // => 1
	 * 
	 * 3. 指定用值的路径
	 * searchIndex([1, {aa: 3}, {aa: {bb: 3}}, {aa: {bb: 4}], 3, 'aa.bb'); // => 1
	 */
	function searchIndex(arr, searchVal, propPath = '', compareFunc = null){
		let result_index= -1;
		if(propPath){
			if(typeof propPath === 'string'){	
				propPath = propPath.split(/\s*[\,\.]\s*/);
			}else if( !Array.isArray(propPath) ){
				propPath = '';
			}
		}
		forEach(arr, (val, index, orignArr)=>{
			if(propPath){
				val = props(val, propPath);
			}
			if(
				typeof compareFunc === 'function' 
				? compareFunc(val, searchVal, arrElem, index, orignArr)
				: val === searchVal
			){
				result_index = index;
				return false;
			}
		});
		return result_index;
	}

	/**
	 * 遍历数组或类数组或普通对象
	 * 跟原生的forEach的差别是: 可以遍历普通对象，也可以中途可以退出。
	 * 注意，类数组只会遍历其中的数字属性。
	 * @public
	 * @param {object|Array} obj - 要遍历的对象
	 * @param {function} func - 回调  func.call(thisObj, value, prop, obj);
	 * @param {any} [thisObj=null] - 回调中的this
	 * @example
	 * 1. forEach({a: 3, b: 4}, (val, prop, obj)=>{ // 遍历普通对象
	 *     return false; //返回false 表示退出循环
	 * });
	 * 
	 * 2. forEach([3, 4], (val, index, obj)=>{ // 遍历数组
	 *     return false; //返回false 表示退出循环
	 * });
	 * 
	 * 3. forEach({1: 3, 5: 10, a: 'aa', length: 20}, (val, index, obj)=>{ // 遍历类数组
	 *     return false; //返回false 表示退出循环
	 * });
	 */
	function forEach(obj, func, thisObj = null) {
		if (obj == null || typeof obj === 'function' || typeof func !== 'function') {
			return obj;
		}

		//对象自身的（不含继承的）所有可遍历（enumerable）属性
		let keys = Object.keys(obj);

		const length = obj.length;
		const isArrayLike = typeof length == 'number' && length > -1 && length % 1 == 0 && length <= 9007199254740991;

		//如果是类数组或数组，只遍历其中的数字属性
		if (isArrayLike) {
			const reg = /^(?:0|[1-9]\d*)$/,
				maxNum = 9007199254740991,
				numPropArr = [];
			for (let i = 0, val; i < keys.length; i++) {
				val = keys[i];
				if (reg.test(val) && +val <= maxNum) {
					numPropArr.push(val);
				}
			}
			keys = numPropArr;
		}

		// 开始遍历所有的数字属性
		for (let i = 0; i < keys.length; i++) {
			if ( func.call(thisObj, obj[keys[i]], keys[i], obj) === false ) { break; }
		}
		return obj;
	}

	/**
	 * 从一个对象上取指定的属性 或 设置属性的值
	 * @public
	 * @param {Object} obj - 对象, 当设置时，会更改这个对象
	 * @param {Array} propArr - 属性名称的数组，指出要操作的属性的路径
	 * @param {any} [val=undefined]   -  要设置的值 省略时表示获取，否则就是设置
	 * @param {Boolean} [fource=false]   - 在设置时，如果不存在对应的属性，是否创建
	 * @returns {any|undefined} 设置时一定返回undefined, 获取时，返回对应的值，如果不存在则返回undefined
	 * @example
	 * 1. props({}, ['aa', 'bb', 'cc'], 5);  // => undefined 什么也没做
	 * 2. props({}, ['aa', 'bb', 'cc'], 5, true);  // => undefined  在空对象上创建了多层属性 {aa: {bb: {cc: 5} }}
	 * 3. props({}, ['aa', 'bb', 'cc']);  // => undefined
	 * 4. props({aa: {bb: 77}}, ['aa', 'bb']);  // => 77
	 * 5. props({aa: 3}, ['aa', 'bb', 'cc'], 5);  // => undefined 什么也没做
	 * 6. props({aa: 3}, ['aa'], 5);  // => undefined  设置了 aa 的值为5
	 * 7. props({aa: 3}, [], 5);  // => undefined 什么也没做
	 */
	function props(obj, propArr, val = undefined, fource = false){
		for(let i=0, subObj = obj, len = propArr.length, propName; i<len; i++){
			if(!subObj || typeof subObj !== 'object'){
				return;
			}
			propName = propArr[i];
			if(i === len -1 ){
				if(val === undefined){
					return subObj[ propName ];
				}else{
					subObj[ propName ] = val;
				}
			}else{
				if( !(subObj[ propName ] && typeof subObj[ propName ] === 'object') ){
					if(fource && val !== undefined){
						subObj[ propName ] = {};
					}else{
						return;
					}
				}
				subObj = subObj[ propName ];
			}
		}
	}
	

    /**
	 * 分次执行某个函数
	 * 使用场景: 异步执行某个操作，这个操作可能会失败，所以当失败时，需要再尝试几次，直到成功或尝试次数用完
	 * @public
	 * @param {function} callback - 要执行的函数 callback.call(thisObj, next, currCount, timers)
	 * @param {any} [thisObj=null] - callback中的this
	 * @returns {function} 返回next函数，next函数可以传入以下两个参数   
	 * 					  {any} [delayTime=-1] - 延迟多久(ms)再执行下一次callback回调
	 * 											 负数、NaN、Infinite表示立即同步调用，其它值表示延迟执行
	 * 					  {string} [type='both'] - 当调用next时，如果其它地方也调用了next并且还没有完成，此时该保留哪次调用
	 * 						   				'new' - 保留本次的，清除所有原来的
	 * 						   				'old' - 保留所有原来的，舍弃本次的
	 * 						   				'both' - 两个都保留
	 * @example
	 * 1. 最简单的使用
	 * stepRunFunc((next, currCount, timers)=>{
	 * 		console.log('执行第' + currCount + '次');
	 *      currCount <= 2 && next(2000);
	 * })();
	 * // => 会立即执行第一次，然后2s后再执行第二次
	 * 
	 * 2. next()函数的第二个参数，是考虑到，用户可能会在短时间内连续调用多次，此时应该怎么处理这些next调用之间的关系
	 * stepRunFunc((next, currCount, timers)=>{
	 * 		console.log('执行第' + currCount + '次');
	 *      if(currCount <= 2 ){
	 *          next(3000);
	 *          setTimeout(()=>{next(1000, 'old')}, 1000); // 这一次next调用将不起作用
	 *      }
	 * })();
	 * // => 会立即执行第一次，然后3s后再执行第二次
	 */
	function stepRunFunc(callback, thisObj = null){
		const getDelayTime = (delayTime)=>{ // 转换delayTime的格式
			delayTime = parseInt(delayTime);
			if(isNaN(delayTime) || !isFinite(delayTime)){
				delayTime = -1;
			}
			return delayTime;
		}
		const timers = []; // 记录所有正在执行的计时器
		const clearTimer = (oneTimer)=>{  // 清除定时器
			if(oneTimer == null){
				for(let i=0; i<timers.length; i++){
					clearTimeout(timers[i]);
				}
				timers.length = 0;
			}else{
				const index = timers.indexOf(oneTimer);
				if(index > -1){
					clearTimeout(timers[index]);
					timers.splice(index, 1);
				}
			}
		}
		let currCount = 0; // 记录callback当前已经执行了的次数
		const next = function(delayTime = -1, type = 'both'){
			if(type === 'new'){ // 如果只保留最新的next回调
				clearTimer();
			}else if(type === 'old' && timers.length > 0){ // 保留以前的next回调，忽略本次next回调
				return;
			}
			delayTime = getDelayTime(delayTime);
			if(delayTime < 0){
				callback.call(thisObj, next, ++currCount, timers);
			}else{
				const oneTimer = setTimeout(()=>{
					clearTimer(oneTimer);
					callback.call(thisObj, next, ++currCount, timers);
				}, delayTime);
				timers.push(oneTimer);
			}
		}
		return next;
	}
/************************** js libs ****************************/
</script>

<style scoped lang="less">
	@normal-color: #606266;      //正常情况下的字体颜色
	@hover-color: #c0c4cc;       //边框的颜色
	@active-color: #409eff;       //活动的颜色
	@mouse-move-color: #f5f7fa;  //在列表项上按下时的列表项的背景色
	@padding-left: 5%;           //两侧的边距
	@arrowWidth: 12%;            //右边的小三角按钮区域的宽度

	.placeholder11{
		color: red; top: 10px;
	}
	.show-box{
		&.active{
			border-color: @active-color;
		}
		// &:hover{
		// 	border-color: @normal-color;
		// 	&.active{
		// 		border-color: @active-color;
		// 	}
		// }
		&.disabled{
			background-color: #f0f0f0;
		}
		text-align: left;
		-webkit-appearance: none;
		background-color: #fff;
		background-image: none;
		border-radius: 4px;
		border: 1px solid @hover-color;
		box-sizing: border-box;
		color: @normal-color;
		display: inline-block;
		font-size: inherit;
		height: 3em;
		line-height: inherit;
		outline: none;
		// padding: 0 @arrowWidth 0 @padding-left;
		transition: border-color .2s cubic-bezier(.645,.045,.355,1);
		width: 100%;
		position: relative;
		.input{
			width: 100%; height: 100%; 
			display: flex; align-items: center; justify-content: center;
			
		}
		.placeholder{
			color: #bbb;
		}
		
		//***************************  右侧的小箭头  ***************************
		.right-arrow{
			&.isRotate{
				transform: rotate(180deg);
			}
			transition: transform .2s cubic-bezier(.645,.045,.355,1);
			position: absolute; font-size: 1em; right: 0px; display: flex; 
			top: 0;
			align-items: center; color: @hover-color; height: 100%;
			font-weight: 100; width: @arrowWidth; justify-content: center;
		}
		.clear{
			color: #fff;  line-height: 1; 
			background-color: @hover-color; border-radius: 50%;  padding: 2px;
		}
		
		/****** 列表框部分样式 *****/
		.list-container{
			position: absolute; width: 100%; left: 0; top: 0px;
			box-sizing: border-box; z-index: 100;
			
			//***************************  弹出框上面的小三角  ***************************
			// .popper__arrow{
			// 	 transform: translateX(-400%);
			// 	 position: absolute;
			// 	 display: block;
			// 	 width: 0;
			// 	 height: 0;
			// 	 border-color: transparent;
			// 	 border-style: solid;
			// 	 border-width: 6px;
			// 	 filter: drop-shadow(0 2px 12px rgba(0,0,0,.03));
			// 	 left: 30%;
			// 	 margin-right: 3px;
			// 	 border-top-width: 0;
			// 	 border-bottom-color: #dcdfe6;  
			// 	 top: -5px;
			// 	&:after{
			// 		content: " ";
			// 		border-width: 6px;
			// 		position: absolute;
			// 		display: block;
			// 		width: 0;
			// 		height: 0;
			// 		border-color: transparent;
			// 		border-style: solid;
			// 		 top: 1px;
			// 		margin-left: -6px;
			// 		border-top-width: 0;
			// 		border-bottom-color: #fff;
			// 	}
			// }
			.list{
				border-radius: 4px;
				border: 1px solid #dcdfe6; 
				width: 100%; 
				max-height: 10em;
				background-color: #fff;
				box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
				padding: 5px 0;
				
				//***************************  弹出框中每一项样式  ***************************
				.item{
					&:hover{
						background-color: @mouse-move-color;
						&.disabled{
							background-color: transparent;
						}
					}
					&.active{
						color: @active-color;
						font-weight: 500;
						background-color: @mouse-move-color;
					}
					&.disabled{
						color:  @hover-color;
					}
					padding: 0 @padding-left;
					line-height: 2;
				}
				.data-state{
					color:  @hover-color;
				}
			}
		}
	}
	
//**************************************  以下为字体  ****************************************
@font-face {font-family: "iconfont";
  src: 
  url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAM8AAsAAAAAB1gAAALvAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqCEIFsATYCJAMQCwoABCAFhG0HSxthBhEVlKdkPwvsmHgLNqmwEc2pDxvYjI1gkX0f4uFrv9dz3+772RAqQJV8FbKANj5RiB1f1q0ioyorK1THs2Qj0gAJVYn///3mxT27TKyJJ63gD/KkYhr/9woe4ghtLxKJk5AWd7icc+CiJuQLU5SVQ48+ST+l0H2/pM2sm89zOb2VZYHMb1luYy3a0496AWYLKLA9sQ0UaAEFxC2yi7gTF3GaQJtRTbFxcfcIRYYmBeKyjDJQCiFZNrJFaDSszOI11Ep1IQZeRd+P/zAXcip1gmbuHJ/nYeWX9redqtuqPU6AYj4vjHUkNJGJ08bUviQMXtL2m2wJRVHxS/sz/N1+2CZOdizDemP/eBXRgCo7wIKcTvzSUnlmGMoSgt/tChX8EEOBlNvCLsQdpgv8HuNG8wuia9YA1Tfni5TZR1QthTxh8ZM2VCAHtiBtzfWtz1RtObA8IXowr5rzRK4/sRYpfjm1FBA9nrPl/qNAJRZLKJNsUumMKdb3dkIlkqjEtt8VrbNjZgnB48fG1XqNHax98/uI4xs768DFXVceFql2do6594N/t9vl/tw+ZlhKP6ngFjorHQq/AOmpcAlI98L7Pz/KG7P0OqU7+SuqQ7d8OXhYRvZsnLHcTCD4zwpgXfZVyJGzq6byIJiNgyZUaNOGv5ujz885jIPgWkIxOCLYYiRDUkyTmdNErd0CGopltJm1vb5dv3tJ5DDjpYTQ4wMqXT4h6fGZzJwfqA2R/SGlDxGUnsO0o4onyuKUUDLWoDbodPCGuFjE1U9sJispr4r4X6Sxi0IRiZWzD/RIc8wZ56ZkNmAoOLhL56G1ASKFHjWnLXOssmix6UWpDm4nnCJIYqgGlA3oaIFneHMmKp9/Qo2JJVEHqyf9hcio6x0UUjmAfOg9iHUvl4xmjRJjBjBI4IC7NAxZVgBi87Ae0liqHZGIKhluZKD6dH2j+8Jd0AY9MUcVKXLU5I9a6XU7FUcUppMkCss5MAeXmM7a3Q4A') format('woff2'),
  url('data:application/x-font-woff;charset=utf-8;base64,d09GMgABAAAAAAM8AAsAAAAAB1gAAALvAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqCEIFsATYCJAMQCwoABCAFhG0HSxthBhEVlKdkPwvsmHgLNqmwEc2pDxvYjI1gkX0f4uFrv9dz3+772RAqQJV8FbKANj5RiB1f1q0ioyorK1THs2Qj0gAJVYn///3mxT27TKyJJ63gD/KkYhr/9woe4ghtLxKJk5AWd7icc+CiJuQLU5SVQ48+ST+l0H2/pM2sm89zOb2VZYHMb1luYy3a0496AWYLKLA9sQ0UaAEFxC2yi7gTF3GaQJtRTbFxcfcIRYYmBeKyjDJQCiFZNrJFaDSszOI11Ep1IQZeRd+P/zAXcip1gmbuHJ/nYeWX9redqtuqPU6AYj4vjHUkNJGJ08bUviQMXtL2m2wJRVHxS/sz/N1+2CZOdizDemP/eBXRgCo7wIKcTvzSUnlmGMoSgt/tChX8EEOBlNvCLsQdpgv8HuNG8wuia9YA1Tfni5TZR1QthTxh8ZM2VCAHtiBtzfWtz1RtObA8IXowr5rzRK4/sRYpfjm1FBA9nrPl/qNAJRZLKJNsUumMKdb3dkIlkqjEtt8VrbNjZgnB48fG1XqNHax98/uI4xs768DFXVceFql2do6594N/t9vl/tw+ZlhKP6ngFjorHQq/AOmpcAlI98L7Pz/KG7P0OqU7+SuqQ7d8OXhYRvZsnLHcTCD4zwpgXfZVyJGzq6byIJiNgyZUaNOGv5ujz885jIPgWkIxOCLYYiRDUkyTmdNErd0CGopltJm1vb5dv3tJ5DDjpYTQ4wMqXT4h6fGZzJwfqA2R/SGlDxGUnsO0o4onyuKUUDLWoDbodPCGuFjE1U9sJispr4r4X6Sxi0IRiZWzD/RIc8wZ56ZkNmAoOLhL56G1ASKFHjWnLXOssmix6UWpDm4nnCJIYqgGlA3oaIFneHMmKp9/Qo2JJVEHqyf9hcio6x0UUjmAfOg9iHUvl4xmjRJjBjBI4IC7NAxZVgBi87Ae0liqHZGIKhluZKD6dH2j+8Jd0AY9MUcVKXLU5I9a6XU7FUcUppMkCss5MAeXmM7a3Q4A') format('woff')
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.iconshanchu1:before {
  content: "\e68c";
}

.icongou:before {
  content: "\e786";
}

.iconarrowBottom-fill:before {
  content: "\e60e";
}
</style>
