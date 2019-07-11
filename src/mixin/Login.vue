<script>
  import utils from '@/plugins/utils'
  
	export default {
		created(){
      window.addEventListener('loginSuccessInit', (e) => {
        this.loginSuccessInit()
      })
    },
    
    methods: {
      loginSuccessInit(){
        if(!window.LOGIN_EVENTS_LISTENER){
          window.LOGIN_EVENTS_LISTENER = 'LOGIN_EVENTS_LISTENER'
          this.user = utils.getLocalUser()
        }
      }
    }
	}
</script>
