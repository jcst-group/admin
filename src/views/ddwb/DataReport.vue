<template>
  <div class="main">
    <div class="button">
      <a-button class="btn" type="primary" icon="reload" @click="review">重置</a-button>
      <a-button class="btn" type="primary" icon="search" @click="search">查询</a-button>
    </div>
    <div class="input">
      <!--<span class="title">基地：</span>
      <a-select v-model="baseId" class="inp">
        <a-select-option v-for="(v,k) in baseinfo" :value="v.id" :key="k">{{v.baseName}}</a-select-option>
      </a-select>-->
      <span class="title">设备：</span>
      <a-select v-model="equipmentId" class="inp" @change="changeName">
        <a-select-option v-for="(v,k) in equipmentinfo" :value="v.id" :key="k">{{v.equipmentName}}</a-select-option>
      </a-select>
      <span class="title">时间：</span>
      <a-date-picker
        :disabledDate="disabledStartDate"
        format="YYYY-MM-DD"
        v-model="startValue"
        :open="startOpen"
        @change="changestarttime"
        @openChange="handleStartOpenChange"
      />
      <span style="line-height:40px;margin:0 20px;">至</span>
      <a-date-picker
        :disabledDate="disabledEndDate"
        format="YYYY-MM-DD"
        v-model="endValue"
        :open="endOpen"
        @change="changeendtime"
        @openChange="handleEndOpenChange"
      />
    </div>
    <a-tabs defaultActiveKey="1" @change="switcher">
      <a-tab-pane tab="图表" key="1">
        <a-checkbox-group :options="plainOptions" v-model="valueOptions" @change="checkboxChange"/>
        <div v-if="isShowEea" style="width: 100%;height: 659px;margin: 25px 0px 15px 0px"
             ref="echarsData" id="echars"></div>
      </a-tab-pane>
      <a-tab-pane tab="表格" key="2" forceRender>
        <div class="scroll" id="tables">
          <div style="min-width:2500px;" v-if="!isShowEea">
            <a-table :columns="columns"
                     :dataSource="dataSource"
                     :pagination="ipagination"
                     @change="handleTableChange"
                     :rowKey="record => record.id"
                     :loading="loading"
                     bordered
            >
            <!-- <span slot="monitorTime" slot-scope="text">
              {{gettime(text)}}
            </span> -->
              <span slot="action" slot-scope="text, record">
              <a-popconfirm title="是否删除该基地?" @confirm="del(record.id)" okText="确定" cancelText="取消">
                  <a href="javascript:;">删除</a>
              </a-popconfirm>
            </span>
            </a-table>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
  import {getEnvmonitorList, delEnvmonitor, getEnvChart, getALLBaseList, getEquipmentIdAndNameList} from '@/api/ddwbApi'
  import moment from 'moment';
  import echarts from 'echarts'
  const columns = [
    {
      title: '基地名称',
      dataIndex: 'equipment.baseName',
      align: "center"
    },
    {
      title: '设备名称',
      dataIndex: 'equipment.equipmentName',
      align: "center"
    },
    {
      title: '采集时间',
      dataIndex: 'monitorTime',
      // scopedSlots: {customRender: 'monitorTime'},
      align: "center"
    }, {
      title: '大气温度值(℃)',
      dataIndex: 'airTemperature',
      align: "center"
    }, {
      title: '大气压(kpa)',
      dataIndex: 'airPressure',
      align: "center"
    }, {
      title: '空气湿度值(%)',
      dataIndex: 'airHumidity',
      align: "center"
    }, {
      title: '土壤温度值(℃)',
      dataIndex: 'soilTemperature',
      align: "center"
    }, {
      title: '土壤湿度值(%)',
      dataIndex: 'soilHumidity',
      align: "center"
    }, {
      title: '土壤PH值',
      dataIndex: 'soilPh',
      align: "center"
    }, {
      title: '降雨量值(mm)',
      dataIndex: 'rainfall',
      align: "center"
    }, {
      title: '风速(m/s)',
      dataIndex: 'windSpeed',
      align: "center"
    }, {
      title: '风向(度)',
      dataIndex: 'windDirection',
      align: "center"
    }
    // , {
    //   title: '操作',
    //   dataIndex: 'action',
    //   scopedSlots: {customRender: 'action'},
    //   align: "center",
    // }
  ]
  export default {
    data() {
      return {
        startOpen:false,
        startValue: null,
        endValue: null,
        endOpen: false,
        equipmentNames:'',
        firstEnvCha:false,
        leftRight:'',
        islength:false,
        save05: '',
        save04: false,
        indexNum: 0,
        save03: false,
        isreve: false,
        valuesaveOptions01: [],
        valuesaveOptions02: [],
        valuesaveOptions03: [],
        oneis: false,
        save01: '',
        save02: '',
        indexs: 0,
        echartsSavNum: '',
        ismyValue: '',
        valueSave: '',
        echarChaValue: "",
        echarChaName: "",
        echarChaData: [],
        echarChaColor: [],
        echartsIndexNum: "1",
        echoptions: {},
        echillIntensity: [],
        echPressure: [],
        echCo2: [],
        echpm10: [],
        echSoilTemperature: [],
        echSoilHumidity: [],
        echSoilEc: [],
        echSoilS: [],
        echSoilPh: [],
        echrainfall: [],
        echwindSpeed: [],
        echpm25: [],
        echartsData01: [],
        echartsData02: [],
        valuesaveOptions: ['大气温度', '大气湿度'],
        plainOptions: ['大气温度', '大气湿度', '大气压力', '风速', '雨量', '土壤温度', '土壤湿度', '土壤PH值'],
        valueOptions: ['大气温度', '大气湿度'],
        echMonitorTime: [],
        echAirHumidity: [],
        echAirTemperature: [],
        chart: '',
        isShowEea: true,
        baseId: '',
        equipmentId: '',
        startTime: '',
        endTime: '',
        baseinfo: [],
        equipmentinfo: [],
        par: {},
        loading: false,
        dataSource: [],
        columns,
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + '共' + total + '条';
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        isfristsave:0,
      }
    },

    created() {
      getALLBaseList().then(res => {
        if (res.success) {
          this.baseinfo = res.result;
          this.baseinfo.unshift({id: -1, baseName: '全部'});
        }
      })
      getEquipmentIdAndNameList().then(res => {
        if (res.success) {
          this.equipmentinfo = res.result;
          var yesterday = this.yesterday();
          var timenow = this.timenow();
          let params = {
            equipmentId: this.equipmentinfo[0].id,
            startTime: yesterday,
            endTime: timenow
          }
          this.equipmentId=this.equipmentinfo[0].id;
          this.startValue=moment(yesterday, 'YYYY-MM-DD')
          this.endValue=moment(timenow, 'YYYY-MM-DD')
          this.equipmentNames= this.equipmentinfo[0].equipmentName;
          getEnvChart(params).then(res => {
            this.firstEnvCha=true;
            if (res.success) {
              const that = this;
              this.echMonitorTime = res.result.monitorTime;
              this.echAirHumidity = res.result.airHumidity;
              this.echAirTemperature = res.result.airTemperature;
              this.echPressure = res.result.airPressure;
              this.echillIntensity = res.result.illIntensity;
              this.echrainfall = res.result.rainfall;
              this.echwindSpeed = res.result.windSpeed;
              this.echpm25 = res.result.pm25;
              this.echCo2 = res.result.co2;
              this.echpm10 = res.result.pm10;
              this.echSoilTemperature = res.result.soilTemperature;
              this.echSoilHumidity = res.result.soilHumidity;
              this.echSoilEc = res.result.soilEc;
              this.echSoilS = res.result.soilS;
              this.echSoilPh = res.result.soilPh;
              this.echartsData01 = this.echAirTemperature;
              this.echartsData02 = this.echAirHumidity;
              setTimeout(function () {
                that.lineCre();
              }, 100);
            }
          })
          this.equipmentinfo.unshift({id: -1, equipmentName: '全部'})
        }
      })
      this.loadData();
    },
    mounted() {
      this.init();
    },
    methods: {
      moment,
      disabledStartDate (startValue) {
        const endValue = this.endValue;
        if (!startValue || !endValue) {
          return false;
        }
        return startValue.valueOf() > endValue.valueOf();
      },
      disabledEndDate (endValue) {
        const startValue = this.startValue;
        if (!endValue || !startValue) {
          return false;
        }
        return startValue.valueOf() >= endValue.valueOf();
      },
      handleStartOpenChange (open) {
        this.startOpen = open;
        if (!open) {
          this.endOpen = true;
        }
      },
      handleEndOpenChange (open) {
        this.endOpen = open;
        if (!open&&!this.startValue) {
          this.startOpen = true;
        }
      },
      changeName(value){
        if(value!=-1){
          for(let index in this.equipmentinfo){
            if(value==this.equipmentinfo[index].id){
                this.equipmentNames = this.equipmentinfo[index].equipmentName;
            }
          }
        }
      },
      checkboxChange(checkedValues) {
        let thats =this;
        this.save02 = false;
        if (checkedValues.length == 0) {
          this.$message.warning("指标至少选择一项！");
          this.valueOptions = this.valuesaveOptions
          return;
        } else {
          this.valueOptions = checkedValues;
        }
        var islength2 = true;
        this.ismyValue = this.valueOptions[this.valueOptions.length - 1] == this.valueSave;
        if (this.valueOptions.length > 2) {
          if (this.valueOptions.length > 1) {
            this.valueOptions.shift();
          }
        }
        if (this.echartsSavNum) {
          this.echartsIndexNum = this.echartsSavNum;
        }
        var savelength = this.valuesaveOptions.length;
        if(checkedValues.length=="3"){
          checkedValues=checkedValues.shift();
        }
        this.echoptions.legend.data = checkedValues;
        switch (this.valueOptions[this.valueOptions.length - 1]) {
          case '大气温度':
            this.echarChaName = "大气温度";
            this.echarChaData = this.echAirTemperature;
            this.echarChaValue = "°C"
            this.echarChaColor = ["#55A1EF", "#A1CBF6", "#ffffff"];
            break;
          case  '大气湿度':
            this.echarChaName = "大气湿度";
            this.echarChaData = this.echAirHumidity;
            this.echarChaValue = "%"
            this.echarChaColor = ["#55EF98", "#6FF6AA", "#ffffff"];
            break;
          case  '大气压力':
            this.echarChaName = "大气压力";
            this.echarChaData = this.echPressure;
            this.echarChaValue = "kpa"
            this.echarChaColor = ["#AD55EF", "#C07FF1", "#ffffff"];
            break;
          case '风速':
            this.echarChaName = "风速";
            this.echarChaData = this.echwindSpeed;
            this.echarChaValue = "m/s"
            this.echarChaColor = ["#EFD555", "#FFEB8A", "#ffffff"];
            break;
          case '光照强度':
            this.echarChaName = "光照强度";
            this.echarChaData = this.echillIntensity;
            this.echarChaValue = "Lux"
            this.echarChaColor = ["#7855EF", "#AE97FF", "#ffffff"];
            break;
          case '雨量':
            this.echarChaName = "雨量";
            this.echarChaData = this.echrainfall;
            this.echarChaValue = "mm"
            this.echarChaColor = ["#BCEF55", "#D3F68B", "#ffffff"];
            break;
          case '二氧化碳浓度':
            this.echarChaName = "二氧化碳浓度";
            this.echarChaData = this.echCo2;
            this.echarChaValue = "ppm"
            this.echarChaColor = ["#EF55E5", "#FCAAF7", "#ffffff"];
            break;
          case 'PM2.5浓度':
            this.echarChaName = "PM2.5浓度";
            this.echarChaData = this.echpm25;
            this.echarChaValue = "ug/m3"
            this.echarChaColor = ["#CC55EF", "#DF90F6", "#ffffff"];
            break;
          case 'PM10浓度':
            this.echarChaName = "PM10浓度";
            this.echarChaData = this.echpm10;
            this.echarChaValue = "ug/m3"
            this.echarChaColor = ["#5598EF", "#ABCAF2", "#ffffff"];
            break;
          case '土壤温度':
            this.echarChaName = "土壤温度";
            this.echarChaData = this.echSoilTemperature;
            this.echarChaValue = "°C"
            this.echarChaColor = ["#EF6F55", "#F89884", "#ffffff"];
            break;
          case '土壤湿度':
            this.echarChaName = "土壤湿度";
            this.echarChaData = this.echSoilHumidity;
            this.echarChaValue = "%"
            this.echarChaColor = ["#EF55D0", "#F883E0", "#ffffff"];
            break;
          case '土壤PH值':
            this.echarChaName = "土壤PH值";
            this.echarChaData = this.echSoilPh;
            this.echarChaValue = " "
            this.echarChaColor = ["#DB4141", "#F99393", "#ffffff"];
            break;
          case '土壤EC':
            this.echarChaName = "土壤EC";
            this.echarChaData = this.echSoilEc;
            this.echarChaValue = "uS/cm"
            this.echarChaColor = ["#7CE6B4", "#8BEFC0", "#ffffff"];
            break;
          case '土壤盐分':
            this.echarChaName = "土壤盐分";
            this.echarChaData = this.echSoilS;
            this.echarChaValue = "ppm"
            this.echarChaColor = ["#418EDB", "#82BFFC", "#ffffff"];
            break;
        }
        var indexnum = this.echoptions.series[0].yAxisIndex;
        if(this.valueOptions.length=="1"){
          this.islength=true;
          console.log(this.valueOptions)
          console.log(this.valuesaveOptions)
          console.log(this.echoptions.series)
          if(this.valueOptions[0]==this.valuesaveOptions[1]){
            var index = this.echoptions.series[0].yAxisIndex
            this.echoptions.series.splice(0,1);
            this.leftRight = index;
          }else{
            var index = this.echoptions.series[1].yAxisIndex
            this.echoptions.series.splice(1,1);
            this.leftRight = index;
          }
          this.echoptions.tooltip={
            trigger: 'axis',
              formatter: function (params) {
              return params[0].name + "<br>" + params[0].marker + params[0].seriesName + ":" + params[0].data + thats.getval(params[0].seriesName) + "<br>" ;
            },
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#red'
              }
            }
          }
        }else if(this.islength){
             this.islength=false;
             console.log(this.leftRight)
            if(this.leftRight=="0"){
              var numbe ="0";
              if(this.echoptions.series[0].yAxisIndex=="1"){
                numbe="0"
              }else{
                numbe="1"
              }
              this.echoptions.yAxis[0] ={
                type: 'value',
                axisLabel: {
                  show: true,
                  interval: 'auto',
                  formatter: '{value}'+this.echarChaValue
                },
                axisTick: {
                  show: false
                },
                splitLine: {
                  show: false
                },
                splitArea: {
                  show: false
                }
              },
                this.echoptions.series.unshift({
                  name: this.echarChaName,
                  type: 'line',
                  showAllSymbol: true, //动画效果
                  smooth: true, //光滑的曲线
                  showSymbol: false,
                  yAxisIndex: numbe,
                  data: this.echarChaData,
                  lineStyle: {
                    color: this.echarChaColor[0], //改变折线颜色
                    normal: {areaStyle: {color: this.echarChaColor[1]}}
                  },
                  itemStyle: {
                    normal: {
                      color: this.echarChaColor[0]
                    }
                  },
                  areaStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                        [
                          {
                            offset: 0, color: this.echarChaColor[0] // 0% 处的颜色
                          }, {
                          offset: 0.5, color: this.echarChaColor[1] // 100% 处的颜色
                        }, {
                          offset: 1, color: this.echarChaColor[2] // 100% 处的颜色
                        }])
                    }
                  },
                })
            }else{
              var numbes ="1";
              if(this.echoptions.series[0].yAxisIndex=="1"){
                numbes="0"
              }else{
                numbes="1"
              }
              this.echoptions.yAxis[1] ={
                type: 'value',
                axisLabel: {
                  show: true,
                  interval: 'auto',
                  formatter: '{value}'+this.echarChaValue
                },
                axisTick: {
                  show: false
                },
                splitLine: {
                  show: false
                },
                splitArea: {
                  show: false
                }
              },
              this.echoptions.series[1] = ({
                name: this.echarChaName,
                type: 'line',
                showAllSymbol: true, //动画效果
                smooth: true, //光滑的曲线
                showSymbol: false,
                yAxisIndex: numbes,
                data: this.echarChaData,
                lineStyle: {
                  color: this.echarChaColor[0], //改变折线颜色
                  normal: {areaStyle: {color: this.echarChaColor[1]}}
                },
                itemStyle: {
                  normal: {
                    color: this.echarChaColor[0]
                  }
                },
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                      [
                        {
                          offset: 0, color: this.echarChaColor[0] // 0% 处的颜色
                        }, {
                        offset: 0.5, color: this.echarChaColor[1] // 100% 处的颜色
                      }, {
                        offset: 1, color: this.echarChaColor[2] // 100% 处的颜色
                      }])
                  }
                },
              })
            }
            this.echoptions.tooltip={
              trigger: 'axis',
                formatter: function (params) {
                return params[0].name + "<br>" + params[0].marker + params[0].seriesName + ":" + params[0].data + thats.getval(params[0].seriesName) + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + thats.getval(params[1].seriesName);
              },
              axisPointer: {
                type: 'cross',
                  label: {
                  backgroundColor: '#red'
                }
              }
            }
        }else{
          this.islength=false;
          this.echoptions.series.shift();
          this.echoptions.yAxis[indexnum] ={
            type: 'value',
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: '{value}'+this.echarChaValue
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            splitArea: {
              show: false
            }
          },
          this.echoptions.series[1] = ({
            name: this.echarChaName,
            type: 'line',
            showAllSymbol: true, //动画效果
            smooth: true, //光滑的曲线
            showSymbol: false,
            yAxisIndex: indexnum,
            data: this.echarChaData,
            lineStyle: {
              color: this.echarChaColor[0], //改变折线颜色
              normal: {areaStyle: {color: this.echarChaColor[1]}}
            },
            itemStyle: {
              normal: {
                color: this.echarChaColor[0]
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                  [
                    {
                      offset: 0, color: this.echarChaColor[0] // 0% 处的颜色
                    }, {
                    offset: 0.5, color: this.echarChaColor[1] // 100% 处的颜色
                  }, {
                    offset: 1, color: this.echarChaColor[2] // 100% 处的颜色
                  }])
              }
            },
          })
        }
        if(this.leftRight=="0"){
          this.valueOptions = this.valueOptions.reverse();
        }
        this.valueOptions =  [];
        let echname = this.echoptions.series[0].name;
        let echunit = this.getval(echname);
        let echnames = '';
        let echunits = '';
        if(this.echoptions.series[1]){
          echnames = this.echoptions.series[1].name;
          echunits = this.getval(echnames);
          if((this.echoptions.yAxis[this.echoptions.series[0].yAxisIndex].axisLabel.formatter).indexOf(echunit)==-1||(this.echoptions.yAxis[this.echoptions.series[1].yAxisIndex].axisLabel.formatter).indexOf(echunits)==-1){
            this.echoptions.yAxis[this.echoptions.series[0].yAxisIndex].axisLabel.formatter = "{value}" + echunit
            this.echoptions.yAxis[this.echoptions.series[1].yAxisIndex].axisLabel.formatter = "{value}" + echunits
          }
        }
        if((this.echoptions.yAxis[this.echoptions.series[0].yAxisIndex].axisLabel.formatter).indexOf(echunit)!=-1){
          this.echoptions.yAxis[this.echoptions.series[0].yAxisIndex].axisLabel.formatter = "{value}" + echunit
        }
        this.valueOptions.push(this.echoptions.series[0].name);
        if(this.echoptions.series[1]!=null){
          this.valueOptions.push(this.echoptions.series[1].name);
        }
        this.valuesaveOptions = this.valueOptions;
        this.chart.showLoading();
        setTimeout(()=>{
          this.chart.setOption(this.echoptions, true);
          this.chart.hideLoading();
        },500)
      },
      getArrDifference(arr1, arr2) {
        return arr1.concat(arr2).filter(function (v, i, arr) {
          return arr.indexOf(v) === arr.lastIndexOf(v);
        });
      },
      timenow() {
        var timenow = new Date();
        var y = timenow.getFullYear();//年
        var m = timenow.getMonth() + 1;//月
        m = m < 10 ? '0' + m : m;
        var d = timenow.getDate();//日
        d = d < 10 ? ('0' + d) : d;
        var time = y + '/' + m + '/' + d;//字符串拼接成自己想要的时间格式，现在是yyyy/mm/dd格式
        return time;
      },
      yesterday() {
        var timenow = new Date();
        timenow.setDate(timenow.getDate() - 1); //设置天数 -1 天，昨天的日期
        var y = timenow.getFullYear();//年
        var m = timenow.getMonth() + 1;//月
        m = m < 10 ? '0' + m : m;
        var d = timenow.getDate();//日
        d = d < 10 ? ('0' + d) : d;
        var yesterdayTime = y + '/' + m + '/' + d;//字符串拼接成自己想要的时间格式，现在是yyyy/mm/dd格式
        return yesterdayTime;
      },
      switcher(key) {
        const that = this;
        if (key == 1) {
          this.isShowEea = true;
          setTimeout(function () {
            that.lineCre();
          }, 100);
        } else {
          this.isShowEea = false;
        }
      },
      gettime(text) {
        return text.split(' ')[0];
      },
      changestarttime(date, dateString) {
        let time = dateString.split('-');
        this.startTime = time.join('/');
      },
      changeendtime(date, dateString) {
        let time = dateString.split('-');
        this.endTime = time.join('/');
      },
      handleTableChange(pagination) {
        this.ipagination = pagination;
        this.loadData();
      },
      getQueryParams() {
        let param = Object.assign({}, this.par);
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return param;
      },
      loadData() {
        this.loading = true;
        let params = this.getQueryParams();//查询条件
        getEnvmonitorList(params)
          .then((res) => {
            if (res.success) {
              this.dataSource = res.result.list;
              this.ipagination.total = res.result.total;
              this.loading = false;
            }
          });
        if(this.firstEnvCha){
          var paramsAll = params;
          if(params.startTime==undefined&&params.endTime==undefined){
            paramsAll['startTime'] = this.yesterday();
            paramsAll['endTime'] = this.timenow();
          }
          if(paramsAll.equipmentId!=undefined){
            getEnvChart(paramsAll).then(res => {
              if (res.success) {
                this.valueOptions=['大气温度', '大气湿度']
                const that = this;
                this.echMonitorTime = res.result.monitorTime;
                this.echAirHumidity = res.result.airHumidity;
                this.echAirTemperature = res.result.airTemperature;
                this.echPressure = res.result.airPressure;
                this.echillIntensity = res.result.illIntensity;
                this.echrainfall = res.result.rainfall;
                this.echwindSpeed = res.result.windSpeed;
                this.echpm25 = res.result.pm25;
                this.echCo2 = res.result.co2;
                this.echpm10 = res.result.pm10;
                this.echSoilTemperature = res.result.soilTemperature;
                this.echSoilHumidity = res.result.soilHumidity;
                this.echSoilEc = res.result.soilEc;
                this.echSoilS = res.result.soilS;
                this.echSoilPh = res.result.soilPh;
                this.echartsData01 = this.echAirTemperature;
                this.echartsData02 = this.echAirHumidity;
                setTimeout(function () {
                  that.lineCre();
                }, 100);
              }
            })
          }
        }
      },
      review() {
        this.baseId = '';
        this.equipmentId = '',
        this.startTime = '',
        this.endTime = '';
        this.par = {};
        this.startValue=''
        this.endValue=''
        this.loadData();
      },
      search() {
        this.par = {};
        if (this.baseId && this.baseId != -1) {
          this.par.baseId = this.baseId;
        }
        if (this.equipmentId && this.equipmentId != -1) {
          this.par.equipmentId = this.equipmentId;
        }
        if (this.startTime) {
          this.par.startTime = this.startTime;
        }
        if (this.endTime) {
          this.par.endTime = this.endTime;
        }
        if(this.isShowEea&&this.par.equipmentId==undefined){
          this.$message.warning("图表模式下请选择具体设备！");
          return;
        }
        this.loadData();
      },
      del(id) {
        delEnvmonitor({id: id}).then(res => {
          if (res.success) {
            this.$message.success(res.message);
            this.loadData();
          } else {
            this.$message.warning(res.message);
          }
        })
      },
      init() {
        const self = this;//因为箭头函数会改变this指向，指向windows。所以先把this保存
        setTimeout(() => {
          window.onresize = function () {
            self.chart.resize();
          }
        }, 20)
      },
      getval(name) {
        if (name == "大气温度" || name == "土壤温度") {
          return "°C";
        } else if (name == "大气湿度" || name == "土壤湿度") {
          return "%";
        } else if (name == "大气压力") {
          return "kpa";
        } else if (name == "风速") {
          return "m/s";
        } else if (name == "雨量") {
          return "mm";
        } else if (name == "光照强度") {
          return "Lux";
        } else if (name == "二氧化碳浓度" || name == "土壤盐分") {
          return "ppm";
        } else if (name == "PM2.5浓度" || name == "PM10浓度") {
          return "ug/m3";
        } else if (name == "土壤PH值") {
          return " ";
        } else if (name == "土壤EC") {
          return "uS/cm";
        }
      },
      lineCre() {
        let thats = this;
        this.echoptions = {
          title: {
            text: '环境数据',
            x: 'center',
            subtext:this.equipmentNames,
            subtextStyle: {
              color: 'black' , // 副标题文字颜色
              fontSize: 13
            },
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              return params[0].name + "<br>" + params[0].marker + params[0].seriesName + ":" + params[0].data + thats.getval(params[0].seriesName) + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + thats.getval(params[1].seriesName);
            },
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#red'
              }
            }
          },
          legend: {
            icon: "circle",
            data: ['大气温度', '大气湿度'],
            x: "right"
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              handleSize: 13,//滑动条的 左右2个滑动条的大小
              height: 8,//组件高度
              left: 150, //左边的距离
              right: 150,//右边的距离
              bottom: 30,//右边的距离
              handleColor: '#1eb5e5',//h滑动图标的颜色
              handleStyle: {
                borderColor: "white",
                borderWidth: "4",
                shadowBlur: 2,
                background: "#ddd",
                shadowColor: "#1eb5e5",
              },
              fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                //给第一个设置0，第四个设置1，就是垂直渐变
                offset: 0,
                color: '#1eb5e5'
              }, {
                offset: 1,
                color: '#1eb5e5'
              }]),
              backgroundColor: '#ddd',//两边未选中的滑动条区域的颜色
              showDataShadow: false,//是否显示数据阴影 默认auto
              handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
              filterMode: 'filter',
            },
            // {
            //   type: 'inside',
            //   realtime: true,
            //   start: 0,
            //   end: 100
            // }
          ],
          grid: {
            left: '3%',
            right: '4%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              },
              axisLine: {       //y轴
                show: false
              },
              boundaryGap: false,
              data: this.echMonitorTime
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                show: true,
                interval: 'auto',
                formatter: '{value}°C'
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              },
              splitArea: {
                show: false
              }
            },
            {
              type: 'value',
              axisLabel: {
                show: true,
                interval: 'auto',
                formatter: '{value}%'
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              },
              splitArea: {
                show: false
              }
            }
          ],
          series: [
            {
              name: '大气温度',
              type: 'line',
              smooth: true,
              stack: '总量',
              showAllSymbol: true, //动画效果
              showSymbol: false,
              yAxisIndex: 0,
              data: this.echartsData01,
              lineStyle: {
                color: '#55A1EF' //改变折线颜色
              },
              itemStyle: {
                normal: {
                  color: '#55A1EF'
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                    [
                      {
                        offset: 0, color: '#55A1EF' // 0% 处的颜色
                      }, {
                      offset: 0.5, color: '#A1CBF6' // 100% 处的颜色
                    }, {
                      offset: 1, color: '#FFFFFF' // 100% 处的颜色
                    }])
                }
              },
            },
            {
              name: '大气湿度',
              type: 'line',
              showAllSymbol: true, //动画效果
              smooth: true, //光滑的曲线
              showSymbol: false,
              yAxisIndex: '1',
              data: this.echartsData02,
              lineStyle: {
                color: '#55EF98' //改变折线颜色
              },
              itemStyle: {
                normal: {
                  color: '#55EF98'
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                    [
                      {
                        offset: 0, color: '#55EF98' // 0% 处的颜色
                      }, {
                      offset: 0.5, color: '#6FF6AA' // 100% 处的颜色
                    }, {
                      offset: 1, color: '#ffffff' // 100% 处的颜色
                    }])
                }
              },
            },
          ]
        }
        this.chart = echarts.init(this.$refs.echarsData);
        this.chart.showLoading();
        setTimeout(()=>{
          this.chart.setOption(this.echoptions, true);
          this.chart.hideLoading();
        },1000)
      }
    },
  }
</script>
<style scoped>
  .main >>> .ant-divider {
    margin: 5px 0;
  }

</style>
<style lang='stylus' scoped>
  .btn
    float right
    background #2c909c
    border-color #2c909c
    color #fff
    line-height 18px
    margin-right 10px

  .title
    margin-right 5px
    line-height 32px

  .inp
    width 10%
    margin-right 10px

  .btable
    margin-top 10px
    width 100%

  .scroll
    width 100%
    margin-bottom 15px
    margin-top 20px
    overflow-x auto

  .scroll::-webkit-scrollbar
    width 0px
    height 5px

  .scroll::-webkit-scrollbar-thumb
    border-radius 10px
    -webkit-box-shadow inset 0 0 5px rgba(0, 0, 0, 1)
    background #535353

  .scroll::-webkit-scrollbar-track
    -webkit-box-shadow inset 0 0 5px rgba(0, 0, 0, 0.2)
    border-radius 10px
    background #EDEDED
</style>
