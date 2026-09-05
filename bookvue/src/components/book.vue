 <template lang="">
    <div class="beijing">
        <div id="box" class="container">
        
        <div class="panel panel-primary">
              <div class="panel-heading form-inline">
                  <label>
            Id:
            <input type="text" class="form-control" v-model="id">
            </label>

            <label>
            Name:
            <input type="text" class="form-control" v-model="name" @keyup.f2="add">
            </label>
            <input type="button" value="添加" class="btn btn-primary" @click="add()">


                    <label>
                        <!-- 按照书名关键字搜索：<input type="text" v-model="keywords" class="form-control"> -->
                        搜索名称关键字：<input type="text" class="form-control" v-model="keywords" id="search" v-focus v-color="'green'">
                        <!-- <input type="button" value="添加" class="btn btn-primary" @click="add()"> -->
                    
                    </label>
                    </h3>
              </div>
        </div>
        <table class="table table-bordered table-hover">
            <thead>
                <tr>
                    <th>编号</th>
                    <th>商品名</th>
                    <th>单价</th>
                    <th>先存数量</th>
                    <th>入库时间</th>
                    <th>基本操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in books" :key="item.id">
                    <td>{{item.id}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.price}}</td>
                    <td>{{item.num}}</td>
                    <td>{{item.ctime}}</td>
                    <td>
                        <!-- <input type="button" value="删除" class="btn btn-danger">
                        <input type="button" value="添加" class="btn btn-primary"> -->
                        <a href="" @click.prevent="handelConfirm(item.id)">删除</a>
                        <a href="" @click.prevent="updateInfo(item.id)">修改</a>
                    </td>
                    
                </tr>
            </tbody>
        </table>
        <div class="row">
            <div class="col-md-3">
                <img src="../assets/1.jpg">
                <h5>名称：W周边</h5>
                <h5>单价：$130</h5>
            </div>
            <div class="col-md-3">
                <img src="../assets/2.jpg">
                <h5>名称：ooo腰带</h5>
                <h5>单价：$140</h5>
            </div>
            <div class="col-md-3">
                <img src="../assets/3.jpg">
                <h5>名称：decade腰带</h5>
                <h5>单价：$230</h5>
            </div>
            <div class="col-md-3">
                <img src="../assets/4.jpg">
                <h5>名称：W腰带</h5>
                <h5>单价：$180</h5>
            </div>
             <div class="col-md-3">
                <img src="../assets/5.jpg">
                <h5>名称：时王腰带</h5>
                <h5>单价：$180</h5>
            </div>
              <div class="col-md-3">
                <img src="../assets/6.jpg">
                <h5>名称：利维斯腰带</h5>
                <h5>单价：$180</h5>
            </div>
              <div class="col-md-3">
                <img src="../assets/7.jpg">
                <h5>名称：01腰带</h5>
                <h5>单价：$180</h5>
            </div>
              <div class="col-md-3">
                <img src="../assets/8.jpg">
                <h5>名称：Bulid腰带</h5>
                <h5>单价：$180</h5>
            </div>
        </div>
    </div>
    </div>
    </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      books: [],
      keywords: '',
    };
  },
  created() {
    this.getAll();
  },
  watch:{
        keywords(){ 
        axios({
          url:'http://localhost:3000/books',
          method:'GET',
          params:{
            name_like:this.keywords
          }
        })
        .then(response =>{
          this.books = response.data
        })
        .catch(error => {
          alert("搜索失败")
        })
        }
      },
  methods: {
    getAll() {
      axios({
        url: "http://localhost:3000/books",
        method: "GET",
      })
        .then((response) => {
          this.books = response.data;
        })
        .catch((error) => {
          alert("获取数据失败");
        });
    },
    handelConfirm(id) {
      var flag = confirm("是否删除该数据？");
      if (flag) {
        this.del(id);
      }
    },
    del(id) {
      axios({
        url: "http://localhost:3000/books/" + id,
        method: "DELETE",
      })
        .then((response) => {
          this.getAll();
        })
        .catch((error) => {
          alert("删除数据失败");
        });
    },
    add() { 
          axios({
            url:'http://localhost:3000/books',
            method:'POST',
            data:{
              id:this.id,
              name:this.name,
              ctime:new Date()
            }
          })
          .then((response) => {
              this.getAll();
              this.id = this.name = ''
          })
          .catch((error) => {
              alert("数据添加失败")
          })
          
        },
    
  },
};
</script>
<style lang="">
img {
  height: 200px;
  width: 200px;
}
div h5 {
  font-size: 16px;
  color: red;
  font-family: "华文楷体";
}
.row {
  padding-left: 25px;
}
.beijing{
  background-image:url("../assets/beijing.jpg");
}
</style>
