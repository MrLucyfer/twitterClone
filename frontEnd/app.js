var app = new Vue({
  el: '#app',
  data: {
    message: 'The new Twitter!!',
    name:'',
    tweet:'',
    history: [{name:'nil', tweet:'tweeted'}]
  },
  
  methods: {
	  
	  getData() {
		 let data = {
			 name: this.name,
			 tweet:this.tweet
		 }
		 this.history.push(data);
		 this.history.reverse();
		 this.name = '';
		 this.tweet = '';
		}
	} 
})
