<template>
<div>
<img :src="url">    
</div>    
</template>
<script>
import {test} from '@/api/allapi'
export default {
    data(){
        return{
          url:'',
        }
    },
     created() {
         test({path:'images/record/2019/6/15609276239013191.jpg'}).then((res)=>{
             console.log(res);
             this.url=res.result;
         })
    }
}
</script>
<style scoped>

</style>
