<template>
<div class="denglubg">
    <div class="main">
    <div align="center" style="position:absolute;top:0px;keft:0px">
        <a href="#/home">
        <button class="btn">返回</button>
        </a>
        </div>
		<div class="title">
			<span>登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</span>
		</div>
		<div class="title-msg">
			<span>请输入用户名和密码</span>
		</div>
        

		<form class="login-form" method="post">
			<!-- 输入框 -->
			<div class="input-contente">
				<div>
					<input type="text" placeholder="用户名" name="username" required>
				</div>
				<div style="margin-top: 16px">
					<input type="password" placeholder="密码" name="password" required>
				</div>
			</div>

			<!-- 登录按钮 -->
			<div style="text-align: center">
				<button type="submit" class="enter-btn">登录</button>
			</div>

			<div class="foor">
				<div class="left">
					<span><a href="#">忘记密码？</a></span>
				</div>
				<div class="right">
					<span><a href="register.html">还没有账号，立即注册</a></span>
				</div>
			</div>
		</form>
		
	</div>
	</div>
</template>


<script>
export default {
    setup() {
        
    },
}
</script>

<style>
  .denglubg {
	background: url(../assets/11.jpg);
	background-size: 100% 100%;
    height: 100%;
    position: fixed;
    width: 100%;
	position: fixed;
}

   .main {
	padding-left: 25px;
	padding-right: 25px;
	padding-top: 15px;
	width: 350px;
	height: 350px;
	background:rgb(116, 11, 116);
	/*让表单垂直居中在界面*/
	position: absolute;
	top: 50%;
	left: 80%;
	margin-top: -175px;
	margin-left: -900px;
}

.title {
	height: 40px;
	line-height: 40px;
	padding-left: 140px;
}

.title span {
	font-size: 18px;
}

.title-msg {
	height: 64px;
	line-height: x;
}

.title-msg span {
	font-size: 12px;
	color: gray;
}

.input-contente input {
	width: 300px;
	height: 40px;
	border: 1px solid #dad9d6;
	padding-left: 10px;
}

.enter-btn {
	margin-top: 20px; width : 350px;
	height: 40px;
	color: white;
	background: lightgreen;
	border: 0px;
	width: 300px;
}

.foor {
	font-size: 12px;
	color: gray;
	margin-top: 20px;
}

.left {
	float: left;
}

.right {
	float: right;
}

.a {
	text-decoration: none;
}
</style>
