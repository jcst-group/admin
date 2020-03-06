<template>
  <div>
    <a-modal
      title="新增"
      v-model="visible"
      @ok="handleOk"
      cancelText="取消"
      okText="确定"
      :maskClosable="false"
      style="min-width:1200px;"
    >
    <div class="scroll" style="width:100%;height:500px;overflow-y:auto">
      <a-form
        :form="form"
      >
      <a-row :gutter="16">
          <a-col :span="11">
              <a-form-item
            v-bind="formItemLayout"
            label="设备名称"
          >
            <a-select
              mode="multiple"
              v-decorator="[
          'equipmentIdList',
          {
            rules: [{ required: true, message: '请选择设备' }],
          }
        ]"
            >
              <a-select-option v-for="(v,k) in equname" :key="k" :value="v.id">{{v.equipmentName}}</a-select-option>
            </a-select>
          </a-form-item>
          </a-col>
          <a-col :span="11">
              <a-form-item
            v-bind="formItemLayout"
            label="最低大气温度值"
          >
          <a-input-number
          style="width:100%"
              v-decorator="[
          'minairtemperature',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
           
          </a-form-item>
          </a-col>
          <a-col :span="2"></a-col>
      </a-row>
      <a-row :gutter="16">
          <a-col :span="11">
              <a-form-item
            v-bind="formItemLayout"
            label="开始时间"
          >
            <a-date-picker 
                style="width:100%"
                v-decorator="[
                  'startTime',
                  {
                    rules: [{ required: true, message: '请选择开始时时间' }],
                  }
                ]"
            />
          </a-form-item>
          </a-col>
          <a-col :span="11">
              <a-form-item
            v-bind="formItemLayout"
            label="结束时间"
          >
            <a-date-picker 
                style="width:100%"
                v-decorator="[
                  'endTime',
                  {
                    rules: [{ required: true, message: '请选择结束时间' }],
                  }
                ]"
            />
          </a-form-item>
          </a-col>
          <a-col :span="2"></a-col>
      </a-row>
          <a-row :gutter="16">
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高大气温度值"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'maxairtemperature',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="11">
                   <a-form-item
            v-bind="formItemLayout"
            label="最低空气湿度值"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'minairhumidity',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="2"></a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高空气湿度值"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'maxairhumidity',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低土壤温度值"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'minsoiltemperature',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="2"></a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高土壤温度值"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'maxsoiltemperature',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低土壤湿度值"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'minsoilhumidity',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="2"></a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高土壤湿度值"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'maxsoilhumidity',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低土壤PH值"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'minsoilph',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="2"></a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高土壤PH值"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'maxsoilph',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低光照强度值"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'minillIntensity',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="2"></a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高光照强度值"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'maxillIntensity',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高降雨量值"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'maxrainfall',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="2"></a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低CO2浓度"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'minco2',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高CO2浓度"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'maxco2',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="2"></a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低PM2.5浓度"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'minpm25',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高PM2.5浓度"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'maxpm25',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="2"></a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低PM10浓度"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'minpm10',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高PM10浓度"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'maxpm10',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="2"></a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最大风速"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'maxwindspeed',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低土壤EC值"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'minsoilec',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="2"></a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高土壤EC值"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'maxsoilec',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最低土壤盐分"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'minsoils',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item>
              </a-col>
              <a-col :span="2"></a-col>
          </a-row>
          <a-row :gutter="16">
              <a-col :span="11">
                  <a-form-item
            v-bind="formItemLayout"
            label="最高土壤盐分"
          >
            <a-input-number
            style="width:100%"
              v-decorator="[
          'maxsoils',
          {
            rules: [{ required: false,  }],
          }
        ]"
            />
          </a-form-item></a-col>
              <a-col :span="11"></a-col>
              <a-col :span="2"></a-col>
          </a-row>    
      </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
  import moment from 'moment'
  import { addWarnEnv,getEquipmentIdAndNameList } from '@/api/ddwbApi'
  export default {
    data() {
      return {
        visible: false,
        equname:[],
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
      add(){
        this.form.resetFields();     
        this.visible=true;
      },
      handleOk(){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=values;
              let elist=[];
              for(let i=0;i<values.equipmentIdList.length;i++){
                elist.push({equipmentId:values.equipmentIdList[i]});
              }
              userinfo.startTime = this.moment(userinfo.startTime).format('YYYY-MM-DD')
              userinfo.endTime = this.moment(userinfo.endTime).format('YYYY-MM-DD')
              userinfo.equipmentIdList=elist;
              addWarnEnv(userinfo).then((res=>{
                if(res.success==true){
                  this.$message.success(res.message)
                  this.$parent.loadData()
                  this.visible=false;
                }else{
                  // this.$message.warning('设备已经存在，不能重复添加！');
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