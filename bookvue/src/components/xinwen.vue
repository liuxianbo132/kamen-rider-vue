<template>
  <body>
      <div class="bg">
          <div class="a">
	<h1 style="color:black">动画情报</h1>
    <div class="gary">新京报发布时间：10-23  07:09  新京报社官方帐号 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         
        <input type="text" value="请输入查询条件" class="search"> <button class="btn">搜索</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://news.dmzj.com/tag/1274" target="_blank">动漫之家</a>
    </div>
    <hr>
    <p style="color:black">新京报快讯&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    特摄剧《假面骑士W》的续篇漫画《风都侦探》决定动画化了，<br>&nbsp;&nbsp;&nbsp;&nbsp;预定于2022年夏季开始播出。此次的动画化是特摄剧《假面骑士》50周年纪念企<br>&nbsp;&nbsp;&nbsp;&nbsp;划之一。于2009年8月开始播出的《假面骑士W》讲述了私家侦探-左翔太郎与其<br>&nbsp;&nbsp;&nbsp;&nbsp;搭档-菲利普变身为“2人一体”的假面骑士而活跃的故事。变身前的翔太郎由桐<br>&nbsp;&nbsp;&nbsp;&nbsp;山涟饰演，菲利普由菅田将晖饰演。</p>
    <p class="footer" style="color:black">编辑 杨利</p>
          </div>
      </div>
    </body>
    
</template>


<style>
body{
            font: 16px/28px 'Microsoft YaHei';
        }
        h1{
            /* 文字不加粗 */
            font-weight: 400;
            /* 让h1里面的文字水平居中对齐 */
            text-align: center;
        }
        a{
            text-decoration: none;
        }
        .gary{
            color: #888888;
            font-size: 12px;
            text-align: center;
        }
        .search{
            color: #666666;
            width: 170px;

        }
        .btn{
            font-weight: 700;
        }
        p{
            /* 首行缩进两个距离 */
            text-indent: 2em;
        }
        .pic{
            /* 想要图片居中对齐，要加在他的父亲上 */
            text-align: center;
        }
        .footer{
            color: #888888;
        }
        .bg{
            margin:0px;
            background: url("../assets/tianqi.jpg") no-repeat;
            background-size:100% 100%;
            background-attachment:fixed;
            background-color: #666666;
            height:1000px;
        }
        .a{
            height: 700px;
            width: 1200px;
            color: skyblue;
        }
</style>
