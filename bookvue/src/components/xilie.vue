<template>
    <main id="main">
      <figcaption id="img-caption">
      亲爱的顾客朋友，欢迎光临假面骑士主题咖啡店<br>
      Dear customers and friends, welcome to the masked Knight theme coffee shop.
    </figcaption>
  <h1 id="title">假面骑士主题店</h1>
  <p>“好了，来细数你的罪恶吧”</p>

    <section id="tribute-info">
    

      <p>
       “明海咖啡馆以最好的材料和服务为人们提供最高水平的享受。”
      </p>
      
    
  </section>
    <h3>
      If you have time, you should know more 
      <a
        id="tribute-link"
        href="biaodan.html"
        target="_blank"
        >点击这里，开启探险</a
      >
    </h3>
    <h3>
      If you want to buy some other products, please click here
      <a
        id="tribute-link"
        href="\#book"
        target="_blank"
        >点击这里，购买商品</a
      >
    </h3>
  <figure id="img-div">
    <img id="image" src="../assets/xilie.jpg"/>
     <img id="image" src="../assets/xilie2.jpg"/>
      <img id="image" src="../assets/xilie3.jpg"/>
    
  </figure>

 
</main>
</template>
<script>
export default {
    
}
</script>
<style>
   html {
    /* Setting a base font size of 10px give us easier rem calculations
       Info: 1rem === 10px, 1.5rem === 15px, 2rem === 20px and so forth
     */
    font-size: 10px;
  }
  
  body {
    /* Native font stack https://getbootstrap.com/docs/4.2/content/reboot/#native-font-stack */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Helvetica Neue', Arial, sans-serif;
    font-size: 1.6rem;
    line-height: 1.5;
    text-align: center;
    color: #333;
    margin: 0;
  }
  
  h1 {
    font-size: 4rem;
    margin-bottom: 0;
  }
  
  @media (max-width: 460px) {
    h1 {
      font-size: 3.5rem;
      line-height: 1.2;
    }
  }
  
  h2 {
    font-size: 3.25rem;
  }
  
  a {
    color: #477ca7;
  }
  
  a:visited {
    color: #74638f;
  }
  
  #main {
    margin: 30px 8px;
    padding: 15px;
    border-radius: 5px;
    background:skyblue;
    height:900px;
  }
  
  @media (max-width: 460px) {
    #main {
      margin: 0;
    }
  }
  

  @media (max-width: 460px) {
    #img-caption {
      font-size: 1.4rem;
    }
  }
  
  #headline {
    margin: 50px 0;
    text-align: center;
  }
  
  ul {
    max-width: 550px;
    margin: 0 auto 50px auto;
    text-align: left;
    line-height: 1.6;
  }
  
  li {
    margin: 16px 0;
  }
  
  blockquote {
    font-style: italic;
    max-width: 545px;
    margin: 0 auto 50px auto;
    text-align: left;
  }

</style>
