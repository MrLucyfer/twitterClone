var app = new Vue({
  el: '#app',
  data: {
    message: 'SAY SOMETHING!',
    name:'',
	tweet:'',
	history: [],
	API_URL: 'http://localhost:5000/tweets'
  },
  
  methods: {
	getData() {
	fetch(this.API_URL)
		.then(response => response.json())
		.then(receivedTweets => {
			this.history = receivedTweets;
			this.history.reverse();
			console.log('Updated')
		  })
	},
	  sendData() {
		 let data = {
			 name: this.name,
			 tweet:this.tweet,
		 }
		 console.log(data);
		 fetch(this.API_URL, {
			 method:'POST',
			 body: JSON.stringify(data),
			 headers: {
					'content-type': 'application/json'
			 }
		 }).then(response => response.json())
		   .then(receivedTweet => {
			   this.getData();
		   })
		 this.name = '';
		 this.tweet = '';
		 
		}
	},
	created(){
		this.getData();
		setInterval(this.getData, 10000);
	} 
});

