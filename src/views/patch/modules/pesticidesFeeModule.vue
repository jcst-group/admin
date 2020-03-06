<template>
  <a-modal
    :title="title"
    v-model="visible"
    @ok="handleOk"
    style="top:5%;height: 90%;"
    cancelText="取消"
    :okText="okText"
    :maskClosable="false"
    @cancel='cancel'
  >
    <a-form :form="form">
      <!-- <a-form-item label="费用类型">
        <a-tree-select
            allowClear
            treeDefaultExpandAll
            placeholder='请选择费用类型'
            :dropdownStyle="{ maxHeight: '260px', overflow: 'auto' }"
            v-decorator="[
                  'costType',
                  {
                    initialValue:fee.costType,
                    rules: [{ required: true, message: '请选择费用类型' }],
                  }
                ]" 
          >
          <a-tree-select-node value='用药费用' title="用药费用" key="0-1" disabled>
            <a-tree-select-node v-for="v in this.pesticidesFeeType" :title="v.pesticidesName" :key="v.id" :value="v.pesticidesName"></a-tree-select-node>
          </a-tree-select-node>
         </a-tree-select>
      </a-form-item> -->

      <div class="wrapper" :class="{active: this.feeLock}" ref="wrapper">
        <div class="title-wrapper">
          <h3 class="title">用药费用类型</h3>
        </div>
        <!-- <a-input v-model='test' @focus="test1" @blur="test2" ref="wrapper"/>
        <div class="slider-wrapper test" v-show="tests">
          <div class="tab"  @click="chooseLetter($event)" style="float:right; margin-right:20px; margin-top:20px">
            <ul>
              <li class="str-item" v-for="(v,index) in this.letters" :key="index"
                style="cursor:pointer; display:block; width: 20px; height:25px';text-align:center"
              >{{v}}</li>
            </ul>
          </div>
          <div class="slider-data" @click="choosePest($event)" ref="slider">
            <ul>
              <li class="data-item" v-for="v in this.pesticidesFeeType" :key="v.id">{{v.pesticidesName}}</li>
            </ul>
          </div>
        </div> -->
        <!-- <div class="test" v-show="tests"> -->
          <a-tree-select
            showSearch
            :value="handFeeType"
            :dropdownStyle="{ maxHeight: '260px', overflow: 'auto' }"
            placeholder='请选择费用类型'
            searchPlaceholder= '查询药名或手动添加'
            allowClear
            treeDefaultExpandAll
            @search = 'movementFeeType'
            @change="clickFeeType"
          >
            <a-tree-select-node value='用药费用' title="用药费用" key="0-1" disabled>
              <a-tree-select-node v-for="v in this.pesticidesFeeType" :title="v.pesticidesName" :key="v.id" :value="v.pesticidesName"></a-tree-select-node>
            </a-tree-select-node>
          </a-tree-select>
        <!-- </div> -->
        <div class="error" v-show="feeLock">
          请输入费用类型
        </div>
      </div>

      <a-form-item
        label="总用量"
    >
        <a-input
        v-decorator="[
            'dosage',
            {
            initialValue:fee.dosage,
            rules: [{
                required: true, message: '请输入用量',
            }]
            }
        ]"
        >
            <a-select ref="unit" slot="addonAfter" style="width: 100px" @change="selectUnit" 
            v-decorator="[
                'unit',
                {
                initialValue:'毫升(ml)',
                rules: [{
                    message: '请选择单位',
                }]
                }
            ]">
                <a-select-option v-for="unit in units" :key="unit.id" :value="unit.unit" title="unit.unit">{{unit.unit}}</a-select-option>
            </a-select>
        </a-input>
    </a-form-item>

    <!-- <a-form-item
        label="数量"
    >
        <a-input
        v-decorator="[
        'costNum',
        {
        initialValue:fee.costNum,
        rules: [{
            required: true, message: '请输入数量',
        }]
        }
    ]"
        />
    </a-form-item> -->

      <a-form-item label="总价（元)">
        <a-input
          v-decorator="[
          'costAmount',
          {
            initialValue:fee.costAmount,
            rules: [{
              required: true, message: '请输入金额',
            }]
          }
        ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { getPesticidesCostName, getPesticidesUnit } from "@/api/userApi";
import { insertPesticidesCost, updatepesticidesCost } from "@/api/allapi";

var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

export default {
  data() {
    return {
        fee: {},
        pesticidesFeeType: [],
        form: this.$form.createForm(this),
        recordId: undefined,
        visible: false,
        okText:"",
        title:"",
        feeName: '',
        handFeeType: '',
        feeLock: false,
        units: [],
        chooseUnit: '',
        test: '',
        tests: false,
        letters: letters,
        saveWidth: [0]
    };
  },
  created() {
        this._getPesticidesName();
  },
  methods: {
        // test1() {
        //   this.tests = true
        // },
        // test2() {
        //   if (this.test !== '') {
        //     this.tests = false
        //   }
        // },
        // choosePest(e) {
        //   if (e.target.localName == 'li') {
        //     this.test = e.target.innerText
        //   }
        // },
        // chooseLetter(e) {
        //   if(e.target.localName == 'li') {
        //     for (var i = 0; i < this.letters.length; i++) {
        //       if (e.target.innerText === this.letters[i]) {
        //         // this.$refs.slider.scrollTo(0, this.saveWidth[i])
        //       }
        //     }
        //   }
        // },
        _getPesticidesName() {
            getPesticidesCostName().then(res => {
                if (res.success) {
                  this.pesticidesFeeType = res.result;
                  // let width = 0
                  // let curLetter = 'A'
                  // for (var i = 0; i < this.pesticidesFeeType.length; i++) {
                  //   if (this.pesticidesFeeType[i].letter !== curLetter) {
                  //     this.saveWidth.push(width)
                  //   }
                  //   width += 27
                  //   curLetter = this.pesticidesFeeType[i].letter
                  // }
                } else {
                  return;
                }
            })
            getPesticidesUnit().then(res => {
                if (res.success) {
                    this.units = res.result;
                } else {
                    return;
                }
            })
        },  
        handleChange(value) {
            this.feeName = value.label
        },
        selectUnit(val) {
          this.chooseUnit = val
        },
        movementFeeType(val) {
          this.handFeeType = val
          if (val) {
            // this.$refs.wrapper.$el.style.borderColor = '#d9d9d9'
            this.$refs.wrapper.children[1].firstElementChild.style.borderColor = '#d9d9d9'
            this.feeLock = false
          }
        },
        clickFeeType(val) {
          this.handFeeType = val
          // this.test = val
          // this.tests = false
          if (val) {
            console.log(this.$refs.wrapper)
            // this.$refs.wrapper.$el.style.borderColor = '#d9d9d9'
            this.$refs.wrapper.children[1].firstElementChild.style.borderColor = '#d9d9d9'
            this.feeLock = false
          }
        },
        add(item) {
            this.title = "添加";
            this.okText = "确认添加";
            this.edit(item);
        },
        edit(fee) {
            this.form.resetFields();

            let recordExist = fee != undefined && fee != "" && fee.id != undefined;
            if (recordExist) {
                this.title = "编辑";
                this.okText = "确认修改";
                this.fee = fee;
                this.recordId = fee.recordId;
                this.handFeeType = fee.pesticidesName
                this.chooseUnit = fee.unit
                this.$nextTick(() => {
                    this.form.setFieldsValue({unit: fee.unit})
                    this.form.setFieldsValue({dosage: fee.dosage})
                    this.form.setFieldsValue({costAmount: fee.totalPrice})
                });
            } else {
                this.fee = {};
            }
            this.visible = true;
        },
        cancel() {
          this.handFeeType = ''
          // this.tests = false
          // this.$refs.wrapper.$el.style.borderColor = '#d9d9d9'
          this.$refs.wrapper.children[1].firstElementChild.style.borderColor = '#d9d9d9'
          this.feeLock = false
        },
        handleOk(){
            if (!this.handFeeType) {
              // this.$refs.wrapper.$el.style.borderColor = '#f5222d'
              this.$refs.wrapper.children[1].firstElementChild.style.borderColor = '#d9d9d9'
              this.feeLock = true
            } else {
              // this.$refs.wrapper.$el.style.borderColor = '#d9d9d9'
              this.$refs.wrapper.children[1].firstElementChild.style.borderColor = '#d9d9d9'
              this.feeLock = false
            }
            if (!this.handFeeType) {
              this.feeLock = true
            }
            this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const info=this.form.getFieldsValue();
                info.recordId = this.recordId
                info.pesticidesName = this.handFeeType
                info.unit = this.chooseUnit !== '' ? this.chooseUnit : info.unit
                console.log(this.$refs.unit.defaultValue)
                let fee = this.fee;
                info.totalPrice = info.costAmount
                this.handFeeType = ''
                this.chooseUnit = ''
                if(fee.id!=undefined && fee.id!=null && fee.id!=""){
                    info.id = fee.id;
                    updatepesticidesCost(info).then(res => {
                        if(res.success === true) {
                            this.$message.info(res.message)
                            this.$parent._getRecord();
                            this.visible = false;
                        } else {
                            this.$message.info(res.message)
                        }
                            this.form.resetFields();
                    })
                } else {
                    insertPesticidesCost(info).then(res => {
                        if(res.success==true){
                            this.$message.info('添加成功！')
                            this.$parent._getRecord();
                            this.visible = false;
                        }else{
                            this.$message.info(res.message)
                        }
                        this.form.resetFields();
                    })
                }
            }
            });
        }
  }
};
</script>
<style scoped>
   .test {
     position: absolute;
     left: 520px;
     top: 0px;
     width: 500px;
     height: 600px;
     background-color: #fff;
   }
   li{
     list-style: none
   }
   ul {
     padding: 0;
     padding-left: 15px;
   }
   .slider-data{
    width: 90%;
    padding-top: 20px;
    overflow: auto;
    position: absolute;
    top: 0;
    height: 100%;
    box-sizing: border-box;
   }
   .data-item{
    white-space: nowrap;
    outline: 0;
    display: block;
    padding: 3px 5px;
    border-radius: 2px;
    margin: 0;
    cursor: pointer;
    text-decoration: none;
    color: rgba(0, 0, 0, 0.65);
    width: calc(100% - 24px);
   }
   .data-item:hover{
    background-color: #e6f7ff;
   }
   .wrapper{
    font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.65);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    margin-bottom: 24px;
    vertical-align: top;
  }
  .title-wrapper{
    text-align: right;
    vertical-align: middle;
    line-height: 39.9999px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
  }
  .title{
    color: rgba(0, 0, 0, 0.85);
    position: relative;
    font-size: 14px;
    text-align: right;
    vertical-align: middle;
    line-height: 40px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
  }
  .title::before{
    display: inline-block;
    margin-right: 4px;
    content: '*';
    font-family: SimSun;
    line-height: 1;
    font-size: 14px;
    color: #f5222d;
  }
  .title::after{
    content: ':';
    margin: 0 8px 0 2px;
    position: relative;
    top: -0.5px;
  }
  .error{
    color: #f5222d;
    line-height: 1.524;
    transition: color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    margin-top: 5px;
    clear: both;
  }
  .active .ant-select .ant-select-selection{
    border-color: #f5222d !important;
  }
</style>
