<template>
  <ul class="timeline-wrapper">
    <li class="timeline-item">
      <div class="timeline-box">
        <div class="out-circle">
          <div class="in-circle" />
        </div>
        <div class="long-line" style="height:32px" />
      </div>
      <div class="timeline-content">
        <div class="timeline-date">开始监管</div>
      </div>
    </li>
    <li v-for="(item,index) in timelineList" :key="index" class="timeline-item">
      <div class="timeline-box">
        <div class="out-circle">
          <div class="in-circle" />
        </div>
        <div class="long-line" />
      </div>
      <div class="timeline-content">
        <div class="timeline-date">监管中</div>
        <div class="timeline-title">监管过程: {{ item.processtype }}</div>
        <div class="timeline-title">监管人员: {{ item.processuser }}</div>
        <div class="timeline-title">派发时间: {{ item.assigntime }}</div>
        <div class="timeline-title">派发人员: {{ item.assignuser }}</div>
        <div class="timeline-title">监管说明: {{ item.remark }}</div>
        <div class="timeline-title">监管附件: {{ item.attachfiles }}</div>
      </div>
    </li>
    <li class="timeline-item">
      <div class="timeline-box">
        <div class="out-circle">
          <div class="in-circle" />
        </div>
      </div>
      <div class="timeline-content">
        <div class="timeline-date">监管结束</div>
      </div>
    </li>
  </ul>
</template>

<script type="text/babel">
export default {
  name: 'Timeline',
  props: {
    timelineList: {
      type: Array,
      default: () => {
        return [
          {
            assigntime: '2021-10-11 15:22:22',
            assignuser: '13117286095',
            attachfiles: null,
            processtime: null,
            processtype: '运输',
            processuser: '18888888888',
            refsysid: 'N20213301100167',
            remark: null,
            sysid: '00f0d5362a6311ec9cfa',
            uploadtime: null,
            x: 0,
            y: 0,
            z: 0
          }
        ]
      }
    }
  }
}
</script>

<style scoped lang="scss">
    ul.timeline-wrapper {
        list-style: none;
        width:330px;
        margin: 0;
        padding: 0;
    }

    /* 时间线 */
    .timeline-item {
        position: relative;

        .timeline-box {
            text-align: center;
            position: absolute;

            .out-circle {
                width: 16px;
                height: 16px;
                background-color: rgba(14, 116, 218, 0.1);
                box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
                /*opacity: 0.1;*/
                border-radius: 50%;
                display: flex;
                align-items: center;
                .in-circle {
                    width: 8px;
                    height: 8px;
                    margin: 0 auto;
                    background: rgba(14, 116, 218, 1);
                    border-radius: 50%;
                    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
                }
            }

            .long-line {
                width: 2px;
                height: 189px;
                background: rgba(14, 116, 218, 1);
                box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
                opacity: 0.1;
                margin-left: 8px;
            }
        }

        .timeline-content {
            box-sizing: border-box;
            margin-left: 20px;
            // height: 106px;
            padding: 0 0 0 20px;
            text-align: left;
            margin-bottom: 15px;

            .timeline-title {
                font-size: 14px;
                word-break: break-all;
                height: 27px;
                color: #818181;
                border-bottom: 1px dashed #e7e1e1;
                font-weight: 500;
                line-height: 25px;
            }

            .timeline-date {
                font-size: 16px;
                color: #333;
                font-weight: 500;
                margin-bottom: 10px;
            }
            .timeline-desc {
                font-size: 14px;
                margin-bottom: 6px;
                color: #999999;
            }
        }

    }

    .timeline-item:last-of-type .timeline-content {
        margin-bottom: 0;
    }
</style>

