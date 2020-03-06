<template>
    <div class="bg">
        <img src="../../assets/homePic.jpg">
        <!-- <table class="home-table">
            <thead>
                <th></th>
                <th>准备阶段</th>
                <th>种植生产前</th>
                <th>种植生产中</th>
                <th>种植生产后</th>
            </thead>
            <tbody>
                <tr class="app">
                    <td>APP</td>
                    <td></td>
                    <td></td>
                    <td>
                        <div class="pic-wrapper">
                            <div class="list-message message inline">
                                <div class="icon-wrapper">
                                    <div>
                                        <img src="../../assets/工单列表.png" style="width: 25px" alt="">
                                        <span>工单列表</span>
                                    </div>
                                </div>
                            </div>
                            <div class="appfeed-message message inline">
                                <div class="icon-wrapper">
                                    <div>
                                        <img src="../../assets/反馈相关.png" alt="">
                                        <span>反馈相关</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td></td>
                </tr>
                <tr class="background">
                    <td style="color: #2C909C">后台</td>
                    <td style="width: 19%">
                        <div class="arrow-icon arrow-td" style="top: 48%;left: 96%;"></div>
                        <div class="crop-message message">
                            <div class="arrow-icon arrow-left" style="top: 23%;left: 25%;"></div>
                            <div class="arrow-icon arrow-left" style="top: 50%;left: 25%;"></div>
                            <div class="arrow-icon arrow-left" style="top: 50%;left: 58%;"></div>
                            <div class="icon-wrapper">
                                <div @click="changeRoute({code: '/users', id: '4'})">
                                    <img src="../../assets/人员.png" alt="">
                                    <span>人员信息</span>
                                </div>
                                <div @click="changeRoute({code: '/roles', id: '12'})">
                                    <img src="../../assets/角色.png" alt="">
                                    <span>角色信息</span>
                                </div>
                            </div>
                            <div class="icon-wrapper">
                                <div @click="changeRoute({code: '/baseInfo', id: '20'})">
                                    <img src="../../assets/基地信息.png" alt="">
                                    <span>基地信息</span>
                                </div>
                                <div @click="changeRoute({code: '/baseInfo', id: '20'})">
                                    <img src="../../assets/基地检测.png" alt="">
                                    <span>基地检测</span>
                                </div>
                                <div @click="changeRoute({code: '/envstandards', id: '21'})">
                                    <img src="../../assets/基地信息拷贝.png" alt="">
                                    <span>基地检测标准</span>
                                </div>
                            </div>
                            <div class="icon-wrapper">
                                <div @click="changeRoute({code: '/medicine', id: '13'})">
                                    <img src="../../assets/作物信息.png" alt="">
                                    <span>作物信息</span>
                                </div>
                            </div>
                        </div>
                        <div class="company-message message">
                            <div class="icon-wrapper">
                                <div @click="changeRoute({code: '/company', id: '347'})">
                                    <img src="../../assets/公司信息.png" alt="">
                                    <span>公司信息</span>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td style="width: 19%">
                        <div class="arrow-icon arrow-last" style="top: 18%;left: 85%;"></div>
                        <div class="arrow-icon arrow-down" style="top: 48%;left: 48%;"></div>
                        <div class="arrow-icon arrow-down" style="top: 71%;left: 48%;"></div>
                        <div class="base-message message">
                            <div class="arrow-icon arrow-left" style="top: 63%;left: 25%;"></div>
                            <div class="arrow-icon arrow-left" style="top: 63%;left: 58%;"></div>
                            <div class="icon-wrapper">
                                <div @click="changeRoute({code: '/farmingItem', id: '141'})" style="position:absolute; right: 20px">
                                    <img src="../../assets/农事项目.png" alt="">
                                    <span>农事项目</span>
                                </div>
                            </div>
                            <div class="icon-wrapper">
                                <div @click="changeRoute({code: '/seed', id: '111'})">
                                    <img src="../../assets/种子种苗信息.png" alt="">
                                    <span>种子种苗信息</span>
                                </div>
                                <div @click="changeRoute({code: '/seed/detection', id: '19'})">
                                    <img src="../../assets/种子种苗检测.png" alt="">
                                    <span>种子种苗检测</span>
                                </div>
                                <div @click="changeRoute({code: '/standard/deteitem', id: '6'})">
                                    <img src="../../assets/种苗检测标准.png" alt="">
                                    <span>种苗检测标准</span>
                                </div>
                            </div>
                        </div>
                        <div class="plan-message message">
                            <div class="icon-wrapper">
                                <div @click="changeRoute({code: '/plan', id: '121'})">
                                    <img src="../../assets/种植计划.png" alt="">
                                    <span>种植计划</span>
                                </div>
                            </div>
                        </div>
                        <div class="batch-message message">
                            <div class="icon-wrapper">
                                <div @click="changeRoute({code: '/batch', id: '151'})">
                                    <img src="../../assets/种植批次.png" alt="">
                                    <span>种植批次</span>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td style="width: 36%">
                        <div class="arrow-icon arrow-td" style="top: 48%;left: 98%;"></div>
                        <div class="arrow-icon arrow-up" style="height: 40px;top: -3%;left: 33%;"></div>
                        <div class="arrow-icon arrow-down" style="height: 40px;top: -3%;left: 35%;"></div>
                        <div class="arrow-icon arrow-up" style="height: 40px;top: -3%;left: 63%;"></div>
                        <div class="arrow-icon arrow-down" style="height: 40px;top: -3%;left: 65%;"></div>
                        <div class="arrow-icon arrow" style="top: 30%;left: 34%;"></div>
                        <div class="arrow-icon arrow-right" style="top: 18%;left: 48%;"></div>
                        <div class="pic-wrapper" style="text-align:left">
                            <div class="order-message message middle inline">
                                <div class="icon-wrapper">
                                    <div @click="changeRoute({code: '/workorder/overview', id: '33'})">
                                        <img src="../../assets/种植工单.png" style="width: 30px" alt="">
                                        <span>种植工单</span>
                                    </div>
                                    <div @click="changeRoute({code: '/workorder/overview', id: '33'})">
                                        <img src="../../assets/临时种植工单.png" style="width: 30px" alt="">
                                        <span>临时种植工单</span>
                                    </div>
                                </div>
                            </div>
                            <div class="feedback-message message middle inline">
                                <div class="icon-wrapper">
                                    <div @click="changeRoute({code: '/BCHFeedback', id: '471'})">
                                        <img src="../../assets/病虫害反馈.png" alt="">
                                        <span>病虫害反馈</span>
                                    </div>
                                    <div @click="changeRoute({code: '/feedback', id: '348'})">
                                        <img src="../../assets/巡查反馈.png" alt="">
                                        <span>巡查反馈</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="pic-wrapper" style="text-align:left">
                            <div class="ready-message message inline">
                                <div class="icon-wrapper">
                                    <div @click="changeRoute({code: '/prepare', id: '310'})">
                                        <img src="../../assets/准备事项.png" alt="">
                                        <span>准备事项</span>
                                    </div>
                                </div>
                            </div>
                            <div class="farm-message message inline">
                                <div class="icon-wrapper">
                                    <div @click="changeRoute({code: '/temporary/farming', id: '152'})">
                                        <img src="../../assets/临时农事.png" alt="">
                                        <span>临时农事</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="pic-wrapper" style="text-align:left">
                            <div class="report-message message inline">
                                <div class="icon-wrapper">
                                    <div @click="changeRoute({code: '/budgetereport', id: '345'})">
                                        <img src="../../assets/预算报表.png" alt="">
                                        <span>预算报表</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td style="width: 22%">
                        <div class="arrow-icon arrow-right" style="top: 50%;left: 46%;"></div>
                        <div class="arrow-icon arrow-up" style="height: 30px; top: 31%;left: 27%;"></div>
                        <div class="arrow-icon arrow-up" style="height: 30px; top: 31%;left: 70%;"></div>
                        <div class="arrow-icon arrow-down" style="height: 30px; top: 63%;left: 27%;"></div>
                        <div class="arrow-icon arrow-down" style="height: 30px; top: 63%;left: 70%;"></div>
                        <div class="pic-wrapper">
                            <div class="seed-message message last inline">
                                <div class="icon-wrapper">
                                    <div @click="changeRoute({code: '/seed', id: '111'})">
                                        <img src="../../assets/种子种苗信息.png" alt="">
                                        <span>种苗种子</span>
                                    </div>
                                </div>
                            </div>
                            <div class="code-message message last inline">
                                <div class="icon-wrapper">
                                    <div @click="changeRoute({code: '/retrocoding', id: '350'})">
                                        <img src="../../assets/追溯打码.png" alt="">
                                        <span>追溯打码</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="pic-wrapper">
                            <div class="rec-message message last inline">
                                <div class="icon-wrapper">
                                    <div @click="changeRoute({code: '/recovery/batch', id: '153'})">
                                        <img src="../../assets/采收批次.png" alt="">
                                        <span>采收批次</span>
                                    </div>
                                </div>
                            </div>
                            <div class="init-message message last inline">
                                <div class="icon-wrapper">
                                    <div @click="changeRoute({code: '/initialpro/batch', id: '261'})">
                                        <img src="../../assets/初加工批次.png" alt="">
                                        <span>初加工批次</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="pic-wrapper">
                            <div class="rec-check-message message last inline">
                                <div class="icon-wrapper">
                                    <div @click="changeRoute({code: '/recovery/detection', id: '17'})">
                                        <img src="../../assets/采收检测.png" alt="">
                                        <span>采收检测</span>
                                    </div>
                                </div>
                            </div>
                            <div class="init-check-message message last inline">
                                <div class="icon-wrapper">
                                    <div @click="changeRoute({code: '/initialpro/detection', id: '18'})">
                                        <img src="../../assets/初加工检测.png" alt="">
                                        <span>初加工检测</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr class="board">
                    <td>看板</td>
                    <td>
                        <div class="home-message message">
                            <div class="icon-wrapper">
                                <div>
                                    <img src="../../assets/详细信息.png" style="width: 25px" alt="">
                                    <span>详细信息</span>
                                </div>
                                <div>
                                    <img src="../../assets/首页相关信息.png" alt="">
                                    <span>首页相关信息</span>
                                </div>
                                <div>
                                    <img src="../../assets/基地信息.png" alt="">
                                    <span>基地信息</span>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="plot-message message">
                            <div class="icon-wrapper">
                                <div>
                                    <img src="../../assets/详细信息.png" style="width: 25px" alt="">
                                    <span>地块种苗检测信息</span>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="work-message message">
                            <div class="icon-wrapper">
                                <div>
                                    <img src="../../assets/基地工单信息.png" alt="">
                                    <span>基地工单信息</span>
                                </div>
                                <div>
                                    <img src="../../assets/地块工单信息.png" alt="">
                                    <span>地块工单信息</span>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="pic-wrapper">
                            <div class="plot-check-message message inline">
                                <div class="icon-wrapper">
                                    <div>
                                        <img src="../../assets/工单列表.png" style="width: 25px" alt="">
                                        <span>工单列表</span>
                                    </div>
                                </div>
                            </div>
                            <div class="board-check-message message inline">
                                <div class="icon-wrapper">
                                    <div>
                                        <img src="../../assets/反馈相关.png" alt="">
                                        <span>反馈相关</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table> -->
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        changeRoute(route) {
            this.$emit('test', route)
            this.$router.push({
                path: route.code
            })
        }
    },
}
</script>
<style lang='stylus' scoped>

.inline
    display inline-block

.bg
    width 100%
    height 100%
    max-height 850px
    img
        width 100%
        height 100%
    .home-table
        width 100%
        height 100%
        text-align:center
        font-size 18px
        color #CDCDCD
        height 850px
        thead
            border-bottom 2px solid #F3F3F3
            height 60px
            line-height 60px
            th
                border-right 2px solid #F3F3F3
            th:last-child
                border-right 0
        tbody
            tr
                border-bottom 2px solid #F3F3F3
                position relative
            tr:last-child
                border-bottom 0
            td
                border-right 2px solid #F3F3F3
                padding 20px 30px
                position relative
            td:last-child
                border-right 0
            .arrow-icon
                position absolute
                background-size 100% 100%
                background-repeat no-repeat
            .arrow-left
                background-image url('../../assets/left_arrow.png')
                width 20px
                height 10px
            .arrow-right
                background-image url('../../assets/right_arrow.png')
                width 30px
                height 10px
            .arrow-up
                background-image url('../../assets/up_arrow.png')
                width 10px
                height 20px
            .arrow-down
                background-image url('../../assets/down_arrow.png')
                width 10px
                height 20px
            .arrow
                background-image url('../../assets/arrow.png')
                width 70px
                height 40px
            .arrow-td
                background-image url('../../assets/td_arrow.png')
                width 30px
                height 20px
            .arrow-last
                background-image url('../../assets/last_arrow.png')
                width 86px
                height 335px
            .icon-wrapper
                padding 10px 10px
                display flex
                div
                    display flex
                    flex-direction column
                    align-items center
                    margin-right 10%
                    cursor pointer
                    &:last-child
                        margin-right 0
                    img
                        width 40px 
                        height 40px
                    span
                        font-size 12px
                        color #000
                        white-space nowrap
            .message
                    border 1px dashed rgb(160,205,211)
                    border-radius:6px;
                    position relative
                    &::after
                        position absolute
                        background-repeat no-repeat
                        font-size 14px
                        color #fff
                        height 34px
                        line-height 1.9
                        left -9px
                        top 5px
                        text-align:center
            .app
                .pic-wrapper
                    height 100px
                .list-message
                    width 25%
                    height 100%
                    margin-right 50px
                    &:after
                        content: 'APP工单列表'
                    .icon-wrapper
                        justify-content center
                        margin 25px
                .appfeed-message
                    width 25%
                    height 100%
                    &:after
                        content: '反馈功能'
                    .icon-wrapper
                        justify-content center
                        margin 25px
            .board
                .home-message
                    height 90%
                    &:after
                        content: '首页及详情信息'
                    .icon-wrapper
                        justify-content center
                        margin 30px 0 20px
                .plot-message
                    height 90%
                    &:after
                        content: '地块种苗检测信息'
                    .icon-wrapper
                        justify-content center
                        margin 30px 0 20px
                .work-message
                    height 90%
                    width 60%
                    margin-left 30px
                    &:after
                        content: '工单信息'
                    .icon-wrapper
                        justify-content center
                        margin 30px 0 20px
                        div
                            padding 0 10px
                .pic-wrapper
                    width 100%
                    height 90%
                    .plot-check-message
                        width 40%
                        margin-right 10%
                        &:after
                            content: '地块采收检测'
                        .icon-wrapper
                            justify-content center
                            margin-top 30px
                    .board-check-message
                        width 40%
                        &:after
                            content: '初加工检测信息'
                        .icon-wrapper
                            justify-content center
                            margin-top 30px
            .background
                background-color:rgba(44,144,156,0.08)
                .message
                    &::after
                        background-image url('../../assets/six_title.png')
                        width: 110px
                .crop-message
                    padding-top 30px
                    height 60%
                    margin-bottom 20px
                    &::after
                        content: '人地作物信息'
                    .icon-wrapper
                        height 33%
                        div
                            width 25%
                .company-message
                    height 30%
                    &::after
                        content: '公司信息'
                    .icon-wrapper
                        justify-content center
                        margin 30px
                .base-message
                    height 45%
                    margin-bottom 20px
                    &::after
                        content: '种植基础信息'
                    .icon-wrapper
                        height 50%
                        div
                            width 25%
                .plan-message
                    height 20%
                    margin-bottom 20px
                    &::after
                        content: '种植计划信息'
                    .icon-wrapper
                        justify-content center
                        margin 10px
                .batch-message
                    height 20%
                    &::after
                        content: '种植批次信息'
                    .icon-wrapper
                        justify-content center
                        margin 10px
                .order-message
                    margin-right 10%
                    &::after
                        content: '种植工单信息'
                    .icon-wrapper
                        padding-top 25px
                        height 100%
                        align-items center
                        div
                            flex 1
                .feedback-message
                    &::after
                        content: '反馈信息'
                    .icon-wrapper
                        padding-top 25px
                        height 100%
                        align-items center
                        div
                            flex 1
                .ready-message
                    width 30%
                    height 100%
                    margin-right 50px
                    &:after
                        content: '准备事项信息'
                    .icon-wrapper
                        justify-content center
                        margin 30px
                .farm-message
                    width 30%
                    height 100%
                    &:after
                        content: '临时农事信息'
                    .icon-wrapper
                        justify-content center
                        margin 30px
                .report-message
                    width 30%
                    height 100%
                    &:after
                        content: '预算报表信息'
                    .icon-wrapper
                        justify-content center
                        margin 30px
                .seed-message
                    &:after
                        content: '种苗种子信息'
                .code-message
                    &:after
                        content: '追溯打码信息'
                .rec-message
                    &:after
                        content: '采收批次信息'
                .init-message
                    &:after
                        content: '初加工批次信息'
                .rec-check-message
                    &:after
                        content: '采收检测信息'
                .init-check-message
                    &:after
                        content: '初加工检测信息'
                .pic-wrapper
                    height 26%
                    margin-bottom 40px
                    &:last-child
                        margin-bottom 0px
                    .middle
                        height 100%
                        width 45%
                .last
                    width 40%
                    height 100%
                    &:first-child
                        margin-right 10%
                    .icon-wrapper
                        justify-content center
                        margin-top 30px
            .app, .board
                height 20%
                .message
                    &::after
                        background-image url('../../assets/six_title_gray.png')
                        width: 130px
</style>