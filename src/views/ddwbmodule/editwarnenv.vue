<template>
  <div>
    <a-modal
      title="编辑"
      v-model="visible"
      @ok="handleOk"
      cancelText="取消"
      okText="确定"
      :maskClosable="false"
      style="min-width:1000px;"
    >
    <div class="scroll" style="width:100%;height:500px;overflow-y:auto">
      <a-form
        :form="form"
      >
      <a-row :gutter="16">
          <a-col :span="12">
              <a-form-item
            v-bind="formItemLayout"
            label="设备名称"
          >
            <a-select
            mode="multiple"
              v-decorator="[
          'equipmentIdList',
          {
              initialValue:record.equipmentId,
            rules: [{ required: true, message: '请选择设备' }],
          }
        ]"
            >
              <a-select-option v-for="(v,k) in equname" :key="k" :value="v.id">{{v.equipmentName}}</a-select-option>
            </a-select>
          </a-form-item>
          </a-col>
          <a-col :span="12">
              <a-form-item
            v-bind="formItemLayout"
            label="最低大气温度值"
          >
          <a-input-number
          style="width:100%"
              v-decorator="[
          'minairtemperature',
          {
              initialValue:record.minairtemperature,
            rules: [{ required: false,  }],
          }
        ]"
            />
           
          </a-form-item>
          </a-col>
      </a-row>
      <a-row :gutter="16">
          <a-col :span="12">
              <a-form-item
            v-bind="formItemLayout"
            label="开始时间"
          >
            <a-date-picker 
                style="width:100%"
                v-decorator="[
                  'startTime',
                  {
                    initialValue:record.startTime ? moment(record.startTime, 'YYYY-MM-DD') : null,
                    rules: [{ required: true, message: '请选择开始时时间' }],
                  }
                ]"
            />
          </a-form-item>
          </a-col>
          <a-col :span="12">
              <a-form-item
            v-bind="formItemLayout"
            label="结束时间"
          >
            <a-date-picker 
                style="width:100%"
                v-decorator="[
                  'endTime',
                  {
                    initialValue:record.endTime ? moment(record.endTime, 'YYYY-MM-DD') : null,
                    rules: [{ required: true, message: '请选择结束时间' }],
                  }
                ]"
            />
          </a-form-item>
          </a-col>
          <a-col :span="2"></a-col>
      </a-row>
          <a-row :gutter="16">
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高大气温度值"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'maxairtemperature',
          {
              initialValue:record.maxairtemperature,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="12">
                   <a-form-item
            v-bind="formItemLayout"
            label="最低空气湿度值"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'minairhumidity',
          {
              initialValue:record.minairhumidity,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高空气湿度值"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'maxairhumidity',
          {
              initialValue:record.maxairhumidity,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低土壤温度值"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'minsoiltemperature',
          {
              initialValue:record.minsoiltemperature,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高土壤温度值"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'maxsoiltemperature',
          {
              initialValue:record.maxsoiltemperature,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低土壤湿度值"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'minsoilhumidity',
          {
              initialValue:record.minsoilhumidity,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高土壤湿度值"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'maxsoilhumidity',
          {
              initialValue:record.maxsoilhumidity,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低土壤PH值"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'minsoilph',
          {
              initialValue:record.minsoilph,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高土壤PH值"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'maxsoilph',
          {
              initialValue:record.maxsoilph,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低光照强度值"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'minillIntensity',
          {
              initialValue:record.minillIntensity,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高光照强度值"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'maxillIntensity',
          {
              initialValue:record.maxillIntensity,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高降雨量值"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'maxrainfall',
          {
              initialValue:record.maxrainfall,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低CO2浓度"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'minco2',
          {
              initialValue:record.minco2,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高CO2浓度"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'maxco2',
          {
              initialValue:record.maxco2,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低PM2.5浓度"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'minpm25',
          {
              initialValue:record.minpm25,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高PM2.5浓度"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'maxpm25',
          {
              initialValue:record.maxpm25,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低PM10浓度"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'minpm10',
          {
              initialValue:record.minpm10,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高PM10浓度"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'maxpm10',
          {
              initialValue:record.maxpm10,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最大风速"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'maxwindspeed',
          {
              initialValue:record.maxwindspeed,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低土壤EC值"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'minsoilec',
          {
              initialValue:record.minsoilec,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高土壤EC值"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'maxsoilec',
          {
              initialValue:record.maxsoilec,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="12">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低土壤盐分"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'minsoils',
          {
              initialValue:record.minsoils,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="12"><a-form-item
            v-bind="formItemLayout"
            label="最高土壤盐分"
          >
            <a-input-number
          style="width:100%"
              v-decorator="[
          'maxsoils',
          {
              initialValue:record.maxsoils,
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item></a-col>
              <a-col :span="12"></a-col>
          </a-row> 
  
      </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
  import moment from 'moment'
  import { updateWarnEnv,getEquipmentIdAndNameList } from '@/api/ddwbApi'
  export default {
    data() {
      return {
        visible: false,
        equname:[],
        record:{},
        form: this.$form.createForm(this),
        formItemLayout: {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        },
      }
    },
    created(){
        getEquipmentIdAndNameList().then(res=>{
            if(res.success){
                this.equname=res.result;
            }
        })
    },
    methods: {
      moment,
      edit(record){
        this.form.resetFields();
        this.record=record;     
        this.visible=true;
      },
      handleOk(){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=values;
              userinfo.id=this.record.id;
              let elist=[];
              for(let i=0;i<values.equipmentIdList.length;i++){
                elist.push({equipmentId:values.equipmentIdList[i]});
              }
              userinfo.startTime = this.moment(userinfo.startTime).format('YYYY-MM-DD')
              userinfo.endTime = this.moment(userinfo.endTime).format('YYYY-MM-DD')
              userinfo.equipmentIdList=elist;
              updateWarnEnv(userinfo).then((res=>{
                if(res.success==true){
                  this.$message.success(res.message)
                  this.$parent.loadData()
                  this.visible=false;
                }else{
                  this.$message.warning(res.message);
                }
              }))
            }
          }); 
      },
    }
  }

</script>
<style lang='stylus' scoped>
    .scroll::-webkit-scrollbar
        width 0px
        height 0px
    .scroll::-webkit-scrollbar-thumb
        border-radius 10px
        -webkit-box-shadow inset 0 0 5px rgba(0,0,0,1)
        background #535353
    .scroll::-webkit-scrollbar-track
        -webkit-box-shadow inset 0 0 5px rgba(0,0,0,0.2)
        border-radius 10px
        background #EDEDED
</style>