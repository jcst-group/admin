<template>
    <div>
        <a-modal
        title="查看监控"
        v-model="visible"
        :footer="null"
        style="top:5%;height: 90%;"
        :maskClosable="false"
        @cancel="guanbi"
        >
            <video id="myVideo" width="100%" height="100%" ref="myPlayer" controls :src="address"></video>
        </a-modal>
    </div>
</template>
<script>
    import {getYsToken}  from '@/api/ddwbApi'
    import axios from 'axios'
export default {
    data(){
        return{
            visible:false,
            address:'',
            record:{},
        }
    },
    created(){
        
    },
    methods:{
        guanbi(){
            this.address='';
            this.visible=false;
        },
        look(record){
            this.record=record;
            this.address='';
            getYsToken().then(res=>{
            if(res.success){
                let token='accessToken=' + res.result + '&pageStart=0&pageSize=50'
                this.getAddress(token);
            }
        })
            this.visible=true;
        },
        getAddress (token) {
        let params = 'appKey=c949347ff85947d39f0749143b0a76f6&appSecret=83a5afbe9249c08698e53a92e97edc53'
        let curToken = token
        axios.post('https://open.ys7.com/api2/lapp/live/video/list', curToken, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => {
          if (res.data.code == 200) {
            if (res.data.data && res.data.data.length) {
                for(let i=0;i<res.data.data.length;i++){
                    if(this.record.name==res.data.data[i].deviceName&&this.record.channelNo==res.data.data[i].channelNo){
                        this.address=res.data.data[i].liveAddress
                         this.$nextTick(() => {
                            this.player = new EZUIPlayer('myVideo');
                         })
                         break;
                    }
                }
            }
          } else if (res.data.code == 10002) {
          axios.post('https://open.ys7.com/api2/lapp/token/get', params, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
          }).then(res => {
            if (res.data.code == 200) {
              let token = 'accessToken=' + res.data.data.accessToken + '&pageStart=0&pageSize=50'
              //window.localStorage.setItem('token', token)
              this.getAddress(token)
            }
          })
          } else if (res.data.code == 10001) {
              axios.post('https://open.ys7.com/api2/lapp/token/get', params, {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              }).then(res => {
                if (res.data.code == 200) {
                let token = 'accessToken=' + res.data.data.accessToken + '&pageStart=0&pageSize=50'
                //window.localStorage.setItem('token', token)
                this.getAddress(token)
                }
              })
          }
         this.$nextTick(() => {
          myVideo.addEventListener('play', () => {
          this.player.on()
          })
        })
        })
      },
    },
}
</script>
<style scoped>

</style>