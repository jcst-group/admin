<template>
  <div>
    <a-modal
      v-model="visible"
      :title="title"
      @ok="handleOk"
      okText="保存"
      cancelText="取消"
      :maskClosable="false"
      width=35%
      style="min-width:800px;"
    >

      <a-form :form="form">
        <template v-if="!guan">
        <div class="main" style="width:750px;">
          <div style="float:left;width:350px;">
        <a-form-item
          label="管理人员姓名"
        >
          <a-input
            v-decorator="[
          'walkerName',
          {
            rules: [{
              required: true, message: '请输入管理人员姓名！'
            }]
          }
        ]"
          />
        </a-form-item>
        <template v-if="!id">
        <a-form-item
          label="密码"
        >
          <a-input
            v-decorator="[
          'walkerPassword',
          {
            rules: [{
              message:'密码长度必须在6-32位内！',min:6,max:32
            },{
              required: true, message: '请输入密码',
            }, {
              validator: validateToNextPassword,
            }],
          }
        ]"
            type="password"
          />
        </a-form-item>
        <a-form-item
          label="确认密码"
        >
          <a-input
            v-decorator="[
          'confirm',
          {
            rules: [{
              required: true, message: '请确认密码!',
            }, {
              validator: compareToFirstPassword,
            }],
          }
        ]"
            type="password"
            @blur="handleConfirmBlur"
          />
        </a-form-item>
        </template>
        <a-form-item
          label="手机号"
        >
          <a-input
          maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')"
            v-decorator="[
          'walkerPhoneNum',
          {
            rules: [{ 
              required: true, message: '请输入你的手机号' },{
              validator: displayResult,
            }],
          }
        ]"
            style="width: 100%"
          >
          </a-input>
        </a-form-item>
        <template v-if="id">
        <a-form-item
          label="邮箱"
        >
          <a-input
            v-decorator="[
          'walkerEmail',
          {
            rules: [{
              type: 'email', message: '这不是一个正确的邮箱',
            }, {
              required: false, message: '请输入邮箱',
            }]
          }
        ]"
          />
        </a-form-item>
       </template>
          </div>
          <div style="float:left;width:350px;margin-left:20px;">
             <template v-if="!id">
             <a-form-item
          label="邮箱"
        >
          <a-input
            v-decorator="[
          'walkerEmail',
          {
            rules: [{
              type: 'email', message: '这不是一个正确的邮箱',
            }, {
              required: false, message: '请输入邮箱',
            }]
          }
        ]"
          />
        </a-form-item>
             </template>
             <a-form-item
          label="基地管理人员住址"
        >
       <a-button type="primary" @click="handleupdate" v-if="!ade">修改地址</a-button>
      <a-cascader :options="options" placeholder="请选择省/市/(县，区)" @change="onChangmap" v-if="ade"/>
          <a-input
          :disabled="!ade"
            v-decorator="[
          'contactAddresss',
          {
            rules: [ {
              required: true, message: '请输入具体地址！',
            }]
          }
        ]"
          />
        </a-form-item>
       <a-form-item
      label="按地区查询基地"
    >
      <a-tree-select
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
    :treeData="treeData"
    @change="onchange"
    :value="value"
  />
      <a-select
       mode="multiple"
      placeholder="选择相应地区获取基地列表"
      v-decorator="[
          'baseName',
          {initialValue:this.workinfo,
            rules: [ {
              required: true, message: '请至少绑定一个基地！',
            }]}
        ]"
         >
     <a-select-option v-for="(v,k) in baseinfo" :value="v.id" :key="k">{{v.baseName}}</a-select-option>
  </a-select>
    </a-form-item>
     <!-- <a-form-item
      label="选择基地"
    >
       <a-select
       mode="multiple"
      placeholder="选择相应地区获取基地列表"
      v-decorator="[
          'baseName',
          {rules: [ {
              required: true, message: '请输入具体地址！',
            }]}
        ]"
         >
     <a-select-option v-for="(v,k) in baseinfo" :value="v.id" :key="k">{{v.baseName}}</a-select-option>
  </a-select>
    </a-form-item> -->
          </div>

        </div>
        </template>
        <template v-if="guan">
          <div style="margin:auto;width:300px;">
        <a-form-item
          label="密码"
        >
          <a-input
            v-decorator="[
          'walkerPassword',
          {
            rules: [{
              message:'密码长度必须在6-32位内！',min:6,max:32
            },{
              required: true, message: '请输入密码',
            }, {
              validator: validateToNextPassword,
            }],
          }
        ]"
            type="password"
          />
        </a-form-item>
        <a-form-item
          label="确认密码"
        >
          <a-input
            v-decorator="[
          'confirm',
          {
            rules: [{
              required: true, message: '请确认密码!',
            }, {
              validator: compareToFirstPassword,
            }],
          }
        ]"
            type="password"
            @blur="handleConfirmBlur"
          />
        </a-form-item>
        </div>
        </template>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import {saveWalker,updateWalker,sernumcheck} from '@/api/allapi'
  import {pick} from 'lodash'
  import { getmap } from '@/api/userApi'
  import {getbase,updatepd} from '@/api/allapi'

  export default {
    name:'workerModal',
    data() {
      return {
        address:[],
        label:[],
        options: [],
        bindbase:'绑定基地',
        ade:true,
        hemin:true,
        par:{},
        confirmDirty: false,
        treeData:[],
        visible: false,
        title:"操作",
        model:{},
        oldphone:'',
        value:'',
        area:'',
        baseinfo:[],
        baseid:'',
        workinfo:[],
        id:'',
        guan:false,
        form: this.$form.createForm(this),
      }
    },
    methods: {
       loadmap2(){
        this.treeData=[];
  getmap().then((res)=>{
          for(let i=0;i<res.result.length;i++){
            var a={};
            a.value=String(res.result[i].id)+'-'+'1';
            a.key=String(res.result[i].id);
            a.title=res.result[i].name;
            a.children=[];
            if(res.result[i].children.length>0){
              for(let j=0;j<res.result[i].children.length;j++){
                var b={};
                b.value=String(res.result[i].children[j].id)+'-'+'2';
                b.key=String(res.result[i].children[j].id);
                b.title=res.result[i].children[j].name;
                b.children=[];
                if(res.result[i].children[j].children.length>0){
                  for(let k=0;k<res.result[i].children[j].children.length;k++){
                    var c={};
                    c.value=String(res.result[i].children[j].children[k].id)+'-'+'3';
                    c.key=String(res.result[i].children[j].children[k].id);
                    c.title=res.result[i].children[j].children[k].name;
                    b.children.push(c);
                  }
                }
                a.children.push(b);
              }
            }
            this.treeData.push(a);
          }
        });
      },
       onchange (value, label, extra) {
      // console.log('onchange_value', value);
      // console.log('onchange_lable', label);
      this.value=value;
      let a=value.split('-');
      this.area=a;
      console.log(this.area);
      getbase({areaCode:this.area[0],level:this.area[1]}).then((res)=>{
        console.log(res);
        if(res.success){
          this.baseinfo=res.result;
          // if(res.result.length>0){
          //   this.baseid=res.result[0].id;
          // }else{
          //   this.baseid='';
          // }
        }
      })
       },
      bindBase(){
        if(this.hemin){
          this.bindbase='返回';
          this.hemin=false;
        }else{
          this.bindbase='绑定基地';
          this.hemin=true;
        }

      },
 handleupdate(){
        this.ade=true;
        this.options=[];
        this.loadmap();
        this.form.resetFields('contactAddresss');
      },
      onChangmap(value){
        this.label=[];
        this.address=[];
        this.par={};
        for(let i=0;i<value.length;i++){
          let a=value[i].split('-');
          this.address.push(a[1]);
          this.label.push(a[0]);
        }
        if(value.length>1){
        this.par.province=this.address[0];
        this.par.provinceCode=this.label[0];
        this.par.city=this.address[1];
        this.par.cityCode=this.label[1];
        this.par.area=this.address[2];
        this.par.areaCode=this.label[2];
        }else{
          this.par.province=this.address[0];
          this.par.provinceCode=this.label[0];
        }
      },
      handleConfirmBlur  (e) {
        const value = e.target.value;
        this.confirmDirty = this.confirmDirty || !!value;
      },
      compareToFirstPassword  (rule, value, callback) {
        const form = this.form;
        if (value && value !== form.getFieldValue('walkerPassword')) {
          callback('两次密码不一样');
        } else {
          callback();
        }
      },
      validateToNextPassword  (rule, value, callback) {
        const form = this.form;
        if (value && this.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      },
      loadmap(){
          getmap().then((res)=>{
          console.log('地区列表................');
          console.log(res);
          for(let i=0;i<res.result.length;i++){
            var a={};
            a.value=res.result[i].id+'-'+res.result[i].name;
            a.label=res.result[i].name;
            a.children=[];
            if(res.result[i].children.length>0){
              for(let j=0;j<res.result[i].children.length;j++){
                var b={};
                b.value=res.result[i].children[j].id+'-'+res.result[i].children[j].name;
                b.label=res.result[i].children[j].name;
                b.children=[];
                if(res.result[i].children[j].children.length>0){
                  for(let k=0;k<res.result[i].children[j].children.length;k++){
                    var c={};
                    c.value=res.result[i].children[j].children[k].id+'-'+res.result[i].children[j].children[k].name;
                    c.label=res.result[i].children[j].children[k].name;
                    b.children.push(c);
                  }
                }
                a.children.push(b);
              }
            }
            this.options.push(a);
          }
        });
      },
      add () {
        this.options=[];
        this.treeData=[];
        this.workinfo=[];
        this.value='';
        this.id='';
       this.loadmap();
       this.loadmap2();
        this.edit();
      },
      editpassword(record){
        this.guan=true;
        this.id=record.id;
        this.form.resetFields();
        this.visible=true;
      },
      edit(record){
       this.guan=false;
        // this.treeData=[];
        // this.loadmap2();
        console.log("workerModal edit record")
        console.log(record)

        this.form.resetFields();
        this.ade=true;
        if(record!=undefined){
          this.id=record.id;
           this.treeData=[];
           this.value='';
          this.loadmap2();
        console.log(record.baseInfos.length);
        if(record.baseInfos.length>0){
          this.workinfo=[];
           this.baseinfo=[];
          for(let i=0;i<record.baseInfos.length;i++){
           this.workinfo.push(record.baseInfos[i].id);
           let a={};
           a.id=record.baseInfos[i].id;
           a.baseName=record.baseInfos[i].baseName;
           this.baseinfo.push(a)
          }
        }
        console.log(this.workinfo);
          this.ade=false;
          this.model = Object.assign({}, record);
          this.oldphone=record.walkerPhoneNum;
           console.log(this.model);
        let fieldsVal = pick(this.model,'walkerName','walkerPhoneNum','contactAddresss','walkerEmail');
       this.$nextTick(() => {
          this.form.setFieldsValue(fieldsVal)
        });
        }else{
          this.model={};
          this.form.resetFields();
        }
        this.visible = true;
      },
      handleOk(){
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            //let formData = Object.assign(this.model, values);
            let formData = this.form.getFieldsValue(['walkerName','walkerPassword','walkerPhoneNum','contactAddresss','walkerEmail']);

            let tt= this.form.getFieldsValue(['baseName']).baseName;
            console.log(tt);
            let a=formData.contactAddresss;
            formData.baseInfos=[];
            if(tt){
            for(let i=0;i<tt.length;i++){
            formData.baseInfos.push({id:tt[i]});
            }
            }
            let obj;
            let b={};
            b.phone=formData.walkerPhoneNum;
            console.log(formData)
            if(this.title=="新增"){
              sernumcheck(b).then((res)=>{
                if(res.success){
                   formData.contactAddresss=this.address.join('')+a;
                   this.par.address=this.address.join('')+a;
                   formData.address=this.par;
                   saveWalker(formData).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.hideModal();
            });
                }else{
                  this.$message.info(res.message);
                }
              })

            }else if(this.title=="编辑"){
              formData.id=this.id;
              if(this.oldphone== b.phone){
                 if(this.ade){
                 formData.contactAddresss=this.address.join('')+a;
                 this.par.address=this.address.join('')+a;
                 formData.address=this.par;
                }else{
                  formData.address=this.model.address;
                }
              updateWalker(formData).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.hideModal();
            });
              }else{
                 sernumcheck(b).then((res)=>{
                if(res.success){
                   if(this.ade){
                 formData.contactAddresss=this.address.join('')+a;
                 this.par.address=this.address.join('')+a;
                 formData.address=this.par;
                }else{
                  formData.address=this.model.address;
                }
              updateWalker(formData).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.hideModal();
            });
                }else{
                  this.$message.info(res.message);
                }
              })
              }

            }else if(this.title=="修改密码"){
               let par = this.form.getFieldsValue(['walkerPassword']);
               par.id=this.id
               updatepd(par).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.hideModal();
            });
            }
          }
        })
      },
      showModal() {
        this.visible = true
      },
      hideModal() {
        this.visible = false
      },
       displayResult  (rule, value, callback) {
        if (value.length!=11) {
          callback('请输入正确的手机号');
        } else {
          callback();
        }
      },
    }
  }
</script>
<style scoped>
.main::after {
    clear: both;
    content: '';
    display: block;
    width: 0;
    height: 0;
}
</style>

