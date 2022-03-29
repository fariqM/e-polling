<template>
  <v-main style="height:100%">
      <div class="d-flex justify-center align-center" style="height:100%">
         <div class="text-center">
              receiving from URL : 
              <br>
              <b>https://polling-pol.site/p/{{ polling_params }}</b>
         </div>
      </div>
  </v-main>
</template>

<script>
export default {
    data(){
        return{
            polling_params:""
        }
    },
    mounted(){
        this.polling_params = this.$router.history.current.params.pollingUrl
    }
}
</script>

<style>

</style>