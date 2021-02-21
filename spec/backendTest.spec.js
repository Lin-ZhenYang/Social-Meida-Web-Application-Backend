const fetch = require("node-fetch");
const url = path => `http://localhost:3000${path}`

var setCookie;
var cookie;


describe("Tests for backend",() =>{
	it ("Test POST /register", (done)=>{
		const registerTest = fetch(url("/register"), {
			method:"POST",
			headers: {'Content-Type': 'application/json'},
            body : JSON.stringify({"username": "testUser", "password":"123", "zipcode":12345,"dob":"1111-11-11","email":"qqq@qq.com"})
		}).then(res => {
			return res.json();
		}).then(body => {
			expect(body.username).toBe('testUser');
			expect(body.result).toBe('user existed');
		}).then(done).catch(done);
	});

	it ("Test Post /login", (done)=>{
		const loginTest = fetch(url("/login"), {
			method:"POST",
			headers: {'Content-Type': 'application/json'},
            body : JSON.stringify({"username": "testUser", "password":"123"})
		}).then(res => {
			return res.json();
		}).then(body => {
			expect(body.username).toBe('testUser');
			expect(body.result).toBe('success');

		}).then(done).catch(done);
	});

	it ("Test PUT /logout", (done)=>{
		let loginUser = fetch(url("/login"), {
			method:"POST",
			headers: {'Content-Type': 'application/json'},
            body : JSON.stringify({"username": "testUser", "password":"123"})
		}).then(res => {
				setCookie = res.headers.get('set-cookie');
				cookie = setCookie.substring(0,setCookie.indexOf(';'));
		}).then( () => {
			const registerTest = fetch(url("/logout"), {
					method:"PUT",
					headers:{Cookie:cookie}
				}).then(res => {
					expect(res.statusText).toBe('OK');
				}).then(done).catch(done);
		})

	});

	it ("Test GET /headline", (done)=>{
		let loginUser = fetch(url("/login"), {
			method:"POST",
			headers: {'Content-Type': 'application/json'},
            body : JSON.stringify({"username": "testUser", "password":"123"})
		}).then(res => {
				setCookie = res.headers.get('set-cookie');
				cookie = setCookie.substring(0,setCookie.indexOf(';'));
		}).then( () => {
			const loginTest = fetch(url("/headline"), {
				method:"GET",
				headers:{Cookie:cookie}
			}).then(res => {
				return res.json();
			}).then(body =>{
				expect(body.headline).toBe("test headline");
			}).then(done).catch(done);
		})
	});

	it ("Test PUT /headline", (done)=>{
		let loginUser = fetch(url("/login"), {
			method:"POST",
			headers: {'Content-Type': 'application/json'},
            body : JSON.stringify({"username": "testUser", "password":"123"})
		}).then(res => {
				setCookie = res.headers.get('set-cookie');
				cookie = setCookie.substring(0,setCookie.indexOf(';'));
		}).then( () => {
			const registerTest = fetch(url("/headline"), {
			method:"PUT",
			headers:{'Content-Type': 'application/json',Cookie:cookie},
			body : JSON.stringify({"headline":"test headline"})
			}).then(res => {
				return res.json();
			}).then(body => {
				expect(body.headline).toBe("test headline");
			}).then(done).catch(done);

		});
	});

	it ("Test GET /articles", (done)=>{
		let loginUser = fetch(url("/login"), {
			method:"POST",
			headers: {'Content-Type': 'application/json'},
            body : JSON.stringify({"username": "testUser", "password":"123"})
		}).then(res => {
				setCookie = res.headers.get('set-cookie');
				cookie = setCookie.substring(0,setCookie.indexOf(';'));
		}).then( () => {
			const registerTest = fetch(url("/articles"), {
			method:"GET",
			headers:{Cookie:cookie},
			}).then(res => {
				return res.json();
			}).then(body => {
				expect(body.articles[0].author).toBe("testUser");
			}).then(done).catch(done);

		});
	});

	it ("Test GET /articles/id", (done)=>{
		let loginUser = fetch(url("/login"), {
			method:"POST",
			headers: {'Content-Type': 'application/json'},
            body : JSON.stringify({"username": "testUser", "password":"123"})
		}).then(res => {
				setCookie = res.headers.get('set-cookie');
				cookie = setCookie.substring(0,setCookie.indexOf(';'));
		}).then( () => {
			const registerTest = fetch(url("/articles/testUser"), {
			method:"GET",
			headers:{Cookie:cookie},
			}).then(res => {
				return res.json();
			}).then(body => {
				expect(body.articles[0].author).toBe("testUser");
			}).then(done).catch(done);

		});
	});

	it ("Test Test POST /article", (done)=>{
		let loginUser = fetch(url("/login"), {
			method:"POST",
			headers: {'Content-Type': 'application/json'},
            body : JSON.stringify({"username": "testUser", "password":"123"})
		}).then(res => {
				setCookie = res.headers.get('set-cookie');
				cookie = setCookie.substring(0,setCookie.indexOf(';'));
		}).then( () => {
			const registerTest = fetch(url("/article"), {
			method:"POST",
			headers:{'Content-Type': 'application/json',Cookie:cookie},
			body : JSON.stringify({"text":"test article"})
			}).then(res => {
				return res.json();
			}).then(body => {
				expect(body.articles[0].author).toBe("testUser");
			}).then(done).catch(done);

		});
	});
})