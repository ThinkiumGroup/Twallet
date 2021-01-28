<template>
  <view class="cmd-progress cmd-progress-default" :class="setStatusClass">
    <block v-if="type == 'circle' || type == 'dashboard'">
      <view class="cmd-progress cmd-progress-default" :class="setStatusClass">
        <view class="cmd-progress-inner" :style="setCircleStyle">
          <!-- Draw circles start -->
          <!-- #ifdef H5 -->
          <svg viewBox="0 0 100 100" class="cmd-progress-circle">
            <path :d="setCirclePath" stroke="#f3f3f3" :stroke-linecap="strokeShape" :stroke-width="strokeWidth"
              fill-opacity="0" class="cmd-progress-circle-trail" :style="setCircleTrailStyle"></path>
            <path :d="setCirclePath" :stroke-linecap="strokeShape" :stroke-width="strokeWidth" fill-opacity="0" class="cmd-progress-circle-path"
              :style="setCirclePathStyle"></path>
          </svg>
          <!-- #endif -->
          <!-- #ifndef H5 -->
          <text :style="setCircle"></text>
          <!-- #endif -->
          <!-- Draw circles end -->
          <!-- Status text start -->
          <block v-if="showInfo">
            <text class="cmd-progress-text" :title="setFormat">
              <block v-if="status != 'success' && status != 'exception' && setProgress < 100">{{setFormat}}</block>
              <!-- #ifdef H5 -->
              <svg v-if="status == 'exception'" viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor"
                aria-hidden="true">
                <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
              </svg>
              <svg v-if="status == 'success' || setProgress == 100" viewBox="64 64 896 896" data-icon="check" width="1em"
                height="1em" fill="currentColor" aria-hidden="true" :style="{'color': strokeColor ? strokeColor : ''}">
                <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
              </svg>
              <!-- #endif -->
              <!-- #ifndef H5 -->
              <text v-if="status == 'exception' || status == 'success' || setProgress == 100" :style="setCircleIcon"></text>
              <!-- #endif -->
            </text>
          </block>
          <!-- Status text end -->
        </view>
      </view>
    </block>

    <block v-if="type == 'line'">
      <!-- progress bar start -->
      <view class="cmd-progress-outer">
        <view class="cmd-progress-inner" :style="{'border-radius': strokeShape == 'square' ? 0 : '100px'}">
          <view class="cmd-progress-bg" :style="setLineStyle"></view>
          <view v-if="successPercent" class="cmd-progress-success-bg" :style="setLineSuccessStyle"></view>
        </view>
      </view>
      <!-- progress bar end -->
      <!-- Does the progress bar display information start -->
      <block v-if="showInfo">
        <text class="cmd-progress-text" :title="setFormat">
          <block v-if="status != 'success' && status != 'exception' && setProgress < 100">{{setFormat}}</block>
          <!-- #ifdef H5 -->
          <svg v-if="status == 'exception'" viewBox="64 64 896 896" data-icon="close-circle" width="1em" height="1em"
            fill="currentColor" aria-hidden="true">
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
          </svg>
          <svg v-if="status == 'success' || setProgress == 100" viewBox="64 64 896 896" data-icon="check-circle" width="1em"
            height="1em" fill="currentColor" aria-hidden="true" :style="{'color': strokeColor ? strokeColor : ''}">
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
          </svg>
          <!-- #endif -->
          <!-- #ifndef H5 -->
          <text v-if="status == 'exception' || status == 'success' || setProgress == 100" :style="setLineStatusIcon"></text>
          <!-- #endif -->
        </text>
      </block>
      <!-- Does the progress bar display information end -->
    </block>
  </view>
</template>

<script>
  /**  
   * Progress bar component  
   * @description 
		When the completion percentage of an operation is displayed, the current progress and status of the operation are displayed for the user.  
   * @tutorial https://ext.dcloud.net.cn/plugin?id=259  
   * @property {String} Type progress type - linetype: line, circle, dashboard: dashboard, default linetype: Line 
   * @property {Number} Percentage progress percentage value - the display range is 0-100. If the number is relatively large, you need to convert it to a percentage value by yourself9  
   * @property {Number} success-percent Percentage of progress completed - only support progress line type: Line
   * @property {String} status Progress status - surge: active (only line type is supported), normal: normal, completion: success, failure: exception, normal by default  
   * @property {Boolean} show-info Progress status information - whether to display progress value or status icon, true by default 
   * @property {Number} stroke-width Width of progress line - it is recommended that the width range of the line is 1-50, which is related to the display width of the progress bar. The default is 8 
   * @property {String} Stroke color the color gradient of a progress line only supports line type: line 
   * @property {String} Stroke shape the shape of both ends of the progress line - Circle: round, square right angle: square, default circle: round 
   * @property {Number} width Progress canvas width - only support circle, dashboard, 80 by default  
   * @property {String} gap-degree Progress circular notch angle - can be 0 ~ 360, only circle and dashboard are supported  
   * @property {String} gap-position Round gap position of progress - values of 'top', 'bottom', 'left' and 'right' are allowed. Only circle and dashboard are supported  
   * @example <cmd-progress :percent="30"></cmd-progress>  
   */
  export default {
    name: 'cmd-progress',

    props: {
      /**
       * Default type: line, optional line circle dashboard
       */
      type: {
        validator: val => {
          return ['line', 'circle', 'dashboard'].includes(val);
        },
        default: 'line'
      },
      /**
       * percentage
       */
      percent: {
        type: Number,
        default: 0
      },
      /**
       * Percentage of segments completed, only type line is supported
       */
      successPercent: {
        type: Number,
        default: 0
      },
      /**
       * Display progress value or status icon
       */
      showInfo: {
        type: Boolean,
        default: true
      },
      /**
       * Progress status, optional: normal success exception (active only supports type line)
       */
      status: {
        validator: val => {
          return ['normal', 'success', 'exception', 'active'].includes(val);
        },
        default: 'normal'
      },
      /**
       * The width of the line is 1-50, which is related to the width
       */
      strokeWidth: {
        type: Number,
        default: 6
      },
      /**
       * 
					The color of the line. The gradient only supports the type line
       */
      strokeColor: {
        type: String,
        default: ''
      },
      /**
       * The shapes of the two ends of the line are 'round', 'Square'
       */
      strokeShape: {
        validator: val => {
          return ['round', 'square'].includes(val);
        },
        default: 'round'
      },
      /**
       * The canvas width of the round progress bar supports the type circle dashboard
       */
      width: {
        type: Number,
        default: 80
      },
      /**
       * The gap angle of the round progress bar can be 0 ~ 360, and the type of circle dashboard is supported
       */
      gapDegree: {
        type: Number,
        default: 0
      },
      /**
       * 
				The gap position of the round progress bar can be 'top', 'bottom', 'left' and 'right'. The type of circle dashboard is supported
       */
      gapPosition: {
        validator: val => {
          return ['top', 'bottom', 'left', 'right'].includes(val);
        },
        default: 'top'
      }
    },

    computed: {
      /**
       * If you need to customize the format, change it here
       */
      setFormat() {
        return `${this.setProgress}%`;
      },
      /**
       * Set the display progress value, forbid less than 0 and more than 100
       */
      setProgress() {
        let percent = this.percent;
        if (!this.percent || this.percent < 0) {
          percent = 0;
        } else if (this.percent >= 100) {
          percent = 100;
        }
        return percent;
      },
      /**
       * Svg size of progress circle
       */
      setCircleStyle() {
        return `width: ${this.width}px;
				height: ${this.width}px;
				fontSize: ${this.width * 0.15 + 6}px;`
      },
      /**
       *Circle background color
       */
      setCircleTrailStyle() {
        const radius = 50 - this.strokeWidth / 2;
        const len = Math.PI * 2 * radius;
        const gapDeg = this.gapDegree || (this.type === 'dashboard' && 75);
        return `stroke-dasharray: ${len - (gapDeg||0)}px, ${len}px;
				stroke-dashoffset: -${(gapDeg||0) / 2}px;
				transition: stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s;`
      },
      /**
       * Circle progress
       */
      setCirclePathStyle() {
        const radius = 50 - this.strokeWidth / 2;
        const len = Math.PI * 2 * radius;
        const gapDeg = this.gapDegree || (this.type === 'dashboard' && 75);
        return `stroke: ${this.strokeColor};
				stroke-dasharray: ${(this.setProgress / 100) * (len - (gapDeg||0))}px, ${len}px;
				stroke-dashoffset: -${(gapDeg||0) / 2}px;
				transition: stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s, stroke-width 0.06s ease 0.3s;`
      },
      /**
       * Draw circles
       */
      setCirclePath() {
        const radius = 50 - this.strokeWidth / 2;
        let beginPositionX = 0;
        let beginPositionY = -radius;
        let endPositionX = 0;
        let endPositionY = -2 * radius;
        const gapPos = (this.type === 'dashboard' && 'bottom') || this.gapPosition || 'top';
        switch (gapPos) {
          case 'left':
            beginPositionX = -radius;
            beginPositionY = 0;
            endPositionX = 2 * radius;
            endPositionY = 0;
            break;
          case 'right':
            beginPositionX = radius;
            beginPositionY = 0;
            endPositionX = -2 * radius;
            endPositionY = 0;
            break;
          case 'bottom':
            beginPositionY = radius;
            endPositionY = 2 * radius;
            break;
          default:
            break;
        }
        return `M 50,50 m ${beginPositionX},${beginPositionY} a ${radius},${radius} 0 1 1 ${endPositionX},${-endPositionY} a ${radius},${radius} 0 1 1 ${-endPositionX},${endPositionY}`;
      },
      // #ifndef H5
      /**
       * Non H5 end, draw progress circle SVG to base URL
       */
      setCircle() {
        const radius = 50 - this.strokeWidth / 2;
        const len = Math.PI * 2 * radius;
        const gapDeg = this.gapDegree || (this.type === 'dashboard' && 75);
        let currentColor = '#108ee9'
        // Abnormal progress
        if (this.status == 'exception') {
          currentColor = '#f5222d'
        }
        // Completion schedule
        if (this.status == 'success' || this.setProgress >= 100 || this.strokeColor) {
          currentColor = this.strokeColor || '#52c41a'
        }
        let svgToBase =
          `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' class='cmd-progress-circle'%3E%3Cpath d='${this.setCirclePath}' stroke='%23f3f3f3' stroke-linecap='${this.strokeShape}' stroke-width='${this.strokeWidth}' fill-opacity='0' class='cmd-progress-circle-trail' style='stroke-dasharray: ${len - (gapDeg||0)}px, ${len}px;stroke-dashoffset: -${(gapDeg||0) / 2}px;transition: stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s;'%3E%3C/path%3E%3Cpath  d='${this.setCirclePath}' stroke-linecap='${this.strokeShape}' stroke-width='${this.strokeWidth}' fill-opacity='0' class='cmd-progress-circle-path' style='stroke: ${escape(currentColor)};stroke-dasharray: ${(this.setProgress / 100) * (len - (gapDeg||0))}px, ${len}px;stroke-dashoffset: -${(gapDeg||0) / 2}px;transition: stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s, stroke-width 0.06s ease 0.3s;'%3E%3C/path%3E%3C/svg%3E`
        return `background-image: url("${svgToBase}");
				background-size: cover;
				display: inline-block;
				${this.setCircleStyle}`;
      },
      /**
       * Set progress circle status icon
       */
      setCircleIcon() {
        let currentColor = '#108ee9'
        let svgToBase = ''
        // Abnormal progress
        if (this.status == 'exception') {
          currentColor = '#f5222d'
          svgToBase =
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='64 64 896 896' data-icon='close' width='1em' height='1em' fill='${escape(currentColor)}' aria-hidden='true'%3E %3Cpath d='M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z'%3E%3C/path%3E %3C/svg%3E`;
        }
        // Completion schedule
        if (this.status == 'success' || this.setProgress >= 100) {
          currentColor = this.strokeColor || '#52c41a'
          svgToBase =
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='64 64 896 896' data-icon='check' width='1em' height='1em' fill='${escape(currentColor)}' aria-hidden='true'%3E %3Cpath d='M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z'%3E%3C/path%3E %3C/svg%3E`;
        }
        return `background-image: url("${svgToBase}");
				background-size: cover;
				display: inline-block;
				width: 1em;
				height: 1em;`;
      },
      // #endif
      /**
       * Set progress bar style
       */
      setLineStyle() {
        return `width: ${this.setProgress}%;
				height: ${this.strokeWidth}px;
				background: ${this.strokeColor};
				border-radius: ${this.strokeShape === 'square' ? 0 : '100px'};`;
      },
      /**
       * Set the progress of completed segments
       */
      setLineSuccessStyle() {
        let successPercent = this.successPercent;
        if (!this.successPercent || this.successPercent < 0 || this.setProgress < this.successPercent) {
          successPercent = 0;
        } else if (this.successPercent >= 100) {
          successPercent = 100;
        }
        return `width: ${successPercent}%;
				height: ${this.strokeWidth}px;
				border-radius: ${this.strokeShape === 'square' ? 0 : '100px'};`;
      },
      // #ifndef H5
      /**
       * Set progress bar status icon
       */
      setLineStatusIcon() {
        let currentColor = '#108ee9'
        let svgToBase = ''
        // Abnormal progress
        if (this.status == 'exception') {
          currentColor = '#f5222d'
          svgToBase =
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='64 64 896 896' data-icon='close-circle' width='1em' height='1em' fill='${escape(currentColor)}' aria-hidden='true'%3E %3Cpath d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z'%3E%3C/path%3E %3C/svg%3E`;
        }
        // Completion schedule
        if (this.status == 'success' || this.setProgress >= 100) {
          currentColor = this.strokeColor || '#52c41a'
          svgToBase =
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='64 64 896 896' data-icon='check-circle' width='1em' height='1em' fill='${escape(currentColor)}' aria-hidden='true'%3E %3Cpath d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z'%3E%3C/path%3E %3C/svg%3E`;
        }
        return `background-image: url("${svgToBase}");
				background-size: cover;
				display: inline-block;
				width: 1em;
				height: 1em;`;
      },
      // #endif
      /**
       * State style
       */
      setStatusClass() {
        let statusClass = [];
        // Abnormal progress
        if (this.status == 'exception') {
          statusClass.push('cmd-progress-status-exception')
        }
        // Completion schedule
        if (this.status == 'success' || this.setProgress >= 100) {
          statusClass.push('cmd-progress-status-success')
        }
        // Activity progress bar
        if (this.status == 'active') {
          statusClass.push('cmd-progress-status-active')
        }
        // Display information
        if (this.showInfo) {
          statusClass.push('cmd-progress-show-info')
        }
        // Progress bar type
        if (this.type === 'line') {
          statusClass.push('cmd-progress-line')
        }
        // Progress circle, dashboard type
        if (this.type === 'circle' || this.type === 'dashboard') {
          statusClass.push('cmd-progress-circle')
        }
        statusClass.push('cmd-progress-status-normal')
        return statusClass;
      }
    }
  }
</script>

<style>
  .cmd-progress { 
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    display: inline-block;
		
  }

  .cmd-progress-line {
    width: 100%;
    font-size: 28upx;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .cmd-progress-outer {
    display: inline-block;
    width: 100%;
    margin-right: 0;
    padding-right: 0;
  }

  .cmd-progress-show-info .cmd-progress-outer {
    flex: 1;
  }

  .cmd-progress-inner {
    display: inline-block;
    width: 100%;
    background-color: #E6E7E9;
    border-radius: 200upx;
    vertical-align: middle;
    position: relative;
  }

  .cmd-progress-circle-trail {
    stroke: #f5f5f5;
  }

  .cmd-progress-circle-path {
    stroke: #1890ff;
    animation: appear 0.3s;
  }

  .cmd-progress-success-bg,
  .cmd-progress-bg {
    background-color: #1890ff;
    transition: all 0.4s cubic-bezier(0.08, 0.82, 0.17, 1) 0s;
    position: relative;
  }

  .cmd-progress-success-bg {
    background-color: #52c41a;
    position: absolute;
    top: 0;
    left: 0;
  }

  .cmd-progress-text {
    word-break: normal;
    width: 60upx;
    text-align: left;
    margin-left: 16upx;
    vertical-align: middle;
    display: inline-block;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.45);
    line-height: 1;
  }

  .cmd-progress-status-active .cmd-progress-bg:before {
    content: "";
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    border-radius: 20upx;
    -webkit-animation: cmd-progress-active 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
    animation: cmd-progress-active 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
  }

  .cmd-progress-status-exception .cmd-progress-bg {
    background-color: #f5222d;
  }

  .cmd-progress-status-exception .cmd-progress-text {
    color: #f5222d;
  }

  .cmd-progress-status-exception .cmd-progress-circle-path {
    stroke: #f5222d;
  }

  .cmd-progress-status-success .cmd-progress-bg {
    background-color: #52c41a;
  }

  .cmd-progress-status-success .cmd-progress-text {
    color: #52c41a;
  }

  .cmd-progress-status-success .cmd-progress-circle-path {
    stroke: #52c41a;
  }

  .cmd-progress-circle .cmd-progress-inner {
    position: relative;
    line-height: 1;
    background-color: transparent;
  }

  .cmd-progress-circle .cmd-progress-text {
    display: block;
    position: absolute;
    width: 100%;
    text-align: center;
    line-height: 1;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    left: 0;
    margin: 0;
    color: rgba(0, 0, 0, 0.65);
    white-space: normal;
  }

  .cmd-progress-circle .cmd-progress-status-exception .cmd-progress-text {
    color: #f5222d;
  }

  .cmd-progress-circle .cmd-progress-status-success .cmd-progress-text {
    color: #52c41a;
  }

  @keyframes cmd-progress-active {
    0% {
      opacity: 0.1;
      width: 0;
    }

    20% {
      opacity: 0.5;
      width: 0;
    }

    100% {
      opacity: 0;
      width: 100%;
    }
  }
</style>
