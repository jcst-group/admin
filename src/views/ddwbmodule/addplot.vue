<template>
  <div>
    <a-modal
      v-model="visible"
      :title="title"
      @ok="handleOk"
      @cancel="closemodal"
      okText="保存"
      ref="modal"
      cancelText="取消"
      :maskClosable="false"
    >

      <a-form :form="form">
        <a-form-item
          label="地块名称"
          v-bind="formItemLayout"
        >
          <a-input
            v-decorator="[
          'lotName',
          {
            rules: [{
              required: true, message: '请输入地块名称',min:0,max:50
            }]
          }
        ]"
          />
        </a-form-item>

        <a-form-item
          label="所属农户"
          v-bind="formItemLayout"
        >
        <a-select
          showSearch
          placeholder="输入关键字查询"
          optionFilterProp="children"
          :filterOption="filterOption"
          v-decorator="[
          'userId',
          {
            rules: [{
              required: true, message: '请选择农户！',
            }]
          }
        ]">
              <a-select-option v-for="(v,k) in userinfo" :value="v.uid" :key="k">{{v.realName}}({{v.phone}})</a-select-option>
            </a-select>
        </a-form-item>

        <a-form-item
          label="面积(亩)"
          v-bind="formItemLayout"
        >
          <a-input
            v-decorator="[
          'lotAcreage',
          {
            initialValue:String(lotAcreage),
            rules: [{
              required: true, message: '请输入面积',min:0,max:10
            }]
          }
        ]"
        style="width: 100%"
          />
        </a-form-item>
        <a-form-item
          label="海拔"
          v-bind="formItemLayout"
        >
          <a-input
            v-decorator="[
          'altitude',
          {
            rules: [{ required: false}],
          }
        ]"
            style="width: 100%"
          >
          </a-input>
        </a-form-item>

        <a-form-item
          label="简介"
          v-bind="formItemLayout"
        >
          <a-textarea
          :rows="4"
            v-decorator="[
          'survey',
        ]"
            style="width: 100%"
          >
          </a-textarea>
        </a-form-item>
        <!-- <a-button style="margin-left:33%;margin-bottom:5%;" type="primary" @click="huadikuai">点击后在地图上开始画地块</a-button> -->
        <a-row :gutter="16">
          <a-col :span="6" style="text-align:right;">
            <span>选择颜色：</span>
          </a-col>
          <a-col :span="18">
              <a-radio-group  @change="onChange" v-model="value">
    <a-radio :value="1"><div style="width:20px;height:20px;background:#87ffc5;display:inline-block;"></div></a-radio>
    <a-radio :value="2"><div style="width:20px;height:20px;background:#bd60ff;display:inline-block;"></div></a-radio>
    <a-radio :value="3"><div style="width:20px;height:20px;background:#fcffa5;display:inline-block;"></div></a-radio>
    <a-radio :value="4"><div style="width:20px;height:20px;background:#ff8b56;display:inline-block;"></div></a-radio>
    <a-radio :value="5"><div style="width:20px;height:20px;background:#ff9bbb;display:inline-block;"></div></a-radio>
    <a-radio :value="6"><div style="width:20px;height:20px;background:#2c6e4a;display:inline-block;"></div></a-radio>
    <a-radio :value="7"><div style="width:20px;height:20px;background:#4d956d;display:inline-block;"></div></a-radio>
    <a-radio :value="8"><div style="width:20px;height:20px;background:#b5e9f4;display:inline-block;"></div></a-radio>
    <a-radio :value="9"><div style="width:20px;height:20px;background:#fec9b9;display:inline-block;"></div></a-radio>
    <a-radio :value="10"><div style="width:20px;height:20px;background:#d68c45;display:inline-block;"></div></a-radio>
  </a-radio-group>
          </a-col>
        </a-row>


      </a-form>


    </a-modal>
  </div>
</template>
<script>
  import { getAllFarm,addPlot } from '@/api/ddwbApi'
  import MapLoader from '@/utils/loadMap.js'
  export default {
    data() {
      return {
        userinfo:[],
        visible: false,
        title:"操作",
        formItemLayout: {
        labelCol: {
          xs: { span: 24},
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
        form: this.$form.createForm(this),
        polygonattr:{
          path: null,
          fillColor: '#87ffc5', // 多边形填充颜色
          borderWeight: 0, // 线条宽度，默认为 1
          strokeColor: '#87ffc5', // 线条颜色
          strokeOpacity:0,
          fillOpacity:0.5
        },
      baseid:'',
      areacord:'',
      value:'',
      lotAcreage:'',
      }
    },
    created(){
      getAllFarm().then((res)=>{
         if(res.success){
          this.userinfo=res.result;
        }
      })
    },
    methods: {
       onChange (e) {
      switch (e.target.value) {
        case 1:
          this.polygonattr.fillColor=	'#87ffc5';
          this.polygonattr.strokeColor='#87ffc5';
          break;
        case 2:
          this.polygonattr.fillColor=	'#bd60ff';
          this.polygonattr.strokeColor='#bd60ff';
          break;
        case 3:
          this.polygonattr.fillColor=	'#fcffa5';
          this.polygonattr.strokeColor='#fcffa5';
          break;
        case 4:
          this.polygonattr.fillColor=	'#ff8b56';
          this.polygonattr.strokeColor='#ff8b56';
          break;
        case 5:
          this.polygonattr.fillColor=	'#ff9bbb';
          this.polygonattr.strokeColor='#ff9bbb';
          break;
        case 6:
          this.polygonattr.fillColor=	'#2c6e4a';
          this.polygonattr.strokeColor='#2c6e4a';
          break;
        case 7:
          this.polygonattr.fillColor=	'#4d956d';
          this.polygonattr.strokeColor='#4d956d';
          break;
        case 8:
          this.polygonattr.fillColor=	'#b5e9f4';
          this.polygonattr.strokeColor='#b5e9f4';
          break;
        case 9:
          this.polygonattr.fillColor=	'#fec9b9';
          this.polygonattr.strokeColor='#fec9b9';
          break;
        case 10:
          this.polygonattr.fillColor=	'#d68c45';
          this.polygonattr.strokeColor='#d68c45';
          break;          
        default:
          break;
      }
       },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      add(id,path,area){
       this.form.resetFields();
       this.polygonattr.path=path;
       this.lotAcreage=area;
       this.baseid=id;
       this.value=1;
       this.visible=true;
       this.title='新增';
      },
      closemodal(){
        this.$parent.delpol();
        this.$parent.isadd=false;       
      },
      handleOk(){
        const that = this;
        // 触发表单验证
        that.form.validateFields((err, values) => {
          if (!err) {
            let formData = values;
            formData.remark=JSON.stringify(this.polygonattr);
            formData.baseId=that.baseid;
          //  console.log(formData);
            addPlot(formData).then(res=>{
                if(res.success){
                   that.$message.success(res.message);
                   that.$parent.loadData();
                   this.$parent.isadd=false;
                   that.hideModal();
               }else{
                   that.$message.warning(res.message);
               }
            })
          }
        })
      },
      showModal() {
        this.visible = true
      },
      hideModal() {
        this.visible = false
      },
    }
  }
</script>
<style scoped>
#container1 {
  width: 620px;
  height: 450px;
}
.allall{
  height:500px;
  overflow-y: auto;
}
.all{
  width:1050px;
  /* height:500px;
  overflow:auto */
}
.all::after,.jiange::after{
  clear: both;
  content: '';
  display: block;
  width: 0;
  height: 0;
}
.input{
  position: absolute;
  width:35%;
  top:2%;
  left:52%;
  z-index: 999;
  background:rgba(255,255,255,1);
  padding:0.5rem 0.5rem;
}
.input span{
  color:rgb(0, 0, 0);
  font-size: 14px;
  margin-right: 10px;
  vertical-align:center;
}
#input{
  display: inline-block;
  width:64%;
  -web-kit-appearance:none;
  -moz-appearance: none;
  font-size:1.0em;
  height:25px;
  border-radius:4px;
  border:1px solid #1a85d6;
  color:#6a6f77;
  outline:0;
}
</style>
