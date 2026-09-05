<template>
    <div>
        <div class="container">
        <nav class="navbar navbar-inverse">
            <a class="navbar-brand active" href="#/home">首页</a>
            <ul class="nav navbar-nav">
            <li>
                <a href="">主题</a>
            </li>

            <li>
                <a href="#/book">产品信息</a>
            </li>
            <li>
                <a href="#/xilie">闲暇时光</a>
            </li>
            <li>
                <a href="#/xinwen">新闻资讯</a>
            </li>
            <li>
                <a href="#/login">登录</a>
            </li>
        </ul>
    </nav>
        <div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
            <!-- Indicators -->
            <ol class="carousel-indicators">
              <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
              <li data-target="#carousel-example-generic" data-slide-to="1"></li>
              <li data-target="#carousel-example-generic" data-slide-to="2"></li>
            </ol>
          
            <!-- Wrapper for slides -->
            <div class="carousel-inner" role="listbox">
              <div class="item active">
                <img src="../assets/22jpg.jpg" height="50%" width="100%">
                <div class="carousel-caption">
                  ...
                </div>
              </div>
              <div class="item">
                <img src="../assets/123.jpg"  width="100%">
                <div class="carousel-caption">
                  ...
                </div>
              </div>
              <div class="item">
                <img src="../assets/33.jpg" height="50%" width="100%">
                <div class="carousel-caption">
                  ...
                </div>
              </div>
              ...
            </div>
          
            <!-- Controls -->
            <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
              <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
              <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a>
          </div> 
          
          <div class="panel panel-default">
                <div class="panel-body">
                      <div>音频视频</div>
                      <div>假面骑士主题店</div>
                      <div>联系方式：78985241639@163.com</div>
                </div>
          </div>
            
      </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style>
    .carousel .item {
       height: 500px;
   }
   .carousel-inner > .item > img {
       position: absolute;
       top: 0;
       left: 0;
       min-width: 100%;
       height: 500px;
    }
    .panel-default {
      background-color:black;
    }
    .panel-body div {
      
      font-size:16px;
      color: white;
      font-family: "华文楷体";
      padding: 5px;
    }



    .navbar-inverse{
  width:1140px; 
  height:50px; 
  margin:0px auto; 
  background:white; 
  opacity: 0.6; 
  margin-top:20px; 
  text-align:center;
  line-height:30px;        
}
.panel-body div {
  font-size: 16px;
  color:skyblue;
  font-family: "华文楷体"; 
  padding: 5px;
}
.panel-default {
  background-color:white;/*磊哥这里是你主页下面那个颜色的设置，你换一种颜色就知道怎么回事了，按你喜欢的颜色换，你要是还要你原来那种直接给这删了就行*/
}
 




</style>
