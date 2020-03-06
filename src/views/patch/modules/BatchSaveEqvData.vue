<template>
  <div>
    <template>
      <div>
        <a-row :gutter="16">
          <a-col :span="12">
            <p >
              <span style="">设备名称：</span>
              <span style="color: #1c4cff;font-size: large;margin-right: 5px;">{{result.equipment!=null?formatEqv(result.equipment.equipmentName):"无设备"}}</span>
            </p>
          </a-col>
          <a-col :span="12" >
            <p >
              <span style="">设备采集数据条数：</span>
              <span style="color: #1c4cff;font-size: large;margin-right: 5px;">{{result.count!=null?result.count:0}}</span>条
            </p>
          </a-col>
        </a-row>
        <a-form :form="form">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="平均温度"
              >
                <a-input-number
                  style="width:100%"
                  v-decorator="[
                    'temperatureAvg',
                    {
                      initialValue: record? record.temperatureAvg : null,
                      rules: [{
                        required: true, message: '请输入平均温度！',
                      }]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="平均湿度"
              >
                <a-input-number
                  style="width:100%"
                  v-decorator="[
                    'airHumidityAvg',
                    {
                      initialValue:record?record.temperatureAvg:null,
                      rules: [{
                        required: true, message: '请输入平均湿度!',
                      }]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="平均昼夜温差"
              >
                <a-input-number
                  style="width:100%"
                  v-decorator="[
                    'temperatureDiffAvg',
                    {
                      initialValue:record?record.temperatureDiffAvg:null,
                      rules: [{
                        required: true, message: '请输入平均昼夜温差!',
                      }]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="累计降水量"
              >
                <a-input-number
                  style="width:100%"
                  v-decorator="[
                    'rainfallTotal',
                    {
                      initialValue:record?record.rainfallTotal:null,
                      rules: [{
                        required: true, message: '请输入累计降水量!',
                      }]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="平均土壤湿度"
              >
                <a-input-number
                  style="width:100%"
                  v-decorator="[
                    'soilHumidityAvg',
                    {
                      initialValue:record?record.soilHumidityAvg:null,
                      rules: [{
                        required: true, message: '请输入平均土壤湿度!',
                      }]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="平均土壤PH值"
              >
                <a-input-number
                  style="width:100%"
                  v-decorator="[
                    'soilPhAvg',
                    {
                      initialValue:record?record.soilPhAvg:null,
                      rules: [{
                        required: true, message: '请输入平均土壤PH值',
                      }]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="土壤类型"
              >
                <a-select
                  mode='combobox'
                  v-decorator="[
                    'soilType',
                    {
                      initialValue:record?record.soilType:null,
                      rules: [{
                        required: true, message: '请输入或选择土壤类型且不超过10个字符', max: 10,
                      }]
                    }
                  ]"
                >
                  <a-select-option key="红壤类">红壤类</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="累计光照时长"
              >
                <a-input-number 
                  style="width:100%"
                  v-decorator="[
                    'illTimeTotal',
                    {
                      initialValue:record?record.illTimeTotal:null,
                      rules: [{
                        required: true, message: '请输入累计光照时长!',
                      }]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <a-button type="primary" @click="save">保存</a-button>
      </div>
    </template>
    <!-- <a-row :gutter="16">
      <a-col :span="18" >
        <p >
          备注：<span style="color: red">生长环境的数据“封存”后才会在溯源界面可见</span>
        </p>
      </a-col>
    </a-row> -->
    </div>
</template>
<script>
  import {addBatchEnvironment,getBatchEnvironment} from '@/api/allapi'

  export default {
    data () {
      return {
        form: this.$form.createForm(this),
        reportCount:0,
        record: {},
        result:{
          airHumidityAvg:null,
          airPressureAvg: null,
          co2ValueAvg: null,
          count: null,
          equipment: null,
          id: null,
          illIntensityAvg: null,
          illTimeAvg: null,
          pm25ValueAvg: null,
          rainfallTotal: null,
          soilHumidityAvg: null,
          soilPhAvg: null,
          soilTemperatureAvg: null,
          temperatureAvg: null,
          temperatureDiffAvg: null,
          windSpeedAvg: null,
        },
        data:[],
        batchId:null
      }
    },
    methods: {
      save() {
        this.form.validateFields(err => {
          if (!err) {
            let params = this.form.getFieldsValue()
            params.batchId = this.batchId
            addBatchEnvironment(params).then(res => {
              this.$message.info(res.message)
            })
          }
        })
      },
      loadData(batchId){
        this.batchId = batchId
        getBatchEnvironment({batchId:batchId}).then((res)=>{
          if(res.success==true){
            let result = res.result;
            if(result!=null) {
              this.result = result;
              this.record = result
              this.$store.commit('pro/SET_EQVDATA',result.count)
            }
          }
        })
      },
      formatEqv(str){
        if(str!=null){
          return str;
        }else{
          return "";
        }
      },
      formatData(num){
        if(num!=null){
          return num.toFixed(2)
        }else{
          return "暂无数据"
        }
      }
    }
  }
</script>
<style>

</style>
