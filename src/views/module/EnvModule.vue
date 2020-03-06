 <template>
  <div>
    <a-modal
      :title="title"
      v-model="visible"
      @ok="handleOk"
      style="top:5%;height: 90%;"
      cancelText="取消"
      :okText="okText"
      width="630px"
      :maskClosable="false"
    >
      <a-form
        :form="form"
      >
        <div class="LayoutDiv">
          <a-form-item
            v-bind="formItemLayout"
            label="空气温度"
            flex="1"
            style="width: 250px"
          >
            <a-input
              v-decorator="[
          'airTemperature',
          {
            initialValue:record.airTemperature,
            rules: [{ required: true, message: '请输入空气温度' }],
          }
        ]"
          v-if="isedit"
      />
      <template v-if="!isedit">{{record.airTemperature}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="空气湿度"
            style="width: 250px"
          >
            <a-input
              v-decorator="[
          'airHumidity',
          {
            initialValue:record.airHumidity,
            rules: [{ required: true, message: '请输入空气湿度' }],

          }
        ]"
            v-if="isedit"
      />
      <template v-if="!isedit">{{record.airHumidity}}</template>
          </a-form-item>
        </div>
        <div class="LayoutDiv">
          <a-form-item
            v-bind="formItemLayout"
            label="气压"
            flex="1"
            style="width: 250px"
          >
            <a-input
              v-decorator="[
          'airPressure',
          {
            initialValue:record.airPressure,
            rules: [{ required: true, message: '请输入气压' }],

          }
        ]"
               v-if="isedit"
      />
      <template v-if="!isedit">{{record.airPressure}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="风速"
            style="width: 250px"
          >
            <a-input
              v-decorator="[
          'windSpeed',
          {
            initialValue:record.windSpeed,
            rules: [{ required: true, message: '请输入风速' }],

          }
        ]"
            v-if="isedit"
      />
      <template v-if="!isedit">{{record.windSpeed}}</template>
          </a-form-item>
        </div>
        <div class="LayoutDiv">
          <a-form-item
            v-bind="formItemLayout"
            label="风向"
            flex="1"
            style="width: 250px"
          >
            <a-input
              v-decorator="[
          'windDirection',
          {
            initialValue:record.windDirection,
            rules: [{ required: true, message: '请输入风向' }],

          }
        ]"
              v-if="isedit"
      />
      <template v-if="!isedit">{{record.windDirection}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="降雨量"
            style="width: 250px"
          >
            <a-input
              v-decorator="[
          'rainfall',
          {
            initialValue:record.rainfall,
            rules: [{ required: true, message: '请输入降雨量' }],

          }
        ]"
            v-if="isedit"
      />
      <template v-if="!isedit">{{record.rainfall}}</template>
          </a-form-item>
        </div>
        <div class="LayoutDiv">
          <a-form-item
            v-bind="formItemLayout"
            label="土壤温度"
            flex="1"
            style="width: 250px"
          >
            <a-input
              v-decorator="[
          'soilTemperature',
          {
            initialValue:record.soilTemperature,
            rules: [{ required: true, message: '请输入土壤温度' }],

          }
        ]"
            v-if="isedit"
      />
      <template v-if="!isedit">{{record.soilTemperature}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="土壤湿度"
            style="width: 250px"
          >
            <a-input
              v-decorator="[
          'soilHumidity',
          {
            initialValue:record.soilHumidity,
            rules: [{ required: true, message: '请输入土壤湿度' }],

          }
        ]"
            v-if="isedit"
      />
      <template v-if="!isedit">{{record.soilHumidity}}</template>
          </a-form-item>
        </div>
        <div class="LayoutDiv">
          <a-form-item
            v-bind="formItemLayout"
            label="土壤PH值"
            flex="1"
            style="width: 250px"
          >
            <a-input
              v-decorator="[
          'soilPh',
          {
            initialValue:record.soilPh,
            rules: [{ required: true, message: '请输入土壤PH值' }],

          }
        ]"
            v-if="isedit"
      />
      <template v-if="!isedit">{{record.soilPh}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="光照时长"
            style="width: 250px"
          >
            <a-input
              v-decorator="[
          'illTime',
          {
            initialValue:record.illTime,
            rules: [{ required: true, message: '请输入光照时长' }],

          }
        ]"
            v-if="isedit"
      />
      <template v-if="!isedit">{{record.illTime}}</template>
          </a-form-item>
        </div>
        <!--<div class="LayoutDiv">
          <a-form-item
            v-bind="formItemLayout"
            label="光照强度"
            flex="1"
            style="width: 250px"
          >
            <a-input
              v-decorator="[
          'illIntensity',
          {
            initialValue:record.illIntensity,
            rules: [{ required: true, message: '请输入光照强度' }],

          }
        ]"
            v-if="isedit"
      />
      <template v-if="!isedit">{{record.illIntensity}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="二氧化碳浓度"
            style="width: 250px;"
            class="layoutCo2"
          >
            <a-input
              v-decorator="[
          'co2Value',
          {
            initialValue:record.co2Value,
            rules: [{ required: true, message: '请输入二氧化碳浓度' }],

          }
        ]"
           v-if="isedit"
      />
      <template v-if="!isedit">{{record.co2Value}}</template>
          </a-form-item>
        </div>-->
        <div  style="display: flex">
          <a-form-item
            v-bind="formItemLayout"
            label="光照强度"
            flex="1"
            style="width: 250px;margin-left: 24px;"
          >
            <a-input
              v-decorator="[
          'pm25Value',
          {
            initialValue:record.pm25Value,
            rules: [{ required: true, message: 'PM2.5值' }],

          }
        ]"
           v-if="isedit"
      />
      <template v-if="!isedit">{{record.illIntensity}}</template>
          </a-form-item>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import {pick} from 'lodash'
  //import { addpro,updateUser,updateproduce } from '@/api/userApi'
  import {updateEnv,queryEnv} from '@/api/allapi'
  export default {
    data() {
      return {
        record:{},
        isedit:true,
        loading: false,
        visible: false,
        title:"操作",
        okText:"",
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
        tailFormItemLayout: {
          wrapperCol: {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 8,
            },
          },
        },
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN);
    },
    methods: {
      add(){
        this.record={};
        //this.isedit=true;
        this.edit();
      },
      look(record){
        this.title = "查看详情"
        this.okText = "确认"
        this.pw = false
        this.npw = true
        if(record!=" "&&record!=undefined){
          if(!record.avatar){
            this.tx=false
          }
          else{
            this.tx=true
          }

        }
        this.isedit=false;
        this.record=record
        this.visible=true
        //this.isedit=false;
      },
      edit(record){
        this.title = "编辑监测数据"
        this.okText = "确认修改"
        //this.title=true;
         this.isedit=true;
        this.record=record
        this.visible=true;
          /*if(this.record.sex==null){
            this.record.sex=''
          }
          //console.log(record)
          let imgshowapi = '/api/upload/show'
          if(record.avatar){
          this.imageUrl=imgshowapi+'?fileName='+record.avatar
          }else{
             this.imageUrl=''
          }*/


      },
      handleOk(){
        if(this.title=="添加数据"){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=this.form.getFieldsValue(['produceName','baseId','harvestTime','testTime','testSequence'])
              this.form.resetFields();
              addpro(userinfo).then((res=>{
                if(res.success==true){
                  this.$message.info('添加成功！')
                  this.form.resetFields()
                  this.$parent.loadData()
                  this.visible=false;
                }else{
                  this.$message.info(res.message)
                  this.visible=false;
                }
              }))

              //this.$message.info(this.$store.state.user.addinfo)
              //console.log(this.form.getFieldsValue(['username','password','phone','sex','email']))
            }
          });
        }
        if(this.title=="编辑监测数据"){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=this.form.getFieldsValue(['airTemperature','airHumidity','airPressure','windSpeed','rainfall','windDirection','rainfallToday','soilTemperature','soilHumidity','soilPh','illTime','illIntensity','co2Value','pm25Value']);
              this.form.resetFields();
              userinfo.id=this.record.id;
              userinfo.equipmentId=this.record.equipment.equipmentId;
              updateEnv(userinfo).then((res=>{
                if(res.success==true){
                  this.$message.info(res.message)
                  this.$parent.loadData()
                  this.visible=false
                }else{
                  this.$message.info(res.message)
                }
              }))
            }
          });
        }
        if(this.title=="查看详情"){
          this.visible=false
        }
      },

    }
  }

</script>
<style>
  .avatar-uploader > .ant-upload {
    width: 50px;
    height: 50px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
    .LayoutDiv{
    display: flex;
    width: 600px;
    justify-content:space-around;
  }
  .layoutCo2 > div:first-child {
    width: 100px;
    margin-right: 10px;
  }
  .layoutCo2 > div:nth-of-type(2) {
    width: 140px;
  }
</style>
